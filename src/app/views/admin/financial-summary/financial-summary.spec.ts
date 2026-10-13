import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinancialSummary } from './financial-summary';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from '../../../../environments/environment';

describe('FinancialSummary', () => {
  let component: FinancialSummary;
  let fixture: ComponentFixture<FinancialSummary>;
  let httpTesting: HttpTestingController;

  const mockStats = {
    totalVolume: 500000,
    platformCommissions: 50000,
    escrowHeld: 100000,
    pendingWithdrawals: 15000,
    successfulPayouts: 35,
    growthPercent: 12
  };

  const mockTransactions = [
    { id: 'tx-1', contractTitle: 'App Design', clientName: 'Alice', freelancerName: 'Bob', budget: 10000, freelancerPayment: 9000, platformFee: 1000, status: 'Completed' },
    { id: 'tx-2', contractTitle: 'Backend API', clientName: 'Charlie', freelancerName: 'Dave', budget: 20000, freelancerPayment: 18000, platformFee: 2000, status: 'Escrow' }
  ];

  const mockStatusOptions = [
    { label: 'Completed', value: 'Completed' },
    { label: 'Escrow', value: 'Escrow' }
  ];

  beforeEach(async () => {
    localStorage.setItem('token', 'dummy-token');

    await TestBed.configureTestingModule({
      imports: [FinancialSummary],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialSummary);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.removeItem('token');
  });

  function handleInitialRequests() {
    const txReq = httpTesting.expectOne(`${environment.apiGatewayUrl}/admin/finances/transactions`);
    expect(txReq.request.method).toBe('GET');
    txReq.flush(mockTransactions);

    const statsReq = httpTesting.expectOne(`${environment.apiGatewayUrl}/admin/finances/stats`);
    expect(statsReq.request.method).toBe('GET');
    statsReq.flush(mockStats);

    const statusReq = httpTesting.expectOne(`${environment.apiGatewayUrl}/admin/finances/status-options`);
    expect(statusReq.request.method).toBe('GET');
    statusReq.flush(mockStatusOptions);
  }

  it('should initialize and load stats, transactions, and status options', fakeAsync(() => {
    fixture.detectChanges();
    handleInitialRequests();
    tick();

    expect(component).toBeTruthy();
    expect(component.rawTransactions$.value.length).toBe(2);
    expect(component.statCards.length).toBe(4);
    expect(component.columns.length).toBe(9);
  }));

  it('should filter transactions by search and status', fakeAsync(() => {
    fixture.detectChanges();
    handleInitialRequests();
    tick(300);

    let filtered: any[] = [];
    component.transactions$.subscribe(res => (filtered = res));
    tick(300);

    expect(filtered.length).toBe(2);

    component.onSearchChange('Alice');
    component.applyFilters();
    tick(300);
    expect(filtered.length).toBe(1);
    expect(filtered[0].clientName).toBe('Alice');

    component.onStatusChange('Escrow');
    component.onSearchChange('');
    component.applyFilters();
    tick(300);
    expect(filtered.length).toBe(1);
    expect(filtered[0].status).toBe('Escrow');

    component.resetFilters();
    tick(300);
    expect(filtered.length).toBe(2);
  }));

  it('should handle removeFilter and onPageSizeChange correctly', fakeAsync(() => {
    fixture.detectChanges();
    handleInitialRequests();
    tick(300);

    component.onSearchChange('App');
    component.onStatusChange('Completed');
    component.applyFilters();
    tick(300);

    expect(component.activeFilters.length).toBe(2);

    component.removeFilter({ key: 'search' });
    tick(300);
    expect(component.tempSearchQuery).toBe('');

    component.removeFilter({ key: 'status' });
    tick(300);
    expect(component.tempSelectedStatus).toBe('All Statuses');

    component.onPageSizeChange(25);
    expect(component.pageSize$.value).toBe(25);
    expect(component.currentPage$.value).toBe(1);
  }));

  it('should open and close payout modal', () => {
    component.openPayoutModal('tx-1', 9000);
    expect(component.isPayoutModalOpen).toBeTrue();
    expect(component.selectedTransactionId).toBe('tx-1');
    expect(component.selectedTransactionAmount).toBe(9000);

    component.closePayoutModal();
    expect(component.isPayoutModalOpen).toBeFalse();
    expect(component.selectedTransactionId).toBeNull();
  });

  it('should process payout when confirmed', fakeAsync(() => {
    fixture.detectChanges();
    handleInitialRequests();
    tick();

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component.openPayoutModal('tx-1', 9000);
    component.confirmPayout();

    const payoutReq = httpTesting.expectOne(`${environment.apiGatewayUrl}/admin/payout/tx-1`);
    expect(payoutReq.request.method).toBe('POST');
    payoutReq.flush({ success: true });

    // Refresh calls
    const refreshTxReq = httpTesting.expectOne(`${environment.apiGatewayUrl}/admin/finances/transactions`);
    refreshTxReq.flush(mockTransactions);

    const refreshStatsReq = httpTesting.expectOne(`${environment.apiGatewayUrl}/admin/finances/stats`);
    refreshStatsReq.flush(mockStats);

    expect(component.isProcessing).toBeFalse();
    expect(component.isPayoutModalOpen).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  }));

  it('should not process payout if user cancels confirmation', fakeAsync(() => {
    fixture.detectChanges();
    handleInitialRequests();
    tick();

    spyOn(window, 'confirm').and.returnValue(false);
    component.openPayoutModal('tx-1', 9000);
    component.confirmPayout();

    httpTesting.expectNone(`${environment.apiGatewayUrl}/admin/payout/tx-1`);
  }));
});
