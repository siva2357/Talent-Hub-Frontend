import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialSummaryComponent } from './financial-summary.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractService } from '../../../../../core/services/contract.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('FinancialSummaryComponent', () => {
  let component: FinancialSummaryComponent;
  let fixture: ComponentFixture<FinancialSummaryComponent>;
  let mockFinanceService: any;
  let mockContractService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockFinanceService = {
      getStats: jasmine.createSpy('getStats').and.returnValue(of({ success: true, stats: { totalBalance: 1000, totalSpent: 500, upcomingPayments: 200, platformFeesPaid: 50 } })),
      getInvoices: jasmine.createSpy('getInvoices').and.returnValue(of({ success: true, invoices: [{_id: 'inv-1', contractId: { _id: '1' }}] })),
      getInvoicePdfUrl: jasmine.createSpy('getInvoicePdfUrl').and.returnValue('http://test.com/invoice.pdf')
    };

    mockContractService = {
      getMyContracts: jasmine.createSpy('getMyContracts').and.returnValue(of({ success: true, contracts: [{
        _id: '1', contractTitle: 'Test', estimatedBudget: 1000, spent: 500, funded: 600, status: 'completed'
      }] }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FinancialSummaryComponent, FormsModule],
      providers: [
        { provide: FinanceService, useValue: mockFinanceService },
        { provide: ContractService, useValue: mockContractService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(mockFinanceService.getStats).toHaveBeenCalled();
    expect(component.totalBalance()).toBe(1000);
    expect(component.totalSpent()).toBe(500);
    expect(component.upcomingPayments()).toBe(200);
    expect(component.platformFeesPaid()).toBe(50);
  });

  it('should load invoices on init', () => {
    expect(mockContractService.getMyContracts).toHaveBeenCalled();
    expect(component.invoices().length).toBe(1);
    expect(component.filteredInvoices().length).toBe(1);
    expect(component.invoices()[0].remainingAmount).toBe(400); // 1000 - 600
  });

  it('should filter invoices', () => {
    component.pendingSearchQuery = 'Test';
    component.pendingStatusFilter = 'completed';
    component.applyFiltersBtn();

    expect(component.filteredInvoices().length).toBe(1);

    component.pendingSearchQuery = 'NonExistent';
    component.applyFiltersBtn();
    expect(component.filteredInvoices().length).toBe(0);
  });

  it('should reset filters', () => {
    component.searchQuery = 'Test';
    component.resetFilters();
    expect(component.searchQuery).toBe('');
    expect(component.statusFilter).toBe('All');
  });

  it('should fund contract', () => {
    const inv = component.invoices()[0];
    component.fundContract(inv);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user/payment-gateway'], {
      queryParams: { amount: 400, contractId: '1', contractTitle: 'Test' }
    });
  });

  it('should download invoice', () => {
    spyOn(window, 'open');
    const inv = component.invoices()[0];
    component.downloadInvoice(inv);
    
    expect(mockFinanceService.getInvoices).toHaveBeenCalled();
    expect(mockFinanceService.getInvoicePdfUrl).toHaveBeenCalledWith('inv-1');
    expect(window.open).toHaveBeenCalledWith('http://test.com/invoice.pdf', '_blank');
  });
});
