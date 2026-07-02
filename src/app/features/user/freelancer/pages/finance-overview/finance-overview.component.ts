import { Component, OnInit, inject, ViewChild, TemplateRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Table } from '../../../../../shared/components/table/table.component';
import { TableColumn } from '../../../../../core/model/table.interface';
import { FinanceService } from '../../../../../core/services/finance.service';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';
import { AlertModalService } from '../../../../../core/services/alert-modal.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-finance-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent, Table, FormsModule, AccordionComponent],
  templateUrl: './finance-overview.component.html',
  styleUrl: './finance-overview.component.css'
})
export class FinanceOverviewComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private router = inject(Router);
  private financeService = inject(FinanceService);
  private alertModal = inject(AlertModalService);

  // UI State
  isLoading = signal(true);
  selectedContract = signal<any>(null);
  showWithdrawModal = signal(false);
  selectedWithdrawItem = signal<any>(null);
  agreeToTerms = signal(false);

  // Trigger stream for reloading data
  private refresh$ = new BehaviorSubject<void>(undefined);

  // Stats Signal
  stats = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.financeService.getStats()),
      map((res: any) => {
        if (res.success && res.stats) {
          return {
            totalEarnings: res.stats.totalEarnings || 0,
            amountWithdrawn: res.stats.amountWithdrawn || 0,
            balanceLeft: res.stats.balanceLeft || 0,
            platformFeesDeducted: res.stats.platformFeesDeducted || 0,
          };
        }
        return { totalEarnings: 0, amountWithdrawn: 0, balanceLeft: 0, platformFeesDeducted: 0 };
      }),
      catchError(err => {
        console.error('Failed to load freelancer stats:', err);
        return of({ totalEarnings: 0, amountWithdrawn: 0, balanceLeft: 0, platformFeesDeducted: 0 });
      })
    ),
    { initialValue: { totalEarnings: 0, amountWithdrawn: 0, balanceLeft: 0, platformFeesDeducted: 0 } }
  );

  // Contracts Signal
  contracts = toSignal(
    this.refresh$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.financeService.getFreelancerReport()),
      map((res: any) => {
        if (res.success && res.report) {
          return res.report.map((item: any) => {
            const contractObj = {
              ...item,
              id: item.contractId || item._id, // Add ID for Accordion
              totalEarned: item.earned,
              lastPaymentDate: item.lastPaymentDate || '-'
            };
            contractObj.phases = (item.phases || []).map((p: any) => ({ ...p, parentContract: contractObj }));
            return contractObj;
          });
        }
        return [];
      }),
      tap(() => this.isLoading.set(false)),
      catchError(err => {
        console.error('Failed to load freelancer finance report:', err);
        this.isLoading.set(false);
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  @ViewChild('nameTemplate', { static: true }) nameTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('amountTemplate', { static: true }) amountTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  phaseColumns: TableColumn[] = [];

  ngOnInit() {
    this.phaseColumns = [
      { name: 'Phase Description', prop: 'name', cellTemplate: this.nameTemplate },
      { name: 'Release Date', prop: 'date', cellTemplate: this.dateTemplate },
      { name: 'Status', prop: 'status', cellTemplate: this.statusTemplate },
      { name: 'Amount', prop: 'amount', cellTemplate: this.amountTemplate },
      { name: 'Action', prop: 'action', cellTemplate: this.actionTemplate }
    ];
  }

  toggleContractDetails(contract: any) {
    this.selectedContract.update(current => current === contract ? null : contract);
  }

  viewStatements() {
    // Navigate to a dedicated statements page or trigger statement download logic
  }

  viewAllTransactions() {
    // The unified page shows all transactions now.
  }

  getStatementUrl(contractId: string): string {
    return this.financeService.getPaymentStatementPdfUrl(contractId);
  }

  withdrawContractBalance(contract: any) {
    if (contract.balance > 0) {
      this.selectedWithdrawItem.set({
        balance: contract.balance,
        contractId: contract.contractId,
        isPhase: false,
        phaseName: 'Final Contract Withdrawal',
        title: contract.title,
        client: contract.client,
        type: contract.type,
        budget: contract.budget
      });
      this.showWithdrawModal.set(true);
      this.agreeToTerms.set(false);
    }
  }

  closeModal() {
    this.showWithdrawModal.set(false);
    this.selectedWithdrawItem.set(null);
    this.agreeToTerms.set(false);
  }

  confirmWithdrawal() {
    const withdrawItem = this.selectedWithdrawItem();
    if (withdrawItem && this.agreeToTerms()) {
      const amount = withdrawItem.balance;
      const contractId = withdrawItem.contractId;

      this.financeService.withdraw(amount, contractId).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.alertModal.show({
                title: 'Withdrawal Successful',
                message: `Withdrawal request for ₹${amount.toFixed(2)} processed successfully!`,
                type: 'success',
                confirmText: 'Great'
            });
            this.refresh$.next(); // Reload data
            this.closeModal();
          } else {
            this.alertModal.show({
                title: 'Withdrawal Failed',
                message: res.message || 'Failed to process withdrawal.',
                type: 'danger',
                confirmText: 'Close'
            });
          }
        },
        error: (err) => {
          console.error('Withdrawal error:', err);
          this.alertModal.show({
                title: 'Error',
                message: 'An error occurred during withdrawal processing.',
                type: 'danger',
                confirmText: 'Close'
            });
        }
      });
    }
  }
}
