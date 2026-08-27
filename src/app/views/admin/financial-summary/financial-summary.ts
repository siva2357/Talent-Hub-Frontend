import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, StatCard, Table, Badge, Button],
  templateUrl: './financial-summary.html',
  styleUrl: './financial-summary.css'
})
export class FinancialSummary implements OnInit, AfterViewInit {
  isPayoutModalOpen = false;
  isProcessing = false;
  selectedTransactionId: string | null = null;
  selectedTransactionAmount: number | null = null;
  transactions: any[] = [];
  stats: any = {
    totalVolume: 0,
    platformCommissions: 0,
    escrowHeld: 0,
    growthPercent: 0
  };
  private http = inject(HttpClient);

  statCards: StatCardData[] = [];
  columns: TableColumn[] = [];

  @ViewChild('indexTpl') indexTpl!: TemplateRef<any>;
  @ViewChild('contractTpl') contractTpl!: TemplateRef<any>;
  @ViewChild('clientTpl') clientTpl!: TemplateRef<any>;
  @ViewChild('freelancerTpl') freelancerTpl!: TemplateRef<any>;
  @ViewChild('clientPaymentTpl') clientPaymentTpl!: TemplateRef<any>;
  @ViewChild('freelancerPayoutTpl') freelancerPayoutTpl!: TemplateRef<any>;
  @ViewChild('platformFeeTpl') platformFeeTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;

  ngOnInit() {
    this.fetchTransactions();
    this.fetchStats();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: 'id', headerName: '#', cellTemplate: this.indexTpl },
        { field: 'contractTitle', headerName: 'Contract Title', cellTemplate: this.contractTpl },
        { field: 'clientName', headerName: 'Client', cellTemplate: this.clientTpl },
        { field: 'freelancerName', headerName: 'Freelancer', cellTemplate: this.freelancerTpl },
        { field: 'budget', headerName: 'Client Payment', cellTemplate: this.clientPaymentTpl },
        { field: 'freelancerPayment', headerName: 'Freelancer Payout', cellTemplate: this.freelancerPayoutTpl },
        { field: 'platformFee', headerName: 'Platform Fee', cellTemplate: this.platformFeeTpl },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl }
      ];
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchStats() {
    this.http.get(`${environment.apiGatewayUrl}/admin/finances/stats`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => {
        this.stats = data;
        this.statCards = [
          { title: 'Platform Fees Collected', value: `₹${(this.stats?.platformCommissions || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: 'bi-graph-up-arrow' },
          { title: 'Pending Withdrawals', value: `₹${(this.stats?.pendingWithdrawals || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: 'bi-clock-history' },
          { title: 'Successful Payouts', value: (this.stats?.successfulPayouts || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 }), icon: 'bi-check-circle-fill' },
          { title: 'Audited Growth', value: `${this.stats?.growthPercent || 0}%`, icon: 'bi-pie-chart' }
        ];
      },
      error: (err) => console.error('Failed to fetch stats', err)
    });
  }

  fetchTransactions() {
    this.http.get(`${environment.apiGatewayUrl}/admin/finances/transactions`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => {
        this.transactions = data;
      },
      error: (err) => console.error('Failed to fetch transactions', err)
    });
  }

  openPayoutModal(transactionId: string, amount: number) {
    this.selectedTransactionId = transactionId;
    this.selectedTransactionAmount = amount;
    this.isPayoutModalOpen = true;
  }

  closePayoutModal() {
    this.isPayoutModalOpen = false;
    this.selectedTransactionId = null;
    this.isProcessing = false;
  }

  confirmPayout() {
    if (!this.selectedTransactionId) return;

    this.isProcessing = true;

    this.http.post(`${environment.apiGatewayUrl}/admin/payout/${this.selectedTransactionId}`, {}, { headers: this.getAuthHeaders() }).subscribe({
      next: () => {
        this.isProcessing = false;
        this.closePayoutModal();
        this.fetchTransactions(); // Refresh list
        this.fetchStats(); // Refresh stats cards
        alert(`Successfully processed payout for transaction ${this.selectedTransactionId} via RazorpayX!`);
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Failed to process payout. Check console for details.');
        console.error(err);
      }
    });
  }
}
