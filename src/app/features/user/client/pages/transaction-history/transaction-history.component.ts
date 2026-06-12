import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FinanceService } from '../../../../../core/services/finance.service';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'Completed' | 'In Progress' | 'Review' | 'Pending' | 'Rejected';
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
  currentPhase: 'Funded' | 'In Progress' | 'Review' | 'Released' | 'Rejected';
  milestones: Milestone[];
}

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);
  private financeService = inject(FinanceService);

  searchQuery = '';
  typeFilter = 'All';
  expandedContractId: string | null = null;

  contracts: ContractTransactions[] = [];
  filteredContracts: ContractTransactions[] = [];

  ngOnInit() {
    this.loadDiaries();
  }

  loadDiaries() {
    this.diaryService.getClientDiaries().subscribe({
      next: (res: any) => {
        if (res.success && res.diaries) {
          this.contracts = res.diaries.map((diary: any) => {
            const mappedMilestones = (diary.phases || []).map((p: any) => {
              let mappedStatus: 'Completed' | 'In Progress' | 'Review' | 'Pending' | 'Rejected' = 'Pending';
              if (p.status === 'approved') mappedStatus = 'Completed';
              else if (p.status === 'in-progress') mappedStatus = 'In Progress';
              else if (p.status === 'submitted') mappedStatus = 'Review';
              else if (p.status === 'changes-requested' || p.status === 'overdue') mappedStatus = 'Rejected';

              return {
                id: p._id,
                title: p.name,
                date: p.deadline || '',
                amount: p.amount || 0,
                status: mappedStatus,
                invoiceId: p.status === 'approved' ? `TXN-${p._id.substring(p._id.length - 6).toUpperCase()}` : undefined
              };
            });

            const totalTransacted = (diary.phases || [])
              .filter((p: any) => p.status === 'approved')
              .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

            let mappedPhase: 'Funded' | 'In Progress' | 'Review' | 'Released' | 'Rejected' = 'Funded';
            if (diary.overallStatus === 'in-progress') {
              const hasReview = mappedMilestones.some((m: Milestone) => m.status === 'Review');
              mappedPhase = hasReview ? 'Review' : 'In Progress';
            } else if (diary.overallStatus === 'completed') {
              mappedPhase = 'Released';
            } else if (diary.overallStatus === 'cancelled') {
              mappedPhase = 'Rejected';
            }

            return {
              diaryId: diary._id,
              contractId: diary.contractId?._id || diary._id,
              title: diary.contractId?.contractTitle || 'Contract',
              freelancer: diary.freelancerId?.registrationDetails?.fullName || 'Freelancer',
              type: diary.contractId?.budgetType || 'Fixed Price',
              budget: diary.contractId?.estimatedBudget || 0,
              totalTransacted,
              currentPhase: mappedPhase,
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
      if (c.milestones[i].status === 'Completed') {
        return c.milestones[i];
      }
    }
    return undefined;
  }

  releaseMilestonePayment(c: ContractTransactions, m: Milestone) {
    if (m.status === 'Completed') {
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

