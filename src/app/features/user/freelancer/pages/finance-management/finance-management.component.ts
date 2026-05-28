import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';

@Component({
  selector: 'app-finance-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ChipComponent, InputComponent, ButtonComponent],
  templateUrl: './finance-management.component.html',
  styleUrl: './finance-management.component.css'
})
export class FinanceManagementComponent implements OnInit {
  private location = inject(Location);
  private financeService = inject(FinanceService);
  private diaryService = inject(ContractDiaryService);

  // Summary Stats
  totalBalance = 0;
  totalReceived = 0;
  totalWithdrawn = 0;

  // Filter Form
  filterForm = new FormGroup({
    paymentStatus: new FormControl<string | null>(null),
    contractType: new FormControl<string | null>(null)
  });

  // Options
  statusOptions = [
    { label: 'Received', value: 'Received' },
    { label: 'Withdrawn', value: 'Withdrawn' }
  ];

  typeOptions = [
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' }
  ];

  // Active Chips
  activeFilters: { key: string, label: string, value: string }[] = [];

  // Transaction Data
  managementData: any[] = [];
  filteredData: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadStats();
    this.loadContracts();
  }

  loadStats() {
    this.financeService.getStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.totalBalance = res.stats.balanceLeft || 0;
          this.totalReceived = res.stats.totalEarnings || 0;
          this.totalWithdrawn = res.stats.amountWithdrawn || 0;
        }
      },
      error: (err) => {
        console.error('Failed to load freelancer stats:', err);
      }
    });
  }

  loadContracts() {
    this.isLoading = true;
    this.diaryService.getFreelancerDiaries().subscribe({
      next: (resDiaries: any) => {
        if (resDiaries.success && resDiaries.diaries) {
          this.financeService.getTransactions().subscribe({
            next: (resTxns: any) => {
              const txns = resTxns.success ? resTxns.transactions : [];

              this.managementData = resDiaries.diaries.map((diary: any) => {
                const contractId = diary.contractId?._id;

                // Filter transactions associated with this contract
                const contractTxns = txns.filter((t: any) => t.contractId && (t.contractId._id === contractId || t.contractId === contractId));

                const receivedAmount = contractTxns
                  .filter((t: any) => t.type === 'Payment Released')
                  .reduce((sum: number, t: any) => sum + t.amount, 0);

                const withdrawnAmount = contractTxns
                  .filter((t: any) => t.type === 'Withdrawal')
                  .reduce((sum: number, t: any) => sum + t.amount, 0);

                const balance = Math.max(0, receivedAmount - withdrawnAmount);

                const releaseTxns = contractTxns.filter((t: any) => t.type === 'Payment Released');
                let receivedDate = diary.createdAt;
                if (releaseTxns.length > 0) {
                  receivedDate = releaseTxns[0].createdAt;
                }

                const withdrawTxns = contractTxns.filter((t: any) => t.type === 'Withdrawal');
                let withdrawnDate = null;
                if (withdrawTxns.length > 0) {
                  withdrawnDate = withdrawTxns[0].createdAt;
                }

                return {
                  contractId,
                  title: diary.contractId?.contractTitle || 'Contract',
                  client: diary.clientId?.registrationDetails?.fullName || 'Client',
                  type: diary.contractId?.budgetType || 'Fixed Price',
                  budget: (diary.phases || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
                  receivedAmount,
                  receivedDate,
                  withdrawnAmount,
                  withdrawnDate,
                  balance,
                  status: balance > 0 ? 'Received' : 'Withdrawn'
                };
              });

              this.applyFilters();
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Failed to load transactions for mapping:', err);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load diaries:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    const values = this.filterForm.value;
    this.activeFilters = [];

    if (values.paymentStatus) {
      this.activeFilters.push({ key: 'paymentStatus', label: `Status: ${values.paymentStatus}`, value: values.paymentStatus });
    }
    if (values.contractType) {
      this.activeFilters.push({ key: 'contractType', label: `Type: ${values.contractType}`, value: values.contractType });
    }

    this.filteredData = this.managementData.filter(item => {
      const matchStatus = !values.paymentStatus || item.status === values.paymentStatus;
      const matchType = !values.contractType || item.type === values.contractType;
      return matchStatus && matchType;
    });
  }

  resetFilters() {
    this.filterForm.reset({
      paymentStatus: null,
      contractType: null
    });
    this.applyFilters();
  }

  removeChip(filter: any) {
    this.filterForm.get(filter.key)?.setValue(null);
    this.applyFilters();
  }

  goBack() {
    this.location.back();
  }

  selectedWithdrawItem: any = null;
  showWithdrawModal: boolean = false;
  agreeToTerms: boolean = false;

  withdraw(item: any) {
    if (item.balance > 0) {
      this.selectedWithdrawItem = item;
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
            alert(`Withdrawal request for $${amount.toFixed(2)} processed successfully!`);
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

  downloadInvoice(item: any) {
    console.log('Downloading invoice for:', item.title);
    const invoiceContent = `==================================================
TALENT-HUB WITHDRAWAL RECEIPT
==================================================
Contract Reference : ${item.contractId || 'N/A'}
Contract Title     : ${item.title}
Client             : ${item.client}
Withdrawal Amount  : $${item.balance.toFixed(2)}
Payment Status     : COMPLETED
Invoice Reference  : WDN-${Math.floor(100000 + Math.random() * 900000)}
Issued Date        : ${new Date().toLocaleDateString()}
==================================================
Thank you for using Talent-Hub Escrow Payments!
==================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Withdrawal_Receipt_${item.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
