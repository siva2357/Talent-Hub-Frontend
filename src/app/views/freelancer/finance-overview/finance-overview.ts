import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';
import { Table } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Dropdown } from '../../../library/ui/components/dropdown/dropdown';
import { DropdownItem, StatCardData, TableColumn } from '../../../core/models/ui.model';

@Component({
  selector: 'app-finance-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCard, Table, Badge, Dropdown],
  templateUrl: './finance-overview.html',
  styleUrl: './finance-overview.css'
})
export class FinanceOverview implements OnInit, AfterViewInit {
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

  @ViewChild('contractTpl') contractTpl!: TemplateRef<any>;
  @ViewChild('typeTpl') typeTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('dateTpl') dateTpl!: TemplateRef<any>;
  @ViewChild('budgetTpl') budgetTpl!: TemplateRef<any>;
  @ViewChild('currencyTpl') currencyTpl!: TemplateRef<any>;
  @ViewChild('earnedTpl') earnedTpl!: TemplateRef<any>;
  @ViewChild('feeTpl') feeTpl!: TemplateRef<any>;
  @ViewChild('receivedTpl') receivedTpl!: TemplateRef<any>;
  @ViewChild('withdrawnTpl') withdrawnTpl!: TemplateRef<any>;
  @ViewChild('actionTpl') actionTpl!: TemplateRef<any>;

  columns: TableColumn[] = [];
  statCardsData: StatCardData[] = [];

  constructor(private transactionService: TransactionService, private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.columns = [
      { field: 'title', headerName: 'Contract Title', cellTemplate: this.contractTpl, width: 120 },
      { field: 'type', headerName: 'Contract Type', cellTemplate: this.typeTpl, width: 120 },
      { field: 'budget', headerName: 'Contract Budget', cellTemplate: this.budgetTpl, width: 120 },
      { field: 'status', headerName: 'Contract Status', cellTemplate: this.statusTpl, width: 120 },
      { field: 'lastPaymentDate', headerName: 'End Date', cellTemplate: this.dateTpl, width: 120 },
      { field: 'earned', headerName: 'Earned Amount', cellTemplate: this.earnedTpl, width: 120 },
      { field: 'platformFeesDeducted', headerName: 'Platform Fee', cellTemplate: this.feeTpl, width: 120 },
      { field: 'receivedAmount', headerName: 'Received Amount', cellTemplate: this.receivedTpl, width: 120 },
      { field: 'netWithdrawnAmount', headerName: 'Withdrawn Amount', cellTemplate: this.withdrawnTpl, width: 120 },
      { field: 'actions', headerName: 'Actions', cellTemplate: this.actionTpl, minWidth: 150 }
    ];
  }

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

          const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

          this.statCardsData = [
            { title: 'TOTAL EARNED', value: formatCurrency(tEarned), icon: 'bi bi-wallet2' },
            { title: 'PLATFORM FEES', value: formatCurrency(tPlatformFees), icon: 'bi bi-tag' },
            { title: 'TOTAL RECEIVED', value: formatCurrency(tReceived), icon: 'bi bi-box-arrow-in-down' },
            { title: 'WITHDRAWN AMOUNT', value: formatCurrency(tWithdrawn), icon: 'bi bi-bank' },
            { title: 'PENDING WITHDRAWAL', value: formatCurrency(tPendingWithdrawal), icon: 'bi bi-clock-history' },
            { title: 'TOTAL BALANCE', value: formatCurrency(this.stats.availableBalance), icon: 'bi bi-bar-chart' }
          ];
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

  getDropdownItems(row: any): DropdownItem[] {
    const items: DropdownItem[] = [];

    if (row.status?.toLowerCase() === 'completed') {
      const pending = row.pendingWithdrawnAmount || 0;
      const received = row.receivedAmount || 0;
      const grossWithdrawn = row.grossWithdrawnAmount || row.withdrawnAmount || 0;
      const available = received - grossWithdrawn;

      let hasWithdrawnSuccessfully = false;

      if (pending > 0) {
        items.push({ label: 'Pending Withdrawal', value: 'pending', icon: 'bi-hourglass-split', disabled: true, className: 'text-warning' });
      } else if (available > 0) {
        items.push({ label: 'Withdraw', value: 'withdraw', icon: 'bi-cash-coin', className: 'text-success' });
      } else {
        items.push({ label: 'Withdrawn Successfully', value: 'withdrawn', icon: 'bi-check2-circle', disabled: true, className: 'text-success' });
        hasWithdrawnSuccessfully = true;
      }

      if (hasWithdrawnSuccessfully) {
        items.push({ label: 'Invoice', value: 'invoice', icon: 'bi-download', className: 'text-muted' });
      }
    }

    if (items.length === 0) {
      items.push({ label: 'No actions', value: 'none', disabled: true, className: 'text-muted small' });
    }

    return items;
  }

  handleAction(event: DropdownItem, row: any) {
    if (event.value === 'withdraw') {
      this.withdraw(row);
    } else if (event.value === 'invoice') {
      this.downloadInvoice(row.contractId || row._id);
    }
  }
}
