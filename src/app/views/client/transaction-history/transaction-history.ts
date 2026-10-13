import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction.service';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, Table, Badge, StatCard, RouterLink],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css'
})
export class TransactionHistory implements OnInit {
  diaries: any[] = [];
  transactions: any[] = [];
  loading = true;
  contractId: string | null = null;

  statCards: StatCardData[] = [];
  columns: TableColumn[] = [];

  @ViewChild('phaseTpl', { static: true }) phaseTpl!: TemplateRef<any>;
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<any>;
  @ViewChild('deadlineTpl', { static: true }) deadlineTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {
    this.contractId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.columns = [
      { field: 'sno', headerName: 'S.No' },
      { field: 'phaseName', headerName: 'Phase', cellTemplate: this.phaseTpl },
      { field: 'amount', headerName: 'Amount', cellTemplate: this.amountTpl },
      { field: 'deadline', headerName: 'Deadline', cellTemplate: this.deadlineTpl },
      { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl }
    ];

    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.transactionService.getContractTransactions().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.diaries = res.diaries;
          if (res.stats) {
            this.setupStatCards(res.stats);
          }
          this.flattenTransactions();
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load contract transactions', err);
        this.loading = false;
      }
    });
  }

  flattenTransactions(): void {
    this.transactions = [];
    let sno = 1;
    for (const diary of this.diaries) {
      if (diary.phases && diary.phases.length > 0) {
        for (const phase of diary.phases) {
          this.transactions.push({
            sno: sno++,
            phaseName: phase.name,
            deadline: phase.deadline,
            amount: phase.amount,
            status: phase.status,
            phaseId: phase._id
          });
        }
      }
    }
  }

  setupStatCards(stats: any): void {
    this.statCards = [
      {
        title: 'Total Fund',
        value: `₹${stats.totalFund.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-briefcase'
      },
      {
        title: 'Total Phases',
        value: stats.totalPhases.toString(),
        icon: 'bi-list-task'
      },
      {
        title: 'Pending Amount',
        value: `₹${stats.pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-clock-history'
      },
      {
        title: 'Balance',
        value: `₹${stats.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: 'bi-wallet2'
      }
    ];
  }
}
