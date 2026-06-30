import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractFormComponent } from './contract-form.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { Router, ActivatedRoute, provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { BudgetTypeEnum, ContractStatusEnum } from '../../../../../core/enums/contract.enum';
import { Category } from '../../../../../core/enums/category.enum';

describe('ContractFormComponent', () => {
  let component: ContractFormComponent;
  let fixture: ComponentFixture<ContractFormComponent>;

  // Mocks
  let mockContractService: any;
  let mockRouter: any;
  let mockToastr: any;
  let queryParamsSubject: Subject<any>;

  beforeEach(async () => {
    // 1. Setup Mocks
    mockContractService = {
      createContract: jasmine.createSpy('createContract').and.returnValue(of({ message: 'Success' })),
      updateContract: jasmine.createSpy('updateContract').and.returnValue(of({ message: 'Success' })),
      getMyContractById: jasmine.createSpy('getMyContractById').and.returnValue(of({
        contract: {
          contractTitle: 'Existing Contract',
          budgetType: BudgetTypeEnum.FIXED_PRICE,
          estimatedBudget: 50000,
          contractStartDate: '2026-06-26T11:29:24.196Z',
          contractEndDate: '2026-09-30T11:29:24.196Z',
          contractDescription: 'This is a description',
          contractType: Category.WebDevelopment,
          contractSubject: 'Angular',
          status: ContractStatusEnum.PENDING
        }
      }))
    };

    mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };

    queryParamsSubject = new Subject<any>();

    // 2. Configure Module
    await TestBed.configureTestingModule({
      imports: [ContractFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: ToastrService, useValue: mockToastr },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParams: queryParamsSubject.asObservable() } }
      ]
    })
    .compileComponents();

    // 3. Create Component & Spy on Router
    fixture = TestBed.createComponent(ContractFormComponent);
    component = fixture.componentInstance;
    
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate');
  });

  it('should create and initialize form', () => {
    // ACT: trigger ngOnInit
    fixture.detectChanges();

    // ASSERT
    expect(component).toBeTruthy();
    expect(component.contractForm).toBeDefined();
    expect(component.mode()).toBe('create');
  });

  it('should switch to edit mode and fetch details if id is in queryParams', () => {
    // ARRANGE: Trigger init
    fixture.detectChanges();

    // ACT: Simulate the route passing an ID
    queryParamsSubject.next({ id: '123' });

    // ASSERT
    expect(component.mode()).toBe('edit');
    expect(component.contractId()).toBe('123');
    expect(mockContractService.getMyContractById).toHaveBeenCalledWith('123');
    expect(component.contractForm.value.contractTitle).toBe('Existing Contract');
  });

  it('should not submit if form is invalid', () => {
    // ARRANGE
    fixture.detectChanges();
    spyOn(component.contractForm, 'markAllAsTouched');
    
    // Set invalid data (missing title, budget too low, etc)
    component.contractForm.patchValue({ contractTitle: '' });

    // ACT
    component.onSubmit();

    // ASSERT
    expect(component.contractForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockContractService.createContract).not.toHaveBeenCalled();
    expect(mockContractService.updateContract).not.toHaveBeenCalled();
  });

  it('should call createContract on valid submit (create mode)', () => {
    // ARRANGE
    fixture.detectChanges();
    
    // Fill form with valid data
    component.contractForm.patchValue({
      contractTitle: 'New Website Project',
      budgetType: BudgetTypeEnum.FIXED_PRICE,
      estimatedBudget: 50000,
      contractStartDate: '2026-07-01',
      contractEndDate: '2026-10-01',
      contractDescription: 'Need a new website.',
      contractType: Category.WebDevelopment,
      contractSubject: 'Angular',
      status: ContractStatusEnum.PENDING
    });

    // ACT
    component.onSubmit();

    // ASSERT
    expect(mockContractService.createContract).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalledWith('Contract created successfully!', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/your-contracts']);
  });

  it('should call updateContract on valid submit (edit mode)', () => {
    // ARRANGE
    fixture.detectChanges();
    queryParamsSubject.next({ id: '123' }); // switches to edit mode
    
    // Form is auto-filled by the mock response in this scenario, so it is valid.

    // ACT
    component.onSubmit();

    // ASSERT
    expect(mockContractService.updateContract).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalledWith('Contract updated successfully!', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/your-contracts']);
  });
});
