
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FinanceService } from '../../../../../core/services/finance.service';
import { ContractService } from '../../../../../core/services/contract.service';
import { Table } from "../../../../../shared/components/table/table.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { ChipComponent } from "../../../../../shared/components/chip/chip.component";
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

export interface Invoice {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  amount: number;
  estimatedBudget?: number;
  status: string;
  type: string;
  contractType?: string;
  contractSubject?: string;
  remainingAmount: number;
}

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Table,
    ButtonComponent,
    InputComponent,
    ChipComponent,
    BadgeComponent
  ],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class FinancialSummaryComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private financeService = inject(FinanceService);
  private contractService = inject(ContractService);
  private router = inject(Router);

  // Summary Stats
  totalBalance = 0;
  totalSpent = 0;
  upcomingPayments = 0;
  platformFeesPaid = 0;

  // Search & Filter state
  searchQuery = '';
  statusFilter = 'All';
  pendingSearchQuery = '';
  pendingStatusFilter = 'All';

  statusOptions = [
    { label: 'All Contracts', value: 'All' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Pending', value: 'pending' }
  ];

  // Deposit input state
  fundAmount = 1000;
  columns: any[] = [];

  // Rich Transaction Invoices Data
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  @ViewChild('titleTemplate', { static: true })
  titleTemplate!: TemplateRef<any>;

  @ViewChild('budgetTemplate', { static: true })
  budgetTemplate!: TemplateRef<any>;

  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.loadStats();
    this.loadInvoices();

    this.columns = [
      {
        name: 'Contract Title',
        prop: 'title',
        cellTemplate: this.titleTemplate
      },
      {
        name: 'Contract Type',
        prop: 'contractType'
      },
      {
        name: 'Subject',
        prop: 'contractSubject'
      },
      {
        name: 'Budget Type',
        prop: 'type'
      },
      {
        name: 'Budget',
        prop: 'estimatedBudget',
        cellTemplate: this.budgetTemplate
      },
      { name: 'Status', prop: 'status', cellTemplate: this.statusTemplate },
      { name: 'Actions', prop: 'actions', cellTemplate: this.actionTemplate, sortable: false, width: 120 }
    ];
  }





  loadStats() {
    this.financeService.getStats().subscribe({
      next: (res: any) => {
        if (res.success && res.stats) {
          this.totalBalance = res.stats.totalBalance || 0;
          this.totalSpent = res.stats.totalSpent || 0;
          this.upcomingPayments = res.stats.upcomingPayments || 0;
          this.platformFeesPaid = res.stats.platformFeesPaid || 0;
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



            const remainingAmount = roundedBudget > roundedFunded ? Math.round((roundedBudget - roundedFunded) * 100) / 100 : 0;

            return {
              id: contract._id,
              title: contract.contractTitle || 'Contract',
              startDate: contract.contractStartDate,
              endDate: contract.contractEndDate,
              amount: roundedSpent,
              estimatedBudget: roundedBudget,
              status: contract.status || 'pending',
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
    this.pendingSearchQuery = '';
    this.pendingStatusFilter = 'All';
    this.applyFilters();
  }

  applyFiltersBtn() {
    this.searchQuery = this.pendingSearchQuery;
    this.statusFilter = this.pendingStatusFilter;
    this.applyFilters();
  }

  removeSearchChip() {
    this.searchQuery = '';
    this.pendingSearchQuery = '';
    this.applyFilters();
  }

  removeStatusChip() {
    this.statusFilter = 'All';
    this.pendingStatusFilter = 'All';
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

