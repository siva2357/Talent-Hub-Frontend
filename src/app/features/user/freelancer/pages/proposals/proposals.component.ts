import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { AppliedApplication, AppliedContractsResponse, Proposal } from '../../../../../core/model/proposal.modal';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { ActiveFilter } from '../../../../../core/model/freelancer.model';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent, ChipComponent],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);

  assessmentSubmitting = signal(false);
  offerDeclining = signal(false);
  isProposalsLoading = signal(false);
  isOffersLoading = signal(false);
  
  activeTab = signal<'proposals' | 'offers'>('proposals');

  // Filter Selection State
  searchQuery = signal<string>('');
  dateFilter = signal<string>('All Time');
  budgetFilter = signal<string>('All Budgets');
  statusFilter = signal<string>('All Status');

  // Options
  dateOptions = [
    { label: 'All Time', value: 'All Time' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' }
  ];

  budgetOptions = [
    { label: 'All Budgets', value: 'All Budgets' },
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' }
  ];

  statusOptions = computed(() => {
    if (this.activeTab() === 'proposals') {
      return [
        { label: 'All Status', value: 'All Status' },
        { label: 'Applied', value: 'Applied' },
        { label: 'Assignment', value: 'Assignment' },
        { label: 'Interview', value: 'Interview' },
        { label: 'Shortlisted', value: 'Shortlisted' },
        { label: 'Rejected', value: 'Rejected' }
      ];
    } else {
      return [
        { label: 'All Status', value: 'All Status' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Accepted', value: 'Accepted' },
        { label: 'Declined', value: 'Declined' }
      ];
    }
  });

  allProposals = signal<Proposal[]>([]);
  offers = signal<any[]>([]);

  // Computed Properties
  activeFilters = computed(() => {
    const filters: ActiveFilter[] = [];
    if (this.searchQuery()) filters.push({ id: 'search', label: `Search: ${this.searchQuery()}`, type: 'search' });
    if (this.dateFilter() !== 'All Time') filters.push({ id: 'date', label: this.dateFilter(), type: 'date' });
    if (this.budgetFilter() !== 'All Budgets') filters.push({ id: 'budget', label: this.budgetFilter(), type: 'budget' });
    if (this.statusFilter() !== 'All Status') filters.push({ id: 'status', label: this.statusFilter(), type: 'status' });
    return filters;
  });

  appliedProposals = computed(() => {
    return this.allProposals().filter(p => {
      const q = this.searchQuery().toLowerCase();
      const matchesSearch = p.contractTitle.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
      const matchesStatus = this.statusFilter() === 'All Status' || p.type === this.statusFilter();
      const matchesBudget = this.budgetFilter() === 'All Budgets' || p.contractType === this.budgetFilter();
      return matchesSearch && matchesStatus && matchesBudget;
    });
  });

  filteredOffers = computed(() => {
    return this.offers().filter(o => {
      const q = this.searchQuery().toLowerCase();
      const matchesSearch = o.contractTitle.toLowerCase().includes(q) || o.client.toLowerCase().includes(q);
      const matchesStatus = this.statusFilter() === 'All Status' || o.status === this.statusFilter();
      const matchesBudget = this.budgetFilter() === 'All Budgets' || o.contractType === this.budgetFilter();
      return matchesSearch && matchesStatus && matchesBudget;
    });
  });

  ngOnInit(): void {
    const snapshotData = this.route.snapshot.data;
    if (snapshotData && snapshotData['defaultTab'] === 'offers') {
      this.activeTab.set('offers');
    }

    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'offers') {
        this.activeTab.set('offers');
      } else if (params['tab'] === 'proposals') {
        this.activeTab.set('proposals');
      }
    });

    if (this.activeTab() === 'proposals') {
      this.fetchAppliedContracts();
    } else {
      this.fetchOffers();
    }
  }

  switchTab(tab: 'proposals' | 'offers'): void {
    if (this.activeTab() === tab) return;
    
    this.activeTab.set(tab);
    
    // Reset filters when switching tabs
    this.resetAll();

    if (tab === 'proposals' && !this.allProposals().length) {
      this.fetchAppliedContracts();
    }

    if (tab === 'offers' && !this.offers().length) {
      this.fetchOffers();
    }
  }

  fetchOffers(): void {
    this.isOffersLoading.set(true);
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        this.offers.set(res?.success ? (res.offers || []) : []);
        this.isOffersLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch offers:', err);
        this.offers.set([]);
        this.isOffersLoading.set(false);
      }
    });
  }

  declineOffer(id: string): void {
    if (!confirm('Are you sure you want to decline this contract offer?')) return;

    this.offerDeclining.set(true);
    this.applicationService.declineOffer(id).subscribe({
      next: () => {
        this.fetchOffers();
        this.offerDeclining.set(false);
      },
      error: (err) => {
        console.error('Failed to decline offer:', err);
        this.offerDeclining.set(false);
      }
    });
  }

  downloadSignedContract(offerId: string): void {
    window.open(this.applicationService.getContractPdfUrl(offerId), '_blank');
  }

  markAssessmentCompleted(proposalId: string): void {
    this.assessmentSubmitting.set(true);
    this.applicationService.submitAssessment(proposalId).subscribe({
      next: () => {
        this.allProposals.update(proposals => 
          proposals.map(p => {
            if (p.id === proposalId) {
              return {
                ...p,
                status: 'Assessment Completed',
                assessment: { ...p.assessment, status: 'completed' }
              };
            }
            return p;
          })
        );
        this.assessmentSubmitting.set(false);
      },
      error: () => {
        this.assessmentSubmitting.set(false);
      }
    });
  }

  fetchAppliedContracts(): void {
    this.isProposalsLoading.set(true);
    this.contractService.getAppliedContracts().subscribe({
      next: (res) => {
        this.allProposals.set(res.success ? res.applications.map(app => this.mapApplicationToProposal(app)) : []);
        this.isProposalsLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch applied contracts:', err);
        this.allProposals.set([]);
        this.isProposalsLoading.set(false);
      }
    });
  }

  private mapApplicationToProposal(app: AppliedApplication): Proposal {
    return {
      id: app.applicationId,
      contractId: app.contract?._id || '',
      contractTitle: app.contract?.contractTitle || 'Unknown Title',
      client: app.client?.fullName || 'Unknown Client',
      date: new Date(app.appliedAt).toLocaleDateString(),
      budget: `${app.contract?.estimatedBudget?.toLocaleString() || 0}`,
      budgetLabel: app.contract?.budgetType === 'Hourly Rate' ? 'Hourly Rate' : 'Proposal Amount',
      duration: this.calculateDuration(app.contract?.contractStartDate, app.contract?.contractEndDate),
      contractType: app.contract?.budgetType === 'Hourly Rate' ? 'Hourly' : 'Fixed Price',
      level: 'Intermediate',
      description: app.contract?.contractDescription || '',
      status: app.applicationStatus ? app.applicationStatus.replace(/\b\w/g, l => l.toUpperCase()) : 'Pending',
      type: this.getProposalType(app.applicationStatus),
      assessment: app.assessment,
      interview: app.interview
    };
  }

  private getProposalType(status: string): Proposal['type'] {
    if (status === 'application received' || status === 'application shortlisted') return 'Applied';
    if (status === 'shortlisted') return 'Shortlisted';
    if (status === 'rejected') return 'Rejected';
    if (status === 'assessment scheduled' || status === 'assessment completed') return 'Assignment';
    if (status === 'interview scheduled' || status === 'interview completed') return 'Interview';
    return 'Applied';
  }

  private calculateDuration(startDate: string, endDate: string): string {
    if (!startDate || !endDate) return 'Unknown';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} Days`;
    const months = Math.floor(diffDays / 30);
    return `${months} Month${months > 1 ? 's' : ''}`;
  }

  removeActiveFilter(filter: ActiveFilter) {
    if (filter.id === 'search') this.searchQuery.set('');
    if (filter.id === 'date') this.dateFilter.set('All Time');
    if (filter.id === 'budget') this.budgetFilter.set('All Budgets');
    if (filter.id === 'status') this.statusFilter.set('All Status');
  }

  resetAll() {
    this.searchQuery.set('');
    this.dateFilter.set('All Time');
    this.budgetFilter.set('All Budgets');
    this.statusFilter.set('All Status');
  }
}
