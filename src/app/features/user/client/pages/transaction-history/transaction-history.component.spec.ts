import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TransactionHistoryComponent } from './transaction-history.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { of } from 'rxjs';

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let financeServiceSpy: jasmine.SpyObj<FinanceService>;
  let diaryServiceSpy: jasmine.SpyObj<ContractDiaryService>;

  const mockDiaries = {
    success: true,
    diaries: [
      {
        _id: 'diary1',
        contractId: { _id: 'contract1', contractTitle: 'Test Contract 1', budgetType: 'Hourly', estimatedBudget: 1000 },
        freelancerId: { registrationDetails: { fullName: 'John Doe' } },
        phases: [
          { _id: 'phase1', name: 'Phase 1', deadline: '2023-01-01', amount: 500, status: 'approved' },
          { _id: 'phase2', name: 'Phase 2', deadline: '2023-02-01', amount: 500, status: 'pending' }
        ]
      },
      {
        _id: 'diary2',
        contractId: { _id: 'contract2', contractTitle: 'Test Contract 2', budgetType: 'Fixed Price', estimatedBudget: 2000 },
        freelancerId: { registrationDetails: { fullName: 'Jane Doe' } },
        phases: [
          { _id: 'phase3', name: 'Phase 3', deadline: '2023-03-01', amount: 2000, status: 'pending' }
        ]
      }
    ]
  };

  beforeEach(async () => {
    const fsSpy = jasmine.createSpyObj('FinanceService', ['getContractTransactions']);
    const dsSpy = jasmine.createSpyObj('ContractDiaryService', ['reviewPhase']);

    fsSpy.getContractTransactions.and.returnValue(of(mockDiaries));

    await TestBed.configureTestingModule({
      imports: [TransactionHistoryComponent],
      providers: [
        { provide: FinanceService, useValue: fsSpy },
        { provide: ContractDiaryService, useValue: dsSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    financeServiceSpy = TestBed.inject(FinanceService) as jasmine.SpyObj<FinanceService>;
    diaryServiceSpy = TestBed.inject(ContractDiaryService) as jasmine.SpyObj<ContractDiaryService>;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load diaries and map them to contracts on init', () => {
    expect(financeServiceSpy.getContractTransactions).toHaveBeenCalled();
    expect(component.contracts().length).toBe(2);
    expect(component.contracts()[0].title).toBe('Test Contract 1');
    expect(component.contracts()[0].totalTransacted).toBe(500); // 500 from approved phase1
  });

  it('should filter contracts by search query', () => {
    component.pendingSearchQuery = 'Test Contract 2';
    component.applyFiltersBtn();
    
    expect(component.filteredContracts().length).toBe(1);
    expect(component.filteredContracts()[0].title).toBe('Test Contract 2');
  });

  it('should filter contracts by type', () => {
    component.pendingTypeFilter = 'Hourly';
    component.applyFiltersBtn();
    
    expect(component.filteredContracts().length).toBe(1);
    expect(component.filteredContracts()[0].type).toBe('Hourly');
  });

  it('should reset filters', () => {
    component.pendingSearchQuery = 'Test';
    component.pendingTypeFilter = 'Hourly';
    component.applyFiltersBtn();
    
    component.resetFilters();
    expect(component.searchQuery()).toBe('');
    expect(component.typeFilter()).toBe('All');
  });
});
