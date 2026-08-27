import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { Chart, registerables } from 'chart.js';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';

Chart.register(...registerables);

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, StatCard, Table, Badge, Button],
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
  transactions: any[] = [];
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

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
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
    });
  }

  loadData(): void {
    this.loading = true;

    this.transactionService.getFinanceStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.stats.totalSpent = res.stats.totalSpent || 0;
          this.stats.escrowBalance = res.stats.upcomingPayments || 0;
          this.stats.platformFees = res.stats.platformFeesPaid || 0;
          this.stats.pendingPayments = res.stats.pendingPayments || 0;

          this.statCards = [
            {
              title: 'TOTAL SPENT',
              value: `₹${(this.stats.totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              icon: 'bi-graph-up-arrow'
            },
            {
              title: 'ESCROW BALANCE',
              value: `₹${(this.stats.escrowBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              icon: 'bi-shield-check'
            },
            {
              title: 'PLATFORM FEES',
              value: `₹${(this.stats.platformFees).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              icon: 'bi-percent'
            },
            {
              title: 'UNFUNDED CONTRACTS',
              value: `₹${(this.stats.pendingPayments).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              icon: 'bi-credit-card'
            }
          ];

          this.generateDistributionChart();
        }
      },
      error: (err: any) => console.error("Error fetching stats", err)
    });

    this.transactionService.getInvoices().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.invoices = (res.invoices || []).filter((inv: any) => inv.type === 'Escrow Funded' || inv.type === 'Deposit');
        }
      },
      error: (err: any) => console.error("Error fetching invoices", err)
    });

    this.transactionService.getTransactions().subscribe({
      next: (res: any) => {
        if (res.success) {
          // Filter to show only contract funding and deposit, not individual phase payments
          this.transactions = (res.transactions || []).filter((txn: any) => txn.type === 'Escrow Funded' || txn.type === 'Deposit');
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error("Error fetching transactions", err);
        this.loading = false;
      }
    });
  }

  generateDistributionChart(): void {
    const spentAmount = this.stats.totalSpent || 0;
    const escrowAmount = this.stats.escrowBalance || 0;
    const feesAmount = this.stats.platformFees || 0;
    const pendingAmount = this.stats.pendingPayments || 0;

    const data = [spentAmount, escrowAmount, feesAmount, pendingAmount];
    const labels = ['Total Spent', 'Escrow Balance', 'Platform Fees', 'Pending Fund'];
    const colors = ['#198754', '#ffc107', '#0d6efd', '#dc3545'];

    this.distributionChart = [];
    labels.forEach((label, i) => {
      this.distributionChart.push({
        label,
        amount: data[i],
        color: colors[i]
      });
    });

    // Small delay to ensure the canvas is rendered in the DOM
    setTimeout(() => {
      const ctx = document.getElementById('financialChart') as HTMLCanvasElement;
      if (!ctx) return;

      if (this.chartInstance) {
        this.chartInstance.data.datasets[0].data = data;
        this.chartInstance.update();
      } else {
        this.chartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: colors,
              borderWidth: 0,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed !== null) {
                      label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
                    }
                    return label;
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
