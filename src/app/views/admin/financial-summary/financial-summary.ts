import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, StatCard, Table, Badge, Button, FormsModule, InputField, Chip, Pagination],
  templateUrl: './financial-summary.html',
  styleUrl: './financial-summary.css'
})
export class FinancialSummary implements OnInit, AfterViewInit, OnDestroy {
  isPayoutModalOpen = false;
  isProcessing = false;
  selectedTransactionId: string | null = null;
  selectedTransactionAmount: number | null = null;
  
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
  @ViewChild('actionsTpl') actionsTpl!: TemplateRef<any>;

  rawTransactions$ = new BehaviorSubject<any[]>([]);
  searchQuery$ = new BehaviorSubject<string>('');
  selectedStatus$ = new BehaviorSubject<string>('All Statuses');
  
  tempSearchQuery = '';
  tempSelectedStatus = 'All Statuses';
  
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);

  transactions$!: Observable<any[]>;
  paginatedTransactions$!: Observable<any[]>;
  activeFilters: { key: string, label: string, value: any }[] = [];

  statusOptions: any[] = [];

  ngOnInit() {
    this.transactions$ = combineLatest([
      this.rawTransactions$,
      this.searchQuery$.pipe(debounceTime(300)),
      this.selectedStatus$
    ]).pipe(
      map(([rawTransactions, search, status]) => {
        let filtered = [...rawTransactions];

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(t => 
            (t.clientName && t.clientName.toLowerCase().includes(q)) ||
            (t.freelancerName && t.freelancerName.toLowerCase().includes(q)) ||
            (t.contractTitle && t.contractTitle.toLowerCase().includes(q))
          );
        }

        if (status && status !== 'All Statuses') {
          filtered = filtered.filter(t => t.status === status);
        }

        this.updateActiveFilters(search, status);
        return filtered;
      })
    );

    this.paginatedTransactions$ = combineLatest([
      this.transactions$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([filtered, page, size]) => {
        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
      })
    );

    this.fetchTransactions();
    this.fetchStats();
    this.fetchStatusOptions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: 'id', headerName: 'S.No', cellTemplate: this.indexTpl,width: 80 },
        { field: 'contractTitle', headerName: 'Contract Title', cellTemplate: this.contractTpl,width: 150 },
        { field: 'clientName', headerName: 'Client', cellTemplate: this.clientTpl,width: 150 },
        { field: 'freelancerName', headerName: 'Freelancer', cellTemplate: this.freelancerTpl,width: 150 },
        { field: 'budget', headerName: 'Client Payment', cellTemplate: this.clientPaymentTpl,width: 150 },
        { field: 'freelancerPayment', headerName: 'Freelancer Payout', cellTemplate: this.freelancerPayoutTpl,width: 150 },
        { field: 'platformFee', headerName: 'Platform Fee', cellTemplate: this.platformFeeTpl,width: 150 },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl,width: 150 },
        { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl, width: 180 }
      ];
    });
  }

  ngOnDestroy() {}

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
        this.rawTransactions$.next(data || []);
      },
      error: (err) => console.error('Failed to fetch transactions', err)
    });
  }

  fetchStatusOptions() {
    this.http.get(`${environment.apiGatewayUrl}/admin/finances/status-options`, { headers: this.getAuthHeaders() }).subscribe({
      next: (options: any) => {
        this.statusOptions = options;
      },
      error: (err) => console.error('Failed to fetch status options', err)
    });
  }

  updateActiveFilters(search: string, status: string) {
    this.activeFilters = [];
    if (search) this.activeFilters.push({ key: 'search', label: `Search: ${search}`, value: search });
    if (status && status !== 'All Statuses') this.activeFilters.push({ key: 'status', label: `Status: ${status}`, value: status });
  }

  onSearchChange(val: string) { this.tempSearchQuery = val; }
  onStatusChange(val: string) { this.tempSelectedStatus = val; }

  applyFilters() {
    this.searchQuery$.next(this.tempSearchQuery);
    this.selectedStatus$.next(this.tempSelectedStatus);
    this.currentPage$.next(1);
  }

  resetFilters(): void {
    this.tempSearchQuery = '';
    this.tempSelectedStatus = 'All Statuses';
    this.searchQuery$.next('');
    this.selectedStatus$.next('All Statuses');
    this.currentPage$.next(1);
  }

  removeFilter(filter: any): void {
    if (filter.key === 'search') {
      this.tempSearchQuery = '';
      this.searchQuery$.next('');
      this.currentPage$.next(1);
    }
    if (filter.key === 'status') {
      this.tempSelectedStatus = 'All Statuses';
      this.selectedStatus$.next('All Statuses');
      this.currentPage$.next(1);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize$.next(size);
    this.currentPage$.next(1);
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

    // Optional confirmation alert, though the modal serves as confirmation itself.
    if (!confirm('Are you sure you want to process this payout?')) return;

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
