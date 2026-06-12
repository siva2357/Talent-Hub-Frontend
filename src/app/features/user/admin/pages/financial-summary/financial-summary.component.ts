import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, TransactionData } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-financial-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class AdminFinancialSummaryComponent implements OnInit {
  private adminService = inject(AdminService);

  transactions: TransactionData[] = [];
  filteredTransactions: TransactionData[] = [];
  
  // Ledger stats
  financialStats = {
    totalVolume: 0,
    platformCommissions: 0,
    escrowHeld: 0,
    growthPercent: 0
  };

  searchTerm = '';
  statusFilter: 'All' | 'Completed' | 'In Progress' | 'Pending' = 'All';

  ngOnInit(): void {
    this.loadFinancials();
  }

  loadFinancials(): void {
    // Load ledger stats
    this.adminService.getFinancialStats().subscribe({
      next: (stats) => {
        this.financialStats = stats;
      }
    });

    // Load detailed transactions (contracts data)
    this.adminService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onFilterStatus(status: 'All' | 'Completed' | 'In Progress' | 'Pending'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = t.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            t.freelancerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            (t.contractTitle || '').toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'All' || t.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }
}
