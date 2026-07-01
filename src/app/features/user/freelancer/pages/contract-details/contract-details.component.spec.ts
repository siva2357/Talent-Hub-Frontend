import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContractDetailsComponent } from './contract-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ContractService } from '../../../../../core/services/contract.service';

describe('ContractDetailsComponent', () => {
  let component: ContractDetailsComponent;
  let fixture: ComponentFixture<ContractDetailsComponent>;
  let mockContractService: any;
  let mockRoute: any;

  beforeEach(async () => {
    mockContractService = {
      getSingleContract: jasmine.createSpy('getSingleContract').and.returnValue(of({
        contract: {
          _id: '1',
          contractTitle: 'Senior Angular Developer',
          budgetType: 'Fixed Price',
          estimatedBudget: 10000,
          totalDuration: '3 Months',
          status: 'Open',
          hasApplied: false,
          hasSaved: false,

          contractDescription: '<p>Description</p>'
        }
      })),
      applyToContract: jasmine.createSpy('applyToContract').and.returnValue(of({})),
      withdrawContractApplication: jasmine.createSpy('withdrawContractApplication').and.returnValue(of({})),
      saveContract: jasmine.createSpy('saveContract').and.returnValue(of({})),
      unsaveContract: jasmine.createSpy('unsaveContract').and.returnValue(of({}))
    };

    mockRoute = {
      queryParams: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [ContractDetailsComponent, RouterTestingModule],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load contract on init', () => {
    expect(component.contractId()).toBe('1');
    expect(mockContractService.getSingleContract).toHaveBeenCalledWith('1');
    expect(component.contract()?.contractTitle).toBe('Senior Angular Developer');
  });

  it('should apply to contract and update signal', fakeAsync(() => {
    component.applyToContract();
    tick();
    expect(mockContractService.applyToContract).toHaveBeenCalledWith('1');
    expect(component.contract()?.hasApplied).toBeTrue();

  }));

  it('should withdraw from contract and update signal', fakeAsync(() => {
    component.contract.update(c => {
      if (c) {
        c.hasApplied = true;
      }
      return c;
    });
    component.withdrawApplication();
    tick();
    expect(mockContractService.withdrawContractApplication).toHaveBeenCalledWith('1');
    expect(component.contract()?.hasApplied).toBeFalse();

  }));

  it('should save contract', fakeAsync(() => {
    component.toggleSaveContract();
    tick();
    expect(mockContractService.saveContract).toHaveBeenCalledWith('1');
    expect(component.contract()?.hasSaved).toBeTrue();
  }));

  it('should unsave contract', fakeAsync(() => {
    component.contract.update(c => {
      if (c) c.hasSaved = true;
      return c;
    });
    component.toggleSaveContract();
    tick();
    expect(mockContractService.unsaveContract).toHaveBeenCalledWith('1');
    expect(component.contract()?.hasSaved).toBeFalse();
  }));
});
