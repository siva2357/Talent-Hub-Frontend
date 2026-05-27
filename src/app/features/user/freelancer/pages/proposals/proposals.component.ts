import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';

interface Proposal {
  id: string;
  contractTitle: string;
  client: string;
  date: string;
  budget: string;
  budgetLabel: string;
  duration: string;
  type: 'Applied' | 'Assignment' | 'Interview' | 'Shortlisted' | 'Rejected';
  contractType: 'Fixed Price' | 'Hourly';
  level: 'Entry' | 'Intermediate' | 'Expert';
  description: string;
  techStack: string[];
  status: string;
  deadline?: string;
  link?: string;
  meetingTime?: string;
}

interface ActiveFilter {
  id: string;
  label: string;
  type: 'search' | 'date' | 'budget' | 'status';
}

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent, ChipComponent],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent implements OnInit {
  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);

  // Tabs: 'proposals' | 'offers'
  activeTab: 'proposals' | 'offers' = 'proposals';

  // Filter Selection State (Internal)
  searchQuery: string = '';
  dateFilter: string = 'All Time';
  budgetFilter: string = 'All Budgets';
  statusFilter: string = 'All Status';

  // Active Filters (Applied)
  activeFilters: ActiveFilter[] = [];

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

  statusOptions = [
    { label: 'All Status', value: 'All Status' },
    { label: 'Applied', value: 'Applied' },
    { label: 'Assignment', value: 'Assignment' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  allProposals: any[] = [];
  appliedProposals: any[] = [];
  offers: any[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    // Check if routed with default tab data
    const snapshotData = this.route.snapshot.data;
    if (snapshotData && snapshotData['defaultTab'] === 'offers') {
      this.activeTab = 'offers';
    }

    // Also check for query parameters to switch tabs dynamically
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'offers') {
        this.activeTab = 'offers';
      } else if (params['tab'] === 'proposals') {
        this.activeTab = 'proposals';
      }
    });

    this.fetchAppliedContracts();
    this.fetchOffers();
  }

  switchTab(tab: 'proposals' | 'offers'): void {
    this.activeTab = tab;
  }

  fetchOffers(): void {
    this.isLoading = true;
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        if (res.success && res.offers) {
          this.offers = res.offers;
        } else {
          this.offers = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch dynamic offers:', err);
        this.offers = [];
        this.isLoading = false;
      }
    });
  }

  declineOffer(id: string) {
    if (confirm('Are you sure you want to decline this contract offer?')) {
      this.applicationService.declineOffer(id).subscribe({
        next: () => {
          alert('Offer declined successfully.');
          this.fetchOffers();
        },
        error: (err) => {
          console.error('Failed to decline offer:', err);
          alert('Failed to decline offer. Please try again.');
        }
      });
    }
  }

  downloadSignedContract(offerId: string): void {
    window.open(this.applicationService.getContractPdfUrl(offerId), '_blank');
  }

  markAssessmentCompleted(proposalId: string) {
    if (!proposalId) return;
    this.isLoading = true;
    this.applicationService.submitAssessment(proposalId).subscribe({
      next: (res) => {
        if (res.success) {
          // Re-fetch to update state
          this.fetchAppliedContracts();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to submit assessment:', err);
        this.isLoading = false;
      }
    });
  }

  fetchAppliedContracts() {
    this.isLoading = true;
    this.contractService.getAppliedContracts().subscribe({
      next: (res: any) => {
        if (res.success && res.applications) {
          this.allProposals = res.applications.map((app: any) => ({
            id: app.applicationId,
            contractTitle: app.contract?.contractTitle || 'Unknown Title',
            client: app.client?.fullName || 'Unknown Client',
            date: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            budget: `$${app.contract?.estimatedBudget?.toLocaleString() || '0'}`,
            budgetLabel: app.contract?.budgetType === 'Hourly Rate' ? 'Hourly Rate' : 'Proposal Amount',
            duration: app.contract?.contractStartDate && app.contract?.contractEndDate ? 
              (() => {
                const start = new Date(app.contract.contractStartDate);
                const end = new Date(app.contract.contractEndDate);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays < 30) return `${diffDays} Days`;
                const diffMonths = Math.floor(diffDays / 30);
                return `${diffMonths} Month${diffMonths > 1 ? 's' : ''}`;
              })() : 'Unknown',
            contractType: app.contract?.budgetType === 'Hourly Rate' ? 'Hourly' : 'Fixed Price',
            level: 'Intermediate',
            description: app.contract?.contractDescription || '',
            techStack: app.contract?.techStack || [],
            status: app.applicationStatus ? app.applicationStatus.replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Pending',
            type: (app.applicationStatus === 'application received' || app.applicationStatus === 'application shortlisted') ? 'Applied' :
              (app.applicationStatus === 'shortlisted') ? 'Shortlisted' :
                app.applicationStatus === 'rejected' ? 'Rejected' :
                  (app.applicationStatus === 'interview scheduled' || app.applicationStatus === 'interview completed') ? 'Interview' :
                    (app.applicationStatus === 'assessment scheduled' || app.applicationStatus === 'assessment completed') ? 'Assignment' : 'Applied',
            assessment: app.assessment,
            interview: app.interview
          }));
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch applied contracts:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    // 1. Update Active Chips
    this.activeFilters = [];
    if (this.searchQuery) {
      this.activeFilters.push({ id: 'search', label: `Search: ${this.searchQuery}`, type: 'search' });
    }
    if (this.dateFilter !== 'All Time') {
      this.activeFilters.push({ id: 'date', label: this.dateFilter, type: 'date' });
    }
    if (this.budgetFilter !== 'All Budgets') {
      this.activeFilters.push({ id: 'budget', label: this.budgetFilter, type: 'budget' });
    }
    if (this.statusFilter !== 'All Status') {
      this.activeFilters.push({ id: 'status', label: this.statusFilter, type: 'status' });
    }

    // 2. Filter Data
    this.appliedProposals = this.allProposals.filter(p => {
      const matchesSearch = p.contractTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.statusFilter === 'All Status' || p.type === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  removeActiveFilter(filter: ActiveFilter) {
    if (filter.id === 'search') this.searchQuery = '';
    if (filter.id === 'date') this.dateFilter = 'All Time';
    if (filter.id === 'budget') this.budgetFilter = 'All Budgets';
    if (filter.id === 'status') this.statusFilter = 'All Status';
    this.applyFilters();
  }

  resetAll() {
    this.searchQuery = '';
    this.dateFilter = 'All Time';
    this.budgetFilter = 'All Budgets';
    this.statusFilter = 'All Status';
    this.applyFilters();
  }




}
