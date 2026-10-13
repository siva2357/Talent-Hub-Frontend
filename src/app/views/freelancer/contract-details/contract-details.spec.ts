import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContractDetails } from './contract-details';
import { ContractService } from '../../../core/services/contract.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContractDetails', () => {
  let component: ContractDetails;
  let fixture: ComponentFixture<ContractDetails>;

  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockContractData = {
    _id: 'c-100',
    contractTitle: 'Senior Full Stack Engineer',
    contractDescription: 'Build high-traffic microservices and Angular frontends',
    contractType: 'Fixed',
    contractCategory: 'Web Development',
    estimatedBudget: 4500,
    currency: '₹',
    contractStartDate: '2026-04-01T00:00:00.000Z',
    contractEndDate: '2026-10-01T00:00:00.000Z',
    hasApplied: false,
    hasSaved: false
  } as any;

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', [
      'getContractById',
      'applyForContract',
      'withdrawFromContract',
      'saveContract',
      'unsaveContract'
    ]);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    mockContractService.getContractById.and.returnValue(of({
      success: true,
      data: structuredClone(mockContractData)
    }));

    await TestBed.configureTestingModule({
      imports: [ContractDetails],
      providers: [
        provideRouter([]),
        { provide: ContractService, useValue: mockContractService },
        { provide: ToastService, useValue: mockToastService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? 'c-100' : null
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ContractDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization & Loading', () => {
    it('should fetch contract details when contractId is present in route', () => {
      expect(mockContractService.getContractById).toHaveBeenCalledWith('c-100');
      expect(component.contract).toBeDefined();
      expect(component.contract?.contractTitle).toBe('Senior Full Stack Engineer');
      expect(component.isApplied).toBeFalse();
      expect(component.isSaved).toBeFalse();
      expect(component.isLoading).toBeFalse();
    });

    it('should initialize applied and saved status flags from fetched contract data', () => {
      const contractWithFlags = { ...mockContractData, hasApplied: true, hasSaved: true };
      mockContractService.getContractById.and.returnValue(of({
        success: true,
        data: contractWithFlags
      }));

      component.fetchContractDetails();

      expect(component.isApplied).toBeTrue();
      expect(component.isSaved).toBeTrue();
    });

    it('should handle fetch contract error gracefully', () => {
      spyOn(console, 'error');
      mockContractService.getContractById.and.returnValue(throwError(() => new Error('Contract not found')));

      component.fetchContractDetails();

      expect(component.isLoading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });

    it('should set isLoading to false if route param id is missing', () => {
      const emptyRoute = {
        snapshot: {
          paramMap: {
            get: () => null
          }
        }
      };
      const testComp = new ContractDetails(emptyRoute as any, mockContractService, mockToastService);
      testComp.ngOnInit();

      expect(testComp.contractId).toBeNull();
      expect(testComp.isLoading).toBeFalse();
    });
  });

  describe('Project Stats Getter', () => {
    it('should return empty stats array when contract is null', () => {
      component.contract = null;
      expect(component.projectStats).toEqual([]);
    });

    it('should format stats correctly when contract is loaded', () => {
      const stats = component.projectStats;
      expect(stats.length).toBe(5);
      expect(stats[0].title).toBe('Contract Type');
      expect(stats[0].value).toBe('Fixed');
      expect(stats[1].title).toBe('Estimated Budget');
      expect(stats[1].value).toBe('₹ 4500');
      expect(stats[2].title).toBe('Category');
      expect(stats[2].value).toBe('Web Development');
      expect(stats[3].title).toBe('Start Date');
      expect(stats[4].title).toBe('End Date');
    });

    it('should handle missing dates and budgets with default placeholders', () => {
      component.contract = {
        _id: 'c-test',
        contractTitle: 'Incomplete Contract',
        contractStartDate: undefined,
        contractEndDate: undefined,
        currency: undefined,
        estimatedBudget: 0
      } as any;

      const stats = component.projectStats;
      expect(stats[1].value).toBe('₹ 0');
      expect(stats[3].value).toBe('Not Set');
      expect(stats[4].value).toBe('Not Set');
    });
  });

  describe('Apply for Contract Flow', () => {
    it('should apply for contract successfully', fakeAsync(() => {
      mockContractService.applyForContract.and.returnValue(of({ success: true, message: 'Applied successfully' }));

      component.applyForContract();

      expect(component.isApplying).toBeTrue();
      expect(mockContractService.applyForContract).toHaveBeenCalledWith('c-100');

      tick(500);

      expect(component.isApplied).toBeTrue();
      expect(mockToastService.show).toHaveBeenCalledWith('Successfully applied to the contract!', 'success');
      expect(component.isApplying).toBeFalse();
    }));

    it('should handle error when applying for contract fails', fakeAsync(() => {
      spyOn(console, 'error');
      mockContractService.applyForContract.and.returnValue(throwError(() => ({
        error: { message: 'Already applied' }
      })));

      component.applyForContract();

      tick(500);

      expect(console.error).toHaveBeenCalled();
      expect(mockToastService.show).toHaveBeenCalledWith('Already applied', 'error');
      expect(component.isApplying).toBeFalse();
    }));

    it('should return early if contractId is null when applying', () => {
      component.contractId = null;
      component.applyForContract();
      expect(mockContractService.applyForContract).not.toHaveBeenCalled();
    });
  });

  describe('Withdraw Application Flow', () => {
    it('should withdraw application successfully', fakeAsync(() => {
      component.isApplied = true;
      mockContractService.withdrawFromContract.and.returnValue(of({ success: true, message: 'Withdrawn' }));

      component.withdrawApplication();

      expect(component.isApplying).toBeTrue();
      expect(mockContractService.withdrawFromContract).toHaveBeenCalledWith('c-100');

      tick(500);

      expect(component.isApplied).toBeFalse();
      expect(mockToastService.show).toHaveBeenCalledWith('Successfully withdrawn application.', 'info');
      expect(component.isApplying).toBeFalse();
    }));

    it('should handle error when withdrawing application fails', fakeAsync(() => {
      spyOn(console, 'error');
      mockContractService.withdrawFromContract.and.returnValue(throwError(() => ({
        error: { message: 'Withdraw failed' }
      })));

      component.withdrawApplication();

      tick(500);

      expect(console.error).toHaveBeenCalled();
      expect(mockToastService.show).toHaveBeenCalledWith('Withdraw failed', 'error');
      expect(component.isApplying).toBeFalse();
    }));

    it('should return early if contractId is null when withdrawing', () => {
      component.contractId = null;
      component.withdrawApplication();
      expect(mockContractService.withdrawFromContract).not.toHaveBeenCalled();
    });
  });

  describe('Toggle Save Flow', () => {
    it('should save an unsaved contract', () => {
      component.isSaved = false;
      mockContractService.saveContract.and.returnValue(of({ success: true, message: 'Saved' }));

      component.toggleSave();

      expect(mockContractService.saveContract).toHaveBeenCalledWith('c-100');
      expect(component.isSaved).toBeTrue();
      expect(component.isSaving).toBeFalse();
    });

    it('should unsave an already saved contract', () => {
      component.isSaved = true;
      mockContractService.unsaveContract.and.returnValue(of({ success: true, message: 'Unsaved' }));

      component.toggleSave();

      expect(mockContractService.unsaveContract).toHaveBeenCalledWith('c-100');
      expect(component.isSaved).toBeFalse();
      expect(component.isSaving).toBeFalse();
    });

    it('should handle error when saving fails', () => {
      spyOn(console, 'error');
      component.isSaved = false;
      mockContractService.saveContract.and.returnValue(throwError(() => new Error('Save failed')));

      component.toggleSave();

      expect(console.error).toHaveBeenCalled();
      expect(component.isSaved).toBeFalse();
      expect(component.isSaving).toBeFalse();
    });

    it('should handle error when unsaving fails', () => {
      spyOn(console, 'error');
      component.isSaved = true;
      mockContractService.unsaveContract.and.returnValue(throwError(() => new Error('Unsave failed')));

      component.toggleSave();

      expect(console.error).toHaveBeenCalled();
      expect(component.isSaved).toBeTrue();
      expect(component.isSaving).toBeFalse();
    });

    it('should return early if contractId is null or isSaving is true', () => {
      component.contractId = null;
      component.toggleSave();
      expect(mockContractService.saveContract).not.toHaveBeenCalled();

      component.contractId = 'c-100';
      component.isSaving = true;
      component.toggleSave();
      expect(mockContractService.saveContract).not.toHaveBeenCalled();
    });
  });
});
