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
  typeFilter: 'All' | 'Escrow Deposit' | 'Freelancer Payout' | 'Commission Fee' = 'All';

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

    // Load detailed transactions
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

  onFilterType(type: 'All' | 'Escrow Deposit' | 'Freelancer Payout' | 'Commission Fee'): void {
    this.typeFilter = type;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(t => {
      const matchesSearch = t.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            t.freelancerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            t.id.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = this.typeFilter === 'All' || t.type === this.typeFilter;

      return matchesSearch && matchesType;
    });
  }
}
