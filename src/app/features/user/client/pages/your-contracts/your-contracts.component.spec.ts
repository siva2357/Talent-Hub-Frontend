import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourContractsComponent } from './your-contracts.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ContractStatusEnum, BudgetTypeEnum } from '../../../../../core/enums/contract.enum';
import { Category } from '../../../../../core/enums/category.enum';
import { ActivatedRoute } from '@angular/router';

describe('YourContractsComponent', () => {
  let component: YourContractsComponent;
  let fixture: ComponentFixture<YourContractsComponent>;
  let mockContractService: any;
  let mockRouter: any;

  const mockContracts = [
    {
      _id: '1',
      contractTitle: 'Frontend Development',
      contractSubject: 'Angular App',
      contractType: Category.WebDevelopment,
      budgetType: BudgetTypeEnum.FIXED_PRICE,
      estimatedBudget: 5000,
      contractStartDate: new Date().toISOString(),
      contractEndDate: new Date().toISOString(),
      status: ContractStatusEnum.PENDING,
      spent: 0,
      funded: 0,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      contractTitle: 'Backend API',
      contractSubject: 'Node.js API',
      contractType: Category.WebDevelopment,
      budgetType: BudgetTypeEnum.HOURLY_RATE,
      estimatedBudget: 2000,
      contractStartDate: new Date().toISOString(),
      contractEndDate: new Date().toISOString(),
      status: ContractStatusEnum.IN_PROGRESS,
      spent: 0,
      funded: 0,
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    mockContractService = {
      getMyContracts: jasmine.createSpy('getMyContracts').and.returnValue(of({ contracts: mockContracts }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [YourContractsComponent],
      providers: [
        { provide: ContractService, useValue: mockContractService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create and fetch contracts on init', () => {
    expect(component).toBeTruthy();
    expect(mockContractService.getMyContracts).toHaveBeenCalled();
    expect(component.contracts().length).toBe(2);
    expect(component.filteredContracts().length).toBe(2);
  });

  it('should filter contracts based on search query', () => {
    // ARRANGE: Set up the pending filter value
    component.pendingSearchQuery = 'Frontend';

    // ACT: Simulate the user clicking the apply filter button
    component.applyFiltersBtn();
    
    // ASSERT: Verify the computed signal recalculated correctly
    expect(component.filteredContracts().length).toBe(1);
    expect(component.filteredContracts()[0].contractTitle).toBe('Frontend Development');
  });

  it('should filter contracts based on status', () => {
    // ARRANGE: Set the status filter
    component.pendingStatusFilter = ContractStatusEnum.IN_PROGRESS;

    // ACT: Apply the filter
    component.applyFiltersBtn();
    
    // ASSERT: Check the result
    expect(component.filteredContracts().length).toBe(1);
    expect(component.filteredContracts()[0].status).toBe(ContractStatusEnum.IN_PROGRESS);
  });

  it('should reset filters to default values', () => {
    // ARRANGE: Apply filters first so we have a non-default state
    component.pendingSearchQuery = 'Frontend';
    component.pendingStatusFilter = ContractStatusEnum.PENDING;
    component.applyFiltersBtn();
    expect(component.filteredContracts().length).toBe(1);

    // ACT: Simulate clicking the "Clear Filters" button
    component.resetFilters();

    // ASSERT: Verify state has returned to default empty values
    expect(component.searchQuery()).toBe('');
    expect(component.statusFilter()).toBe('');
    expect(component.filteredContracts().length).toBe(2); // Should show all again
  });

  it('should increase display count when scrolling near bottom', () => {
    // Initial display count is 10
    expect(component.displayCount()).toBe(10);
    
    // Simulate scrolling by forcing the condition
    // For testing, we can directly update the signal if needed, or mock window properties
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 5000, writable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 6000, writable: true });
    
    // Generate more mock contracts to exceed 10
    const manyContracts = Array(15).fill(mockContracts[0]);
    component.contracts.set(manyContracts as any);
    
    component.onScroll();
    
    // Since 1000 + 5000 >= 6000 - 200, it should increase by 10
    expect(component.displayCount()).toBe(20);
  });

  it('should navigate to proposals when viewing applicants', () => {
    component.viewApplicants('contract-123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/contract-proposals'], { queryParams: { contractId: 'contract-123' }});
  });

  it('should toggle action menu visibility', () => {
    // ARRANGE: Create a fake click event and mock its target
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');
    const targetEl = document.createElement('div');
    Object.defineProperty(mockEvent, 'currentTarget', { value: targetEl });
    
    // ACT 1: Open the menu for the first contract
    component.toggleActionMenu(mockEvent, mockContracts[0] as any);

    // ASSERT 1: Verify it opened
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.activeActionRow?._id).toBe('1');
    
    // ACT 2: Click the same row again
    component.toggleActionMenu(mockEvent, mockContracts[0] as any);

    // ASSERT 2: Verify it closed
    expect(component.activeActionRow).toBeNull();
  });
});
