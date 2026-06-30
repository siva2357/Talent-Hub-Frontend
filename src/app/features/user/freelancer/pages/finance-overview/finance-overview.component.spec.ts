import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FinanceOverviewComponent } from './finance-overview.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('FinanceOverviewComponent', () => {
  let component: FinanceOverviewComponent;
  let fixture: ComponentFixture<FinanceOverviewComponent>;
  let mockFinanceService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockFinanceService = {
      getStats: jasmine.createSpy('getStats').and.returnValue(of({
        success: true,
        stats: {
          totalEarnings: 1000,
          amountWithdrawn: 500,
          balanceLeft: 400,
          platformFeesDeducted: 100
        }
      })),
      getFreelancerReport: jasmine.createSpy('getFreelancerReport').and.returnValue(of({
        success: true,
        report: [
          {
            title: 'Project A',
            type: 'Fixed Price',
            status: 'Completed',
            earned: 500,
            balance: 0,
            contractId: 'C1',
            phases: []
          }
        ]
      })),
      withdraw: jasmine.createSpy('withdraw').and.returnValue(of({ success: true }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [FinanceOverviewComponent],
      providers: [
        { provide: FinanceService, useValue: mockFinanceService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats correctly using signals', fakeAsync(() => {
    tick(); // allow signals to resolve
    expect(mockFinanceService.getStats).toHaveBeenCalled();
    const stats = component.stats();
    expect(stats?.totalEarnings).toBe(1000);
    expect(stats?.amountWithdrawn).toBe(500);
    expect(stats?.balanceLeft).toBe(400);
    expect(stats?.platformFeesDeducted).toBe(100);
  }));

  it('should load contracts correctly using signals', fakeAsync(() => {
    tick(); // allow signals to resolve
    expect(mockFinanceService.getFreelancerReport).toHaveBeenCalled();
    const contracts = component.contracts();
    expect(contracts.length).toBe(1);
    expect(contracts[0].title).toBe('Project A');
    expect(contracts[0].totalEarned).toBe(500);
  }));

  it('should toggle contract details', () => {
    const contract = { id: 1 };
    component.toggleContractDetails(contract);
    expect(component.selectedContract()).toEqual(contract);

    // Toggle again should nullify
    component.toggleContractDetails(contract);
    expect(component.selectedContract()).toBeNull();
  });

  it('should handle withdraw initialization correctly', () => {
    const contract = { balance: 200, contractId: 'C2', title: 'P2', client: 'Client B', type: 'Hourly', budget: 200 };
    component.withdrawContractBalance(contract);
    
    expect(component.showWithdrawModal()).toBeTrue();
    expect(component.agreeToTerms()).toBeFalse();
    expect(component.selectedWithdrawItem()?.balance).toBe(200);
  });

  it('should confirm withdrawal and refresh data', () => {
    spyOn(window, 'alert');
    const contract = { balance: 200, contractId: 'C2', title: 'P2', client: 'Client B', type: 'Hourly', budget: 200 };
    
    // Set state manually
    component.selectedWithdrawItem.set(contract);
    component.agreeToTerms.set(true);

    component.confirmWithdrawal();

    expect(mockFinanceService.withdraw).toHaveBeenCalledWith(200, 'C2');
    expect(window.alert).toHaveBeenCalledWith('Withdrawal request for ₹200.00 processed successfully!');
    expect(component.showWithdrawModal()).toBeFalse();
  });
});
