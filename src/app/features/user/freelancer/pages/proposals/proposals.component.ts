import { Component, OnInit, inject } from '@angular/core';
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
  DateTimeHelper = DateTimeHelper;

  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);


  assessmentSubmitting = false;

offerDeclining = false;

isProposalsLoading = false;

isOffersLoading = false;

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

allProposals: Proposal[] = [];

appliedProposals: Proposal[] = [];

offers: any[] = [];


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

if (
  this.activeTab === 'proposals'
) {

  this.fetchAppliedContracts();

}
else {

  this.fetchOffers();

}
  }

switchTab(
  tab: 'proposals' | 'offers'
): void {

  if (
    this.activeTab === tab
  ) {
    return;
  }

  this.activeTab = tab;

  if (
    tab === 'proposals'
  ) {

    if (
      !this.allProposals.length
    ) {

      this.fetchAppliedContracts();

    }

  }

  if (
    tab === 'offers'
  ) {

    if (
      !this.offers.length
    ) {

      this.fetchOffers();

    }

  }

}

fetchOffers(): void {

  this.isOffersLoading = true;

  this.applicationService
    .getFreelancerOffers()
    .subscribe({

      next: (res: any) => {

        this.offers =
          res?.success
            ? (res.offers || [])
            : [];

        this.isOffersLoading = false;

      },

      error: (err) => {

        console.error(
          'Failed to fetch offers:',
          err
        );

        this.offers = [];

        this.isOffersLoading = false;

      }

    });

}

declineOffer(id: string): void {

  if (
    !confirm(
      'Are you sure you want to decline this contract offer?'
    )
  ) {
    return;
  }

  this.offerDeclining = true;

  this.applicationService
    .declineOffer(id)
    .subscribe({

      next: () => {

        this.fetchOffers();

        this.offerDeclining = false;

      },

      error: (err) => {

        console.error(
          'Failed to decline offer:',
          err
        );

        this.offerDeclining = false;

      }

    });

}

  downloadSignedContract(offerId: string): void {
    window.open(this.applicationService.getContractPdfUrl(offerId), '_blank');
  }

markAssessmentCompleted(
  proposalId: string
): void {

  this.assessmentSubmitting = true;

  this.applicationService
    .submitAssessment(proposalId)
    .subscribe({

      next: () => {

        const proposal =
          this.appliedProposals.find(
            p => p.id === proposalId
          );

        if (proposal) {

          proposal.status =
            'Assessment Completed';

          proposal.assessment.status =
            'completed';

        }

        this.assessmentSubmitting = false;

      },

      error: () => {

        this.assessmentSubmitting = false;

      }

    });

}

fetchAppliedContracts(): void {

  this.isProposalsLoading = true;

  this.contractService
    .getAppliedContracts()
    .subscribe({

      next: (res) => {

        this.allProposals =
          res.success
            ? res.applications.map(
                app => this.mapApplicationToProposal(app)
              )
            : [];

        this.applyFilters();

      },

      error: (err) => {

        console.error(
          'Failed to fetch applied contracts:',
          err
        );

        this.allProposals = [];
        this.appliedProposals = [];

      },

      complete: () => {

        this.isProposalsLoading = false;

      }

    });

}

private mapApplicationToProposal(
  app: AppliedApplication
): Proposal {

  return {

    id: app.applicationId,

    contractId:
      app.contract?._id || '',

    contractTitle:
      app.contract?.contractTitle ||
      'Unknown Title',

    client:
      app.client?.fullName ||
      'Unknown Client',

    date: new Date(
      app.appliedAt
    ).toLocaleDateString(),

    budget: `${
      app.contract?.estimatedBudget?.toLocaleString() || 0
    }`,

    budgetLabel:
      app.contract?.budgetType === 'Hourly Rate'
        ? 'Hourly Rate'
        : 'Proposal Amount',

    duration: this.calculateDuration(
      app.contract?.contractStartDate,
      app.contract?.contractEndDate
    ),

    contractType:
      app.contract?.budgetType === 'Hourly Rate'
        ? 'Hourly'
        : 'Fixed Price',

    level: 'Intermediate',

    description:
      app.contract?.contractDescription || '',

    status:
      app.applicationStatus
        ? app.applicationStatus.replace(
            /\b\w/g,
            l => l.toUpperCase()
          )
        : 'Pending',

    type: this.getProposalType(
      app.applicationStatus
    ),

    assessment:
      app.assessment,

    interview:
      app.interview

  };

}



private getProposalType(
  status: string
): Proposal['type'] {

  if (
    status === 'application received' ||
    status === 'application shortlisted'
  ) {
    return 'Applied';
  }

  if (
    status === 'shortlisted'
  ) {
    return 'Shortlisted';
  }

  if (
    status === 'rejected'
  ) {
    return 'Rejected';
  }

  if (
    status === 'assessment scheduled' ||
    status === 'assessment completed'
  ) {
    return 'Assignment';
  }

  if (
    status === 'interview scheduled' ||
    status === 'interview completed'
  ) {
    return 'Interview';
  }

  return 'Applied';

}

private calculateDuration(
  startDate: string,
  endDate: string
): string {

  if (
    !startDate ||
    !endDate
  ) {
    return 'Unknown';
  }

  const start =
    new Date(startDate);

  const end =
    new Date(endDate);

  const diffDays =
    Math.ceil(
      Math.abs(
        end.getTime() -
        start.getTime()
      ) /
      (1000 * 60 * 60 * 24)
    );

  if (
    diffDays < 30
  ) {
    return `${diffDays} Days`;
  }

  const months =
    Math.floor(
      diffDays / 30
    );

  return `${months} Month${months > 1 ? 's' : ''}`;

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
