import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateContract } from './create-contract';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CreateContract', () => {
  let component: CreateContract;
  let fixture: ComponentFixture<CreateContract>;

  let mockContractService: jasmine.SpyObj<ContractService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockMasterDataService: jasmine.SpyObj<MasterDataService>;
  let router: Router;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockContractService = jasmine.createSpyObj('ContractService', ['getClientContractById', 'createContract', 'updateContract']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);
    mockMasterDataService = jasmine.createSpyObj('MasterDataService', ['getAllMasterData']);

    mockActivatedRoute = {
      queryParams: of({ id: '123' })
    };

    mockMasterDataService.getAllMasterData.and.returnValue(of({
      success: true,
      data: {
        ContractTypes: [{ key: 'fixed', value: 'Fixed Price' }],
        ContractCategories: [{ key: 'web', value: 'Web Development' }],
        ContractSubjects: [{ key: 'dev', value: 'Development' }],
        ContractStatus: [{ key: 'draft', value: 'Draft' }]
      }
    }));

    mockContractService.getClientContractById.and.returnValue(of({
      success: true,
      contract: {
        _id: '123',
        clientId: 'client-1',
        contractTitle: 'Existing_Contract',
        contractType: 'fixed',
        contractCategory: 'web',
        contractSubject: 'dev',
        contractDescription: 'Test',
        contractStartDate: '2026-10-01T00:00:00.000Z',
        contractEndDate: '2026-10-31T00:00:00.000Z',
        status: 'draft',
        estimatedBudget: 50000,
        currency: 'INR'
      }
    } as any));
    mockContractService.createContract.and.returnValue(of({ success: true, data: {} as any }));
    mockContractService.updateContract.and.returnValue(of({ success: true, data: {} as any }));

    await TestBed.configureTestingModule({
      imports: [CreateContract, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideRouter([]),
        { provide: ContractService, useValue: mockContractService },
        { provide: ToastService, useValue: mockToastService },
        { provide: MasterDataService, useValue: mockMasterDataService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateContract);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load master data on init', () => {
    expect(mockMasterDataService.getAllMasterData).toHaveBeenCalled();
    expect(component.contractTypeOptions.length).toBe(1);
    expect(component.contractCategoryOptions.length).toBe(1);
  });

  it('should load contract data if id is in query params', () => {
    expect(component.editContractId).toBe('123');
    expect(mockContractService.getClientContractById).toHaveBeenCalledWith('123');
    expect(component.contractForm.get('contractTitle')?.value).toBe('Existing_Contract');
  });

  it('should calculate duration details correctly', () => {
    const details = component.durationDetails;
    expect(details.totalDays).toBeGreaterThan(0);
    expect(details.workingDays).toBeGreaterThan(0);
    expect(details.weeks).toBeGreaterThan(0);
    expect(details.approxMonths).toBeGreaterThan(0);
  });

  it('should not submit if form is invalid', () => {
    // Make form invalid by clearing required field
    component.contractForm.get('contractTitle')?.setValue('');
    component.submitContract();
    
    expect(mockToastService.show).toHaveBeenCalledWith('Please complete all required fields correctly.', 'warning');
    expect(mockContractService.updateContract).not.toHaveBeenCalled();
    expect(mockContractService.createContract).not.toHaveBeenCalled();
  });

  it('should call updateContract when editContractId is set', () => {
    // Form is already valid from the mock loaded data, but agreeToTerms need to be checked in mock
    component.contractForm.get('agreeToTerms1')?.setValue(true);
    component.contractForm.get('agreeToTerms2')?.setValue(true);
    component.contractForm.get('agreeToTerms3')?.setValue(true);
    
    expect(component.contractForm.valid).toBeTrue();
    
    component.submitContract();
    
    expect(mockContractService.updateContract).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-contract']);
  });

  it('should call createContract when editContractId is empty', () => {
    component.editContractId = '';
    component.contractForm.patchValue({
      contractTitle: 'New_Contract',
      contractType: 'fixed',
      contractCategory: 'web',
      contractSubject: 'dev',
      contractDescription: 'Test',
      contractStartDate: '2026-10-01',
      contractEndDate: '2026-10-31',
      status: 'draft',
      estimatedBudget: 50000,
      currency: 'INR'
    });
    component.contractForm.get('agreeToTerms1')?.setValue(true);
    component.contractForm.get('agreeToTerms2')?.setValue(true);
    component.contractForm.get('agreeToTerms3')?.setValue(true);
    
    component.submitContract();
    
    expect(mockContractService.createContract).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/manage-contract']);
  });
});
