import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinanceOverview } from './finance-overview';
import { TransactionService } from '../../../core/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FinanceOverview', () => {
  let component: FinanceOverview;
  let fixture: ComponentFixture<FinanceOverview>;

  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;

  const mockReportData = [
    {
      contractId: 'contract-1',
      title: 'Full Stack Web Platform',
      type: 'fixed',
      budget: 10000,
      status: 'completed',
      lastPaymentDate: '2026-03-01',
      earned: 10000,
      platformFeesDeducted: 750,
      receivedAmount: 9250,
      grossWithdrawnAmount: 5000,
      netWithdrawnAmount: 4625,
      pendingWithdrawnAmount: 0
    },
    {
      contractId: 'contract-2',
      title: 'UI Design System',
      type: 'hourly',
      budget: 4000,
      status: 'completed',
      lastPaymentDate: '2026-03-15',
      earned: 4000,
      platformFeesDeducted: 300,
      receivedAmount: 3700,
      grossWithdrawnAmount: 3700,
      netWithdrawnAmount: 3422.5,
      pendingWithdrawnAmount: 0
    },
    {
      contractId: 'contract-3',
      title: 'DevOps Pipeline Setup',
      type: 'fixed',
      budget: 6000,
      status: 'in progress',
      lastPaymentDate: '2026-04-01',
      earned: 6000,
      platformFeesDeducted: 450,
      receivedAmount: 5550,
      grossWithdrawnAmount: 0,
      netWithdrawnAmount: 0,
      pendingWithdrawnAmount: 2000
    }
  ];

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', [
      'getFreelancerFinanceReport',
      'withdrawFunds'
    ]);
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

    mockTransactionService.getFreelancerFinanceReport.and.returnValue(of({
      success: true,
      report: structuredClone(mockReportData)
    }));

    await TestBed.configureTestingModule({
      imports: [FinanceOverview],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: HttpClient, useValue: mockHttpClient }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit & Data Loading', () => {
    it('should fetch financial report and compute financial statistics correctly', () => {
      expect(mockTransactionService.getFreelancerFinanceReport).toHaveBeenCalled();
      expect(component.contractEarnings.length).toBe(3);

      // Calculations:
      // Total Earned = 10000 + 4000 + 6000 = 20000
      // Platform Fees = 750 + 300 + 450 = 1500
      // Total Received = 20000 - 1500 = 18500
      // Net Withdrawn = 4625 + 3422.5 + 0 = 8047.5
      // Pending Withdrawal = 2000
      // Total Balance (Available) = 18500 - 8047.5 - 2000 = 8452.5
      expect(component.stats.totalEarned).toBe(20000);
      expect(component.stats.platformFees).toBe(1500);
      expect(component.stats.totalReceived).toBe(18500);
      expect(component.stats.withdrawnAmount).toBe(8047.5);
      expect(component.stats.pendingWithdrawal).toBe(2000);
      expect(component.stats.availableBalance).toBe(8452.5);

      expect(component.statCardsData.length).toBe(4);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when loading finance report gracefully', () => {
      spyOn(console, 'error');
      mockTransactionService.getFreelancerFinanceReport.and.returnValue(throwError(() => new Error('Network error')));
      component.loadData();

      expect(component.loading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should configure table columns correctly', fakeAsync(() => {
      component.ngAfterViewInit();
      tick();
      expect(component.columns.length).toBe(10);
      expect(component.columns[0].field).toBe('title');
      expect(component.columns[1].field).toBe('type');
      expect(component.columns[2].field).toBe('budget');
      expect(component.columns[3].field).toBe('status');
      expect(component.columns[9].field).toBe('actions');
    }));
  });

  describe('Withdrawal Flow', () => {
    it('should prevent withdrawal if contract has no available funds', () => {
      spyOn(window, 'alert');
      const fullyWithdrawnContract = mockReportData[1]; // received 3700, withdrawn 3700

      component.withdraw(fullyWithdrawnContract);

      expect(window.alert).toHaveBeenCalledWith('No funds available to withdraw for this contract.');
      expect(component.selectedContractForWithdrawal).toBeNull();
    });

    it('should calculate withdrawal amounts and open withdrawal modal when funds available', () => {
      const contract = mockReportData[0]; // received 9250, gross withdrawn 5000 -> available 4250

      component.withdraw(contract);

      expect(component.selectedContractForWithdrawal).toEqual(contract);
      expect(component.withdrawalAmount).toBe(4250);
      expect(component.platformFee).toBe(4250 * 0.075);
      expect(component.netAmount).toBe(4250 - (4250 * 0.075));
    });

    it('should close withdraw modal', () => {
      component.selectedContractForWithdrawal = mockReportData[0];
      component.closeWithdrawModal();
      expect(component.selectedContractForWithdrawal).toBeNull();
    });

    it('should submit withdrawal request successfully and reload data', () => {
      spyOn(window, 'alert');
      spyOn(component, 'loadData');

      component.withdraw(mockReportData[0]);
      component.withdrawForm = {
        bankName: 'HDFC Bank',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234'
      };

      mockTransactionService.withdrawFunds.and.returnValue(of({
        success: true,
        message: 'Withdrawal initiated'
      }));

      component.submitWithdrawRequest();

      expect(mockTransactionService.withdrawFunds).toHaveBeenCalledWith({
        contractId: 'contract-1',
        amount: component.withdrawalAmount,
        netAmount: component.netAmount,
        bankDetails: {
          bankName: 'HDFC Bank',
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234'
        }
      });
      expect(window.alert).toHaveBeenCalledWith('Withdrawal request submitted successfully! Admin will review and process the transfer.');
      expect(component.selectedContractForWithdrawal).toBeNull();
      expect(component.loadData).toHaveBeenCalled();
      expect(component.isWithdrawing).toBeFalse();
    });

    it('should alert message when withdraw request returns failure', () => {
      spyOn(window, 'alert');
      component.withdraw(mockReportData[0]);

      mockTransactionService.withdrawFunds.and.returnValue(of({
        success: false,
        message: 'Insufficient balance'
      }));

      component.submitWithdrawRequest();

      expect(window.alert).toHaveBeenCalledWith('Withdrawal failed: Insufficient balance');
      expect(component.isWithdrawing).toBeFalse();
    });

    it('should handle error when withdrawal API fails', () => {
      spyOn(window, 'alert');
      spyOn(console, 'error');
      component.withdraw(mockReportData[0]);

      mockTransactionService.withdrawFunds.and.returnValue(throwError(() => new Error('Server error')));

      component.submitWithdrawRequest();

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('An error occurred while submitting the withdrawal request.');
      expect(component.isWithdrawing).toBeFalse();
    });
  });

  describe('Initials & Helper Utilities', () => {
    it('should return correct initials from contract title', () => {
      expect(component.getInitials('Full Stack Web')).toBe('FS');
      expect(component.getInitials('Angular')).toBe('A');
      expect(component.getInitials('')).toBe('C');
    });
  });

  describe('Invoice Download', () => {
    it('should trigger blob download when invoice is requested', () => {
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
      const fakeBlob = new Blob(['pdf-content'], { type: 'application/pdf' });
      mockHttpClient.get.and.returnValue(of(fakeBlob));

      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:http://localhost/test-uuid');
      spyOn(window.URL, 'revokeObjectURL');

      component.downloadInvoice('contract-1');

      expect(mockHttpClient.get).toHaveBeenCalled();
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/test-uuid');
    });

    it('should handle invoice download error gracefully', () => {
      spyOn(console, 'error');
      spyOn(window, 'alert');
      mockHttpClient.get.and.returnValue(throwError(() => new Error('File not found')));

      component.downloadInvoice('contract-1');

      expect(console.error).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Failed to download invoice. Please try again.');
    });

    it('should return early if contractId is not provided', () => {
      component.downloadInvoice('');
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('Dropdown Actions & Routing', () => {
    it('should return Withdraw option when contract is completed and funds are available', () => {
      const items = component.getDropdownItems(mockReportData[0]);
      expect(items.some(i => i.value === 'withdraw')).toBeTrue();
    });

    it('should return Withdrawn Successfully and Invoice options when fully withdrawn', () => {
      const items = component.getDropdownItems(mockReportData[1]);
      expect(items.some(i => i.value === 'withdrawn')).toBeTrue();
      expect(items.some(i => i.value === 'invoice')).toBeTrue();
    });

    it('should return Pending Withdrawal option when withdrawal is in progress', () => {
      const pendingContract = {
        status: 'completed',
        pendingWithdrawnAmount: 1000,
        receivedAmount: 2000,
        grossWithdrawnAmount: 0
      };
      const items = component.getDropdownItems(pendingContract);
      expect(items.some(i => i.value === 'pending')).toBeTrue();
    });

    it('should return No actions option for in-progress contract', () => {
      const items = component.getDropdownItems(mockReportData[2]);
      expect(items[0].value).toBe('none');
      expect(items[0].label).toBe('No actions');
    });

    it('should delegate handleAction to withdraw or downloadInvoice', () => {
      spyOn(component, 'withdraw');
      spyOn(component, 'downloadInvoice');

      component.handleAction({ label: 'Withdraw', value: 'withdraw' }, mockReportData[0]);
      expect(component.withdraw).toHaveBeenCalledWith(mockReportData[0]);

      component.handleAction({ label: 'Invoice', value: 'invoice' }, mockReportData[0]);
      expect(component.downloadInvoice).toHaveBeenCalledWith('contract-1');
    });
  });
});
