import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { OfferService } from '../../../core/services/offer.service';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Timeline } from '../../../library/shared/components/timeline/timeline';

import { AppliedContract } from '../../../core/models/application.model';
import { TimelineStep } from '../../../core/models/ui.model';
import { MasterDataService } from '../../../core/services/master-data.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-proposal-offers',
  imports: [RouterModule, CommonModule, Button, Badge, InputField, Timeline, Chip],
  templateUrl: './proposal-offers.html',
  styleUrl: './proposal-offers.css'
})
export class ProposalOffers implements OnInit {
  activeTab: 'proposals' | 'offers' = 'proposals';
  
  rawApplications$ = new BehaviorSubject<AppliedContract[]>([]);
  applications: AppliedContract[] = [];
  totalApplications = 0;
  
  rawOffers$ = new BehaviorSubject<any[]>([]);
  offers: any[] = [];
  totalOffers = 0;
  
  isLoading = true;
  isLoadingOffers = true;

  // Filter States - Proposals
  searchQueryProposals = '';
  selectedDateRangeProposals = 'all';
  selectedStatusProposals = 'all';
  activeFiltersProposals: { label: string; type: string; value: string }[] = [];
  appliedFiltersProposals$ = new BehaviorSubject<{ search: string, date: string, status: string }>({ search: '', date: 'all', status: 'all' });

  // Filter States - Offers
  searchQueryOffers = '';
  selectedDateRangeOffers = 'all';
  selectedStatusOffers = 'all';
  activeFiltersOffers: { label: string; type: string; value: string }[] = [];
  appliedFiltersOffers$ = new BehaviorSubject<{ search: string, date: string, status: string }>({ search: '', date: 'all', status: 'all' });

  private subscriptions = new Subscription();

  dateRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' }
  ];

  proposalStatusOptions = [
    { label: 'All Status', value: 'all' }
  ];

  offerStatusOptions = [
    { label: 'All Status', value: 'all' }
  ];

  constructor(
    private contractService: ContractService,
    private applicationService: ApplicationService,
    private offerService: OfferService,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit(): void {
    this.fetchMasterData();
    this.setupReactiveFilters();
    this.fetchAppliedContracts();
    this.fetchOffers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchMasterData(): void {
    this.masterDataService.getMasterDataByCategory('ApplicationStatus').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const fetchedOptions = res.data.map((item: any) => ({ label: item.value, value: item.key }));
          this.proposalStatusOptions = [{ label: 'All Status', value: 'all' }, ...fetchedOptions];
        }
      }
    });

    this.masterDataService.getMasterDataByCategory('OfferStatus').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const fetchedOptions = res.data.map((item: any) => ({ label: item.value, value: item.key }));
          this.offerStatusOptions = [{ label: 'All Status', value: 'all' }, ...fetchedOptions];
        }
      }
    });
  }

  fetchAppliedContracts(): void {
    this.isLoading = true;
    this.contractService.getAppliedContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.rawApplications$.next(res.applications);
          this.totalApplications = res.totalApplications;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching applied contracts:', err);
        this.isLoading = false;
      }
    });
  }

  fetchOffers(): void {
    this.isLoadingOffers = true;
    this.offerService.getFreelancerOffers().subscribe({
      next: (res) => {
        if (res.success) {
          const fetchedOffers = res.offers || [];
          this.rawOffers$.next(fetchedOffers);
          this.totalOffers = fetchedOffers.length;
        }
        this.isLoadingOffers = false;
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.isLoadingOffers = false;
      }
    });
  }

  // --- Filters Setup ---
  setupReactiveFilters(): void {
    // Proposals Filter
    this.subscriptions.add(
      combineLatest([
        this.rawApplications$,
        this.appliedFiltersProposals$
      ]).subscribe(([applications, filters]) => {
        this.activeFiltersProposals = [];
        let filtered = [...applications];

        const { search, status, date } = filters;

        if (search) {
          const q = search.toLowerCase();
          this.activeFiltersProposals.push({ label: `Search: ${search}`, type: 'search', value: search });
          filtered = filtered.filter(a => a.contract.contractTitle.toLowerCase().includes(q));
        }

        if (status && status !== 'all') {
          const statusLabel = this.proposalStatusOptions.find(o => o.value === status)?.label || status;
          this.activeFiltersProposals.push({ label: `Status: ${statusLabel}`, type: 'status', value: status });
          filtered = filtered.filter(a => a.applicationStatus.toLowerCase() === status.toLowerCase());
        }

        if (date && date !== 'all') {
          const dateLabel = this.dateRangeOptions.find(o => o.value === date)?.label || date;
          this.activeFiltersProposals.push({ label: `Date: ${dateLabel}`, type: 'date', value: date });
          
          const now = new Date();
          let threshold = new Date();
          if (date === '7days') threshold.setDate(now.getDate() - 7);
          if (date === '30days') threshold.setDate(now.getDate() - 30);
          
          filtered = filtered.filter(a => new Date(a.appliedAt) >= threshold);
        }

        this.applications = filtered;
      })
    );

    // Offers Filter
    this.subscriptions.add(
      combineLatest([
        this.rawOffers$,
        this.appliedFiltersOffers$
      ]).subscribe(([offers, filters]) => {
        this.activeFiltersOffers = [];
        let filtered = [...offers];

        const { search, status, date } = filters;

        if (search) {
          const q = search.toLowerCase();
          this.activeFiltersOffers.push({ label: `Search: ${search}`, type: 'search', value: search });
          filtered = filtered.filter(o => o.contractTitle?.toLowerCase().includes(q) || o.client?.toLowerCase().includes(q));
        }

        if (status && status !== 'all') {
          const statusLabel = this.offerStatusOptions.find(o => o.value === status)?.label || status;
          this.activeFiltersOffers.push({ label: `Status: ${statusLabel}`, type: 'status', value: status });
          filtered = filtered.filter(o => o.status?.toLowerCase() === status.toLowerCase());
        }

        if (date && date !== 'all') {
          const dateLabel = this.dateRangeOptions.find(o => o.value === date)?.label || date;
          this.activeFiltersOffers.push({ label: `Date: ${dateLabel}`, type: 'date', value: date });
          
          const now = new Date();
          let threshold = new Date();
          if (date === '7days') threshold.setDate(now.getDate() - 7);
          if (date === '30days') threshold.setDate(now.getDate() - 30);
          
          filtered = filtered.filter(o => new Date(o.date) >= threshold);
        }

        this.offers = filtered;
      })
    );
  }

  // --- Proposal Filtering ---
  applyFiltersProposals(): void {
    this.appliedFiltersProposals$.next({
      search: this.searchQueryProposals,
      date: this.selectedDateRangeProposals,
      status: this.selectedStatusProposals
    });
  }

  resetFiltersProposals(): void {
    this.searchQueryProposals = '';
    this.selectedStatusProposals = 'all';
    this.selectedDateRangeProposals = 'all';
    this.applyFiltersProposals();
  }

  removeFilterProposals(filterToRemove: { label: string; type: string; value: string }): void {
    if (filterToRemove.type === 'search') this.searchQueryProposals = '';
    else if (filterToRemove.type === 'status') this.selectedStatusProposals = 'all';
    else if (filterToRemove.type === 'date') this.selectedDateRangeProposals = 'all';
    this.applyFiltersProposals();
  }

  // --- Offer Filtering ---
  applyFiltersOffers(): void {
    this.appliedFiltersOffers$.next({
      search: this.searchQueryOffers,
      date: this.selectedDateRangeOffers,
      status: this.selectedStatusOffers
    });
  }

  resetFiltersOffers(): void {
    this.searchQueryOffers = '';
    this.selectedStatusOffers = 'all';
    this.selectedDateRangeOffers = 'all';
    this.applyFiltersOffers();
  }

  removeFilterOffers(filterToRemove: { label: string; type: string; value: string }): void {
    if (filterToRemove.type === 'search') this.searchQueryOffers = '';
    else if (filterToRemove.type === 'status') this.selectedStatusOffers = 'all';
    else if (filterToRemove.type === 'date') this.selectedDateRangeOffers = 'all';
    this.applyFiltersOffers();
  }

  // --- Utilities ---
  getStatusBadgeVariant(status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'hired') return 'success';
    if (lowerStatus === 'application submitted' || lowerStatus === 'shortlisted') return 'warning';
    if (lowerStatus.includes('interview')) return 'primary';
    if (lowerStatus.includes('assessment')) return 'info';
    if (lowerStatus === 'rejected') return 'danger';
    return 'secondary';
  }

  getProgressWidth(status: string): string {
    if (status === 'hired' || status === 'rejected' || status === 'offer accepted') return '100%';
    if (status === 'offer sent') return '85%';
    if (['interview scheduled', 'interview completed'].includes(status)) return '66%';
    if (['assessment assigned', 'assessment completed'].includes(status)) return '33%';
    if (status === 'shortlisted') return '15%';
    return '0%';
  }

  getTimelineSteps(app: AppliedContract): TimelineStep[] {
    const s = app.applicationStatus;

    // Step 1: Applied
    const step1: TimelineStep = {
      title: 'Applied',
      description: new Date(app.appliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'completed',
    };

    // Step 2: Assessment
    const assessmentActive = this.isAssessmentActive(s);
    const assessmentDone = this.isAssessmentDone(s);
    const step2: TimelineStep = {
      title: 'Assessment',
      status: assessmentDone ? 'completed' : (assessmentActive ? 'active' : 'upcoming'),
    };

    // Step 3: Interview
    const interviewActive = this.isInterviewActive(s);
    const interviewDone = this.isInterviewDone(s);
    const step3: TimelineStep = {
      title: 'Interview',
      status: interviewDone ? 'completed' : (interviewActive ? 'active' : 'upcoming'),
    };

    // Step 4: Decision
    const decisionActive = this.isDecisionActive(s);
    let decisionStatus: any = 'upcoming';
    if (s === 'hired' || s === 'offer accepted') decisionStatus = 'completed';
    else if (s === 'rejected' || s === 'declined') decisionStatus = 'error';
    else if (decisionActive) decisionStatus = 'active';

    const step4: TimelineStep = {
      title: 'Decision',
      status: decisionStatus,
    };

    return [step1, step2, step3, step4];
  }

  isAssessmentActive(status: string): boolean {
    return ['assessment assigned'].includes(status);
  }

  isAssessmentDone(status: string): boolean {
    return ['assessment completed', 'interview scheduled', 'interview completed', 'offer sent', 'offer accepted', 'hired'].includes(status);
  }

  isInterviewActive(status: string): boolean {
    return ['interview scheduled'].includes(status);
  }

  isInterviewDone(status: string): boolean {
    return ['interview completed', 'offer sent', 'offer accepted', 'hired'].includes(status);
  }

  isDecisionActive(status: string): boolean {
    return ['offer sent', 'offer accepted', 'hired', 'rejected'].includes(status);
  }

  joinInterview(applicationId: string): void {
    console.log(`Joining interview for application: ${applicationId}`);
  }

  startAssessment(applicationId: string): void {
    const app = this.applications.find(a => a.applicationId === applicationId);
    if (app && app.assessment && app.assessment.description) {
      window.open(app.assessment.description, '_blank');
    } else {
      console.log('No external link provided in assessment description.');
    }
  }

  markAssessmentCompleted(applicationId: string): void {
    const payload = {
      score: null,
      notes: "Assessment completed by freelancer."
    };

    this.applicationService.submitAssessment(applicationId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          const app = this.applications.find(a => a.applicationId === applicationId);
          if (app) app.applicationStatus = 'assessment completed';
        }
      },
      error: (err) => console.error('Error submitting assessment:', err)
    });
  }

  rejectOffer(offerId: string): void {
    this.offerService.declineOffer(offerId).subscribe({
      next: (res) => {
        if (res.success) {
          const offer = this.offers.find(o => o.id === offerId);
          if (offer) {
            offer.status = 'Declined';
          }
        }
      },
      error: (err) => console.error('Error declining offer:', err)
    });
  }
}
