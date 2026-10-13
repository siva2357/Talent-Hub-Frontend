import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialSummary } from './financial-summary';
import { TransactionService } from '../../../core/services/transaction.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinancialSummary', () => {
  let component: FinancialSummary;
  let fixture: ComponentFixture<FinancialSummary>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', [
      'getFinanceStats',
      'getInvoices',
      'downloadInvoicePdf'
    ]);

    mockTransactionService.getFinanceStats.and.returnValue(of({
      success: true,
      stats: {
        totalSpent: 1000,
        upcomingPayments: 500,
        platformFeesPaid: 100,
        pendingPayments: 200
      }
    }));

    mockTransactionService.getInvoices.and.returnValue(of({
      success: true,
      invoices: [
        { type: 'Escrow Funded', amount: 500 },
        { type: 'Other', amount: 100 }
      ]
    }));

    await TestBed.configureTestingModule({
      imports: [FinancialSummary],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data and stats correctly', () => {
    expect(mockTransactionService.getFinanceStats).toHaveBeenCalled();
    expect(component.stats.totalSpent).toBe(1000);
    expect(component.stats.escrowBalance).toBe(500);
    expect(component.statCards.length).toBe(4);
  });

  it('should filter invoices correctly', () => {
    expect(mockTransactionService.getInvoices).toHaveBeenCalled();
    
    // Only 'Escrow Funded' or 'Deposit'
    expect(component.invoices.length).toBe(1);
    expect(component.invoices[0].type).toBe('Escrow Funded');
  });

  it('should generate distribution chart data', () => {
    component.generateDistributionChart();
    expect(component.distributionChart.length).toBe(4);
    expect(component.distributionChart[0].amount).toBe(1000); // totalSpent
    expect(component.distributionChart[1].amount).toBe(500); // escrowBalance
  });

  it('should format short id correctly', () => {
    expect(component.getShortId('1234567890')).toBe('12345678');
    expect(component.getShortId('')).toBe('');
  });

  it('should download invoice pdf', () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    mockTransactionService.downloadInvoicePdf.and.returnValue(of(mockBlob));
    
    spyOn(document, 'createElement').and.callThrough();
    
    component.downloadInvoice('INV-123');
    
    expect(mockTransactionService.downloadInvoicePdf).toHaveBeenCalledWith('INV-123');
    expect(document.createElement).toHaveBeenCalledWith('a');
  });
});
