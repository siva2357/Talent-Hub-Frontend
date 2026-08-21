import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-finance-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance-overview.html',
  styleUrl: './finance-overview.css'
})
export class FinanceOverview implements OnInit {
  stats: any = {
    totalEarned: 0,
    platformFees: 0,
    totalReceived: 0,
    withdrawnAmount: 0,
    pendingWithdrawal: 0,
    availableBalance: 0
  };

  contractEarnings: any[] = [];
  loading: boolean = true;

  constructor(private transactionService: TransactionService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Load Stats and Contract Earnings from the Report
    this.transactionService.getFreelancerFinanceReport().subscribe({
      next: (res: any) => {
        if (res.success && res.report && Array.isArray(res.report)) {
          this.contractEarnings = res.report;

          let tEarned = 0;
          let tReceived = 0;
          let tWithdrawn = 0;
          let tPlatformFees = 0;
          let tPendingWithdrawal = 0;

          res.report.forEach((contract: any) => {
            tEarned += (contract.budget || contract.earned || 0); // "total earned equals total contract budget"
            tWithdrawn += (contract.netWithdrawnAmount || 0);
            tPlatformFees += (contract.platformFeesDeducted || 0);
            tPendingWithdrawal += (contract.pendingWithdrawnAmount || 0);
          });
          
          tReceived = tEarned - tPlatformFees;

          this.stats = {
            totalEarned: tEarned,
            platformFees: tPlatformFees,
            totalReceived: tReceived,
            withdrawnAmount: tWithdrawn,
            pendingWithdrawal: tPendingWithdrawal,
            availableBalance: tReceived - tWithdrawn - tPendingWithdrawal // net received - net withdrawn
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading finance report:', err);
        this.loading = false;
      }
    });
  }

  isWithdrawing: boolean = false;
  selectedContractForWithdrawal: any = null;
  withdrawalAmount: number = 0;
  platformFee: number = 0;
  netAmount: number = 0;

  withdrawForm = {
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  };

  withdraw(contract: any): void {
    if (!contract || (!contract.contractId && !contract._id)) return;

    const available = (contract.receivedAmount || 0) - (contract.grossWithdrawnAmount || contract.withdrawnAmount || 0);
    if (available <= 0) {
      alert('No funds available to withdraw for this contract.');
      return;
    }

    this.withdrawalAmount = available;
    this.platformFee = available * 0.075; // 7.5% Platform Fee
    this.netAmount = this.withdrawalAmount - this.platformFee;

    this.selectedContractForWithdrawal = contract;
    this.withdrawForm = { bankName: '', accountNumber: '', ifscCode: '' };
  }

  closeWithdrawModal(): void {
    this.selectedContractForWithdrawal = null;
  }

  submitWithdrawRequest(): void {
    if (!this.selectedContractForWithdrawal) return;

    this.isWithdrawing = true;
    const payload = {
      contractId: this.selectedContractForWithdrawal.contractId || this.selectedContractForWithdrawal._id,
      amount: this.withdrawalAmount,
      netAmount: this.netAmount,
      bankDetails: this.withdrawForm
    };

    this.transactionService.withdrawFunds(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Withdrawal request submitted successfully! Admin will review and process the transfer.');
          this.closeWithdrawModal();
          this.loadData(); // Reload stats
        } else {
          alert('Withdrawal failed: ' + (res.message || 'Unknown error'));
        }
        this.isWithdrawing = false;
      },
      error: (err) => {
        console.error('Withdraw error', err);
        alert('An error occurred while submitting the withdrawal request.');
        this.isWithdrawing = false;
      }
    });
  }

  getInitials(title: string): string {
    if (!title) return 'C';
    return title.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  downloadInvoice(contractId: string): void {
    if (!contractId) return;
    const token = localStorage.getItem('token');

    const apiUrl = `${environment.apiGatewayUrl}/finance/payments/${contractId}/download`;

    this.http.get(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${contractId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.error('Failed to download invoice:', err);
        alert('Failed to download invoice. Please try again.');
      }
    });
  }
}
