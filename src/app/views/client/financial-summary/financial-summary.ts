import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';

Chart.register(...registerables);

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, StatCard, Table, Badge, Dropdown],
  templateUrl: './financial-summary.html',
  styleUrl: './financial-summary.css'
})
export class FinancialSummary implements OnInit, AfterViewInit {
  stats: any = {
    totalSpent: 0,
    escrowBalance: 0,
    platformFees: 0,
    pendingPayments: 0,
    completedContracts: 0
  };
  contracts: any[] = [];
  invoices: any[] = [];
  loading: boolean = true;

  statCards: StatCardData[] = [];
  columns: TableColumn[] = [];

  @ViewChild('invoiceIdTpl') invoiceIdTpl!: TemplateRef<any>;
  @ViewChild('contractTpl') contractTpl!: TemplateRef<any>;
  @ViewChild('amountTpl') amountTpl!: TemplateRef<any>;
  @ViewChild('feeTpl') feeTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('actionTpl') actionTpl!: TemplateRef<any>;

  distributionChart: any[] = [];
  chartInstance: any = null;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) { }

  get totalDistributionAmount(): number {
    return (Number(this.stats.totalSpent) || 0) +
           (Number(this.stats.escrowBalance) || 0) +
           (Number(this.stats.platformFees) || 0) +
           (Number(this.stats.pendingPayments) || 0);
  }

  ngOnInit(): void {
    this.updateStatCards();
    this.initDefaultDistribution();
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: '_id', headerName: 'Invoice ID', cellTemplate: this.invoiceIdTpl },
        { field: 'contractTitle', headerName: 'Contract', cellTemplate: this.contractTpl },
        { field: 'amount', headerName: 'Amount', cellTemplate: this.amountTpl },
        { field: 'platformFee', headerName: 'Platform Fee', cellTemplate: this.feeTpl },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl },
        { field: 'action', headerName: 'Action', cellTemplate: this.actionTpl }
      ];
      this.generateDistributionChart();
    });
  }

  initDefaultDistribution(): void {
    const labels = ['Total Spent', 'Escrow Balance', 'Platform Fees', 'Pending Fund'];
    const colors = ['#198754', '#ffc107', '#0d6efd', '#dc3545'];
    this.distributionChart = labels.map((label, i) => ({
      label,
      amount: 0,
      color: colors[i]
    }));
  }

  updateStatCards(): void {
    const totalSpent = Number(this.stats.totalSpent) || 0;
    const escrowBalance = Number(this.stats.escrowBalance) || 0;
    const platformFees = Number(this.stats.platformFees) || 0;
    const pendingPayments = Number(this.stats.pendingPayments) || 0;

    this.statCards = [
      {
        title: 'TOTAL SPENT',
        value: `₹${totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-graph-up-arrow'
      },
      {
        title: 'ESCROW BALANCE',
        value: `₹${escrowBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-shield-check'
      },
      {
        title: 'PLATFORM FEES',
        value: `₹${platformFees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-percent'
      },
      {
        title: 'UNFUNDED CONTRACTS',
        value: `₹${pendingPayments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-credit-card'
      }
    ];
  }

  loadData(): void {
    this.loading = true;

    this.transactionService.getFinanceStats().subscribe({
      next: (res: any) => {
        if (res && res.success && res.stats) {
          this.stats.totalSpent = Number(res.stats.totalSpent) || 0;
          this.stats.escrowBalance = Number(res.stats.escrowBalance ?? res.stats.upcomingPayments) || 0;
          this.stats.platformFees = Number(res.stats.platformFeesPaid) || 0;
          this.stats.pendingPayments = Number(res.stats.pendingPayments) || 0;
        } else {
          this.stats.totalSpent = 0;
          this.stats.escrowBalance = 0;
          this.stats.platformFees = 0;
          this.stats.pendingPayments = 0;
        }
        this.updateStatCards();
        this.generateDistributionChart();
      },
      error: (err: any) => {
        console.error("Error fetching stats", err);
        this.stats.escrowBalance = 0;
        this.updateStatCards();
        this.generateDistributionChart();
      }
    });

    this.transactionService.getInvoices().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.invoices = (res.invoices || []).filter((inv: any) => inv.type === 'Escrow Funded' || inv.type === 'Deposit');
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error("Error fetching invoices", err);
        this.loading = false;
      }
    });
  }

  generateDistributionChart(): void {
    const spentAmount = Number(this.stats.totalSpent) || 0;
    const escrowAmount = Number(this.stats.escrowBalance) || 0;
    const feesAmount = Number(this.stats.platformFees) || 0;
    const pendingAmount = Number(this.stats.pendingPayments) || 0;

    const rawData = [spentAmount, escrowAmount, feesAmount, pendingAmount];
    const labels = ['Total Spent', 'Escrow Balance', 'Platform Fees', 'Pending Fund'];
    const colors = ['#198754', '#ffc107', '#0d6efd', '#dc3545'];

    this.distributionChart = labels.map((label, i) => ({
      label,
      amount: rawData[i],
      color: colors[i]
    }));

    const totalSum = rawData.reduce((acc, val) => acc + val, 0);
    const isAllZero = totalSum === 0;

    // If there is no data (all zeros), provide equal slices so doughnut ring is visually rendered
    // with its 4 respective categories and values
    const chartData = isAllZero ? [1, 1, 1, 1] : rawData;

    setTimeout(() => {
      const ctx = document.getElementById('financialChart') as HTMLCanvasElement;
      if (!ctx) return;

      if (this.chartInstance) {
        this.chartInstance.data.labels = labels;
        this.chartInstance.data.datasets[0].data = chartData;
        this.chartInstance.data.datasets[0].backgroundColor = colors;
        this.chartInstance.update();
      } else {
        this.chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: chartData,
              backgroundColor: colors,
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => {
                    const label = context.label || '';
                    const actualAmount = isAllZero ? 0 : (rawData[context.dataIndex] ?? 0);
                    return `${label}: ₹${Number(actualAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  }
                }
              }
            }
          }
        });
      }
    }, 0);
  }

  getShortId(id: string): string {
    if (!id) return '';
    return String(id).substring(0, 8).toUpperCase();
  }

  getInvoiceDropdownItems(row: any): DropdownItem[] {
    return [
      { label: 'View Transactions', value: 'view-transactions', icon: 'bi bi-eye' },
      { label: 'Download Invoice', value: 'download-invoice', icon: 'bi bi-download' }
    ];
  }

  onInvoiceDropdownAction(item: DropdownItem, row: any): void {
    if (item.value === 'view-transactions') {
      const contractId = row.contractId?._id || row.contractId;
      this.router.navigate(['/transaction-history'], { queryParams: { contractId } });
    } else if (item.value === 'download-invoice') {
      this.downloadInvoice(row._id);
    }
  }

  downloadInvoice(invoiceId: string): void {
    this.transactionService.downloadInvoicePdf(invoiceId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoiceId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err: any) => console.error("Error downloading invoice", err)
    });
  }
}
