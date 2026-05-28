import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';

export interface Invoice {
  id: string;
  title: string;
  freelancer: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Processed';
  type: string;
  remainingAmount: number;
}

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class FinancialSummaryComponent implements OnInit {
  private financeService = inject(FinanceService);
  private diaryService = inject(ContractDiaryService);
  private router = inject(Router);

  // Summary Stats
  totalBalance = 0;
  totalSpent = 0;
  upcomingPayments = 0;

  // Search & Filter state
  searchQuery = '';
  statusFilter = 'All';

  // Deposit input state
  fundAmount = 1000;

  // Rich Transaction Invoices Data
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  ngOnInit() {
    this.loadStats();
    this.loadInvoices();
  }

  loadStats() {
    this.financeService.getStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.totalBalance = res.stats.totalBalance || 0;
          this.totalSpent = res.stats.totalSpent || 0;
          this.upcomingPayments = res.stats.upcomingPayments || 0;
        }
      },
      error: (err) => {
        console.error('Failed to load finance stats:', err);
      }
    });
  }

  loadInvoices() {
    this.diaryService.getClientDiaries().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.invoices = res.diaries.map((diary: any) => {
            let mappedStatus: 'Paid' | 'Processed' | 'Pending' = 'Pending';
            if (diary.overallStatus === 'completed') {
              mappedStatus = 'Paid';
            } else if (diary.overallStatus === 'in-progress') {
              mappedStatus = 'Processed';
            }

            const budget = diary.contractId?.estimatedBudget || 0;
            const spent = diary.contractId?.spent || 0;
            const remainingAmount = budget > spent ? (budget - spent) : budget;

            return {
              id: diary.contractId?._id || diary._id,
              title: diary.contractId?.contractTitle || 'Contract',
              freelancer: diary.freelancerId?.registrationDetails?.fullName || 'Freelancer',
              startDate: diary.contractId?.contractStartDate || diary.createdAt,
              endDate: diary.contractId?.contractEndDate || diary.updatedAt,
              amount: spent,
              status: mappedStatus,
              type: diary.contractId?.budgetType || 'Fixed Price',
              remainingAmount: remainingAmount || 1000
            };
          });
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Failed to load invoices:', err);
      }
    });
  }

  applyFilters() {
    this.filteredInvoices = this.invoices.filter(inv => {
      const matchesSearch = inv.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            inv.freelancer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            inv.id.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || inv.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = 'All';
    this.applyFilters();
  }

  downloadInvoice(inv: Invoice) {
    console.log('Downloading invoice details for Contract ID:', inv.id);
    
    const dummyBlob = new Blob([
      `TALENT HUB TRANSACTION INVOICE\n` +
      `=============================\n` +
      `Invoice ID: ${inv.id}\n` +
      `Description: ${inv.title}\n` +
      `Destination: ${inv.freelancer}\n` +
      `Transaction Period: ${new Date(inv.startDate).toLocaleDateString()} to ${new Date(inv.endDate).toLocaleDateString()}\n` +
      `Amount: $${inv.amount.toFixed(2)}\n` +
      `Status: ${inv.status}\n` +
      `Date Generated: ${new Date().toLocaleDateString()}\n` +
      `=============================\n` +
      `Thank you for using Talent Hub!`
    ], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dummyBlob);
    link.download = `Invoice_${inv.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // Navigation to Payment Gateway Page
  openDeposit() {
    if (this.fundAmount > 0) {
      this.router.navigate(['/user/payment-gateway'], { queryParams: { amount: this.fundAmount } });
    }
  }

  // Redirect to Payment Gateway to fund a specific contract
  fundContract(inv: Invoice) {
    if (inv.remainingAmount > 0) {
      this.router.navigate(['/user/payment-gateway'], { queryParams: { amount: inv.remainingAmount } });
    }
  }
}

