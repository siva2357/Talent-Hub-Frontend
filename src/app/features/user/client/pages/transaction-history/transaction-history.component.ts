import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FinanceService } from '../../../../../core/services/finance.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: string;
  invoiceId?: string;
}

export interface ContractTransactions {
  diaryId: string;
  contractId: string;
  title: string;
  freelancer: string;
  type: string;
  budget: number;
  totalTransacted: number;
  milestones: Milestone[];
}

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    InputComponent,
    ButtonComponent,
    ChipComponent
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private diaryService = inject(ContractDiaryService);
  private financeService = inject(FinanceService);

  searchQuery = '';
  typeFilter = 'All';
  pendingSearchQuery = '';
  pendingTypeFilter = 'All';
  
  typeOptions = [
    { label: 'All Types', value: 'All' },
    { label: 'Hourly', value: 'Hourly' },
    { label: 'Fixed Price', value: 'Fixed Price' }
  ];

  expandedContractId: string | null = null;

  contracts: ContractTransactions[] = [];
  filteredContracts: ContractTransactions[] = [];

  ngOnInit() {
    this.loadDiaries();
  }

  loadDiaries() {
    this.financeService.getContractTransactions().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.contracts = res.diaries.map((diary: any) => {
            const mappedMilestones = (diary.phases || []).map((p: any) => {
              return {
                id: p._id,
                title: p.name,
                date: p.deadline || '',
                amount: p.amount || 0,
                status: p.status,
                invoiceId: p.status === 'approved' ? `TXN-${p._id.substring(p._id.length - 6).toUpperCase()}` : undefined
              };
            });

            const totalTransacted = (diary.phases || [])
              .filter((p: any) => p.status === 'approved')
              .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

            return {
              diaryId: diary._id,
              contractId: diary.contractId?._id || diary._id,
              title: diary.contractId?.contractTitle || 'Contract',
              freelancer: diary.freelancerId?.registrationDetails?.fullName || 'Freelancer',
              type: diary.contractId?.budgetType || 'Fixed Price',
              budget: diary.contractId?.estimatedBudget || 0,
              totalTransacted,
              milestones: mappedMilestones
            };
          });

          if (this.contracts.length > 0 && !this.expandedContractId) {
            this.expandedContractId = this.contracts[0].contractId;
          }
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Failed to load diaries:', err);
      }
    });
  }

  applyFilters() {
    this.filteredContracts = this.contracts.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.contractId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.freelancer.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesType = this.typeFilter === 'All' || c.type === this.typeFilter;

      return matchesSearch && matchesType;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.typeFilter = 'All';
    this.pendingSearchQuery = '';
    this.pendingTypeFilter = 'All';
    this.applyFilters();
  }

  applyFiltersBtn() {
    this.searchQuery = this.pendingSearchQuery;
    this.typeFilter = this.pendingTypeFilter;
    this.applyFilters();
  }

  removeSearchChip() {
    this.searchQuery = '';
    this.pendingSearchQuery = '';
    this.applyFilters();
  }

  removeTypeChip() {
    this.typeFilter = 'All';
    this.pendingTypeFilter = 'All';
    this.applyFilters();
  }

  toggleContract(contractId: string) {
    if (this.expandedContractId === contractId) {
      this.expandedContractId = null;
    } else {
      this.expandedContractId = contractId;
    }
  }

  getActiveMilestone(c: ContractTransactions): Milestone | undefined {
    return c.milestones.find(m => m.status === 'In Progress' || m.status === 'Review' || m.status === 'Rejected') || 
           c.milestones.find(m => m.status === 'Pending');
  }

  getLatestCompletedMilestone(c: ContractTransactions): Milestone | undefined {
    for (let i = c.milestones.length - 1; i >= 0; i--) {
      if (c.milestones[i].status === 'approved') {
        return c.milestones[i];
      }
    }
    return undefined;
  }

  releaseMilestonePayment(c: ContractTransactions, m: Milestone) {
    if (m.status === 'approved') {
      alert('This milestone payment has already been released!');
      return;
    }

    const confirmRelease = confirm(`Are you sure you want to release the escrow payment of ₹${m.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})} for milestone: "${m.title}"?`);
    if (!confirmRelease) return;

    this.diaryService.reviewPhase(c.diaryId, m.id, 'approve').subscribe({
      next: (res: any) => {
        if (res.success) {
          alert(`Successfully approved milestone and released escrow payment of ₹${m.amount.toFixed(2)} to the freelancer!`);
          this.loadDiaries();
        }
      },
      error: (err) => {
        alert('Failed to release payment: ' + (err.error?.message || 'Error occurred'));
      }
    });
  }

  downloadMilestoneReceipt(c: ContractTransactions, m: Milestone) {
    if (!m.invoiceId) {
      alert('Invoice not available for incomplete milestones.');
      return;
    }

    console.log('Downloading invoice for milestone:', m.id);
    
    const receiptContent = new Blob([
      `TALENT HUB TRANSACTION RECEIPT\n` +
      `=============================\n` +
      `Invoice ID: ${m.invoiceId}\n` +
      `Milestone Reference: ${m.id}\n` +
      `Contract: ${c.title} (${c.contractId})\n` +
      `Milestone Title: ${m.title}\n` +
      `Date Completed: ${m.date ? new Date(m.date).toLocaleDateString() : 'N/A'}\n` +
      `Freelancer: ${c.freelancer}\n` +
      `Amount Released: ₹${m.amount.toFixed(2)}\n` +
      `Status: Released / Completed\n` +
      `=============================\n` +
      `Thank you for trusting Talent Hub!`
    ], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(receiptContent);
    link.download = `Invoice_${m.invoiceId}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
