import { Component, OnInit, AfterViewInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Table } from '../../../../../shared/components/table/table.component';
import { TableColumn } from '../../../../../core/model/table.interface';
import { FinanceService } from '../../../../../core/services/finance.service';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent, Table, FormsModule],
  templateUrl: './finance-overview.component.html',
  styleUrl: './finance-overview.component.css'
})
export class FinanceOverviewComponent implements OnInit, AfterViewInit {
  DateTimeHelper = DateTimeHelper;

  private router = inject(Router);
  private financeService = inject(FinanceService);

  // Financial Stats
  totalEarnings = 0;
  amountWithdrawn = 0;
  balanceLeft = 0;
  platformFeesDeducted = 0;

  contracts: any[] = [];
  selectedContract: any = null;
  isLoading = true;

  // Withdrawal logic
  selectedWithdrawItem: any = null;
  showWithdrawModal: boolean = false;
  agreeToTerms: boolean = false;

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
    this.loadStats();
    this.loadContracts();
  }

  ngAfterViewInit() {
  }

  loadStats() {
    this.financeService.getStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.totalEarnings = res.stats.totalEarnings || 0;
          this.amountWithdrawn = res.stats.amountWithdrawn || 0;
          this.balanceLeft = res.stats.balanceLeft || 0;
          this.platformFeesDeducted = res.stats.platformFeesDeducted || 0;
        }
      },
      error: (err) => {
        console.error('Failed to load freelancer stats:', err);
      }
    });
  }

  loadContracts() {
    this.isLoading = true;
    this.financeService.getFreelancerReport().subscribe({
      next: (res: any) => {
        if (res.success && res.report) {
          this.contracts = res.report.map((item: any) => {
            const contractObj = {
              ...item,
              totalEarned: item.earned,
              lastPaymentDate: item.lastPaymentDate || '-'
            };
            contractObj.phases = (item.phases || []).map((p: any) => ({ ...p, parentContract: contractObj }));
            return contractObj;
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load freelancer finance report:', err);
        this.isLoading = false;
      }
    });
  }

  toggleContractDetails(contract: any) {
    this.selectedContract = this.selectedContract === contract ? null : contract;
  }

  viewStatements() {
    // Navigate to a dedicated statements page or trigger statement download logic
    // We will keep it as an action that opens the first contract's statement for now,
    // or you can implement a global download button
  }

  viewAllTransactions() {
    // The unified page shows all transactions now.
  }

  withdrawContractBalance(contract: any) {
    if (contract.balance > 0) {
      this.selectedWithdrawItem = {
        balance: contract.balance,
        contractId: contract.contractId,
        isPhase: false,
        phaseName: 'Final Contract Withdrawal',
        title: contract.title,
        client: contract.client,
        type: contract.type,
        budget: contract.budget
      };
      this.showWithdrawModal = true;
      this.agreeToTerms = false;
    }
  }

  closeModal() {
    this.showWithdrawModal = false;
    this.selectedWithdrawItem = null;
    this.agreeToTerms = false;
  }

  confirmWithdrawal() {
    if (this.selectedWithdrawItem && this.agreeToTerms) {
      const amount = this.selectedWithdrawItem.balance;
      const contractId = this.selectedWithdrawItem.contractId;

      this.financeService.withdraw(amount, contractId).subscribe({
        next: (res: any) => {
          if (res.success) {
            alert(`Withdrawal request for ₹${amount.toFixed(2)} processed successfully!`);
            this.loadStats();
            this.loadContracts();
            this.closeModal();
          }
        },
        error: (err) => {
          alert('Withdrawal request failed: ' + (err.error?.message || 'Error occurred'));
        }
      });
    }
  }
}
