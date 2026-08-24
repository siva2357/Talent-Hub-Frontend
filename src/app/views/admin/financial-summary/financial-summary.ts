import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-summary.html',
  styleUrl: './financial-summary.css'
})
export class FinancialSummary implements OnInit {
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

  ngOnInit() {
    this.fetchTransactions();
    this.fetchStats();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchStats() {
    this.http.get(`${environment.apiGatewayUrl}/admin/finances/stats`, { headers: this.getAuthHeaders() }).subscribe({
      next: (data: any) => {
        this.stats = data;
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
