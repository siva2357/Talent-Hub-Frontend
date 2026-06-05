import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractService } from '../../../../../core/services/contract.service';

export interface Invoice {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  amount: number;
  estimatedBudget?: number;
  status: 'Paid' | 'Pending' | 'Payment Failed';
  type: string;
  contractType?: string;
  contractSubject?: string;
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
  private contractService = inject(ContractService);
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
    this.contractService.getMyContracts().subscribe({
      next: (res: any) => {
        if (res.success && res.contracts) {
          this.invoices = res.contracts.map((contract: any) => {
            const budget = contract.estimatedBudget || 0;
            const spent = contract.spent || 0;
            
            const roundedSpent = Math.round(spent * 100) / 100;
            const roundedBudget = Math.round(budget * 100) / 100;
            const funded = contract.funded || 0;
            const roundedFunded = Math.round(funded * 100) / 100;

            let mappedStatus: 'Paid' | 'Pending' | 'Payment Failed' = 'Pending';
            if (roundedBudget > 0 && roundedFunded >= roundedBudget) {
              mappedStatus = 'Paid';
            } else {
              mappedStatus = 'Pending';
            }

            const remainingAmount = roundedBudget > roundedFunded ? Math.round((roundedBudget - roundedFunded) * 100) / 100 : 0;

            return {
              id: contract._id,
              title: contract.contractTitle || 'Contract',
              startDate: contract.contractStartDate,
              endDate: contract.contractEndDate,
              amount: roundedSpent,
              estimatedBudget: roundedBudget,
              status: mappedStatus,
              type: contract.budgetType || 'Fixed Price',
              contractType: contract.contractType || 'N/A',
              contractSubject: contract.contractSubject || 'N/A',
              remainingAmount: remainingAmount
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
    console.log('Fetching invoice details for Contract ID:', inv.id);

    this.financeService.getInvoices().subscribe({
      next: (res: any) => {
        if (res.success && res.invoices) {
          const matchingTxn = res.invoices.find((txn: any) => 
            txn.contractId && txn.contractId._id === inv.id
          );

          if (matchingTxn) {
            window.open(this.financeService.getInvoicePdfUrl(matchingTxn._id), '_blank');
          } else {
            alert('No completed payment transaction found for this contract yet.');
          }
        } else {
          alert('Failed to retrieve transaction invoices from server.');
        }
      },
      error: (err) => {
        console.error('Failed to load transaction invoices:', err);
        alert('Failed to contact invoice service.');
      }
    });
  }

  // Navigation to Payment Gateway Page (generic wallet deposit - legacy)
  openDeposit() {
    if (this.fundAmount > 0) {
      this.router.navigate(['/user/payment-gateway'], { queryParams: { amount: this.fundAmount } });
    }
  }

  // Redirect to Payment Gateway to fund a specific contract
  fundContract(inv: Invoice) {
    if (inv.remainingAmount > 0) {
      this.router.navigate(['/user/payment-gateway'], {
        queryParams: {
          amount: inv.remainingAmount,
          contractId: inv.id,
          contractTitle: inv.title
        }
      });
    }
  }
}

