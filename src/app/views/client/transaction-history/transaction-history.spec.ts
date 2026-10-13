import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionHistory } from './transaction-history';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('TransactionHistory', () => {
  let component: TransactionHistory;
  let fixture: ComponentFixture<TransactionHistory>;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TransactionService', ['getContractTransactions']);

    await TestBed.configureTestingModule({
      imports: [TransactionHistory, CommonModule, RouterTestingModule],
      providers: [
        { provide: TransactionService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '123' } }
          }
        }
      ]
    }).compileComponents();

    transactionServiceSpy = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionHistory);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    transactionServiceSpy.getContractTransactions.and.returnValue(of({ success: true, diaries: [] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load data on init successfully', () => {
    const mockResponse = {
      success: true,
      diaries: [
        {
          contractId: { contractTitle: 'Test Contract' },
          freelancerId: { registrationDetails: { fullName: 'Test Freelancer' } },
          overallStatus: 'in-progress',
          phases: [{ name: 'Phase 1', amount: 1000, deadline: '2023-12-01', status: 'pending', _id: '1' }]
        }
      ],
      stats: { totalFund: 1000, totalPhases: 1, pendingAmount: 1000, balance: 0 }
    };
    transactionServiceSpy.getContractTransactions.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.diaries).toEqual(mockResponse.diaries);
    expect(component.transactions.length).toBe(1);
    expect(component.transactions[0].phaseName).toBe('Phase 1');
    expect(component.statCards.length).toBe(4);
  });

  it('should handle error when loading data fails', () => {
    transactionServiceSpy.getContractTransactions.and.returnValue(throwError(() => new Error('API Error')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(console.error).toHaveBeenCalledWith('Failed to load contract transactions', jasmine.any(Error));
  });
});
