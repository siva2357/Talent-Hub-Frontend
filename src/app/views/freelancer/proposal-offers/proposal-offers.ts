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
import { Timeline, TimelineStep } from '../../../library/shared/components/timeline/timeline';

interface AppliedContract {
  applicationId: string;
  applicationStatus: string;
  appliedAt: string;
  assessment?: any;
  interview?: any;
  contract: {
    _id: string;
    contractTitle: string;
    budgetType?: string;
    estimatedBudget: number;
    contractDescription: string;
    contractStartDate: string;
    contractEndDate: string;
    contractType: string;
    contractSubject: string;
    createdAt: string;
  };
}

@Component({
  selector: 'app-proposal-offers',
  imports: [RouterModule, CommonModule, Button, Badge, InputField, Timeline, Chip],
  templateUrl: './proposal-offers.html',
  styleUrl: './proposal-offers.css'
})
export class ProposalOffers implements OnInit {
  activeTab: 'proposals' | 'offers' = 'proposals';
  applications: AppliedContract[] = [];
  totalApplications = 0;
  offers: any[] = [];
  totalOffers = 0;
  isLoading = true;
  isLoadingOffers = true;

  activeFilters: { label: string; value: string }[] = [
    { label: 'Date: Last 30 Days', value: '30days' },
    { label: 'Status: Application Submitted', value: 'application submitted' }
  ];

  dateRangeOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' }
  ];

  proposalStatusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Application Submitted', value: 'application submitted' },
    { label: 'Assessment Assigned', value: 'assessment assigned' },
    { label: 'Interview Scheduled', value: 'interview scheduled' },
    { label: 'Hired', value: 'hired' },
    { label: 'Rejected', value: 'rejected' }
  ];

  offerStatusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Sent', value: 'sent' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'Declined', value: 'declined' }
  ];

  sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Highest Budget', value: 'budget_desc' }
  ];

  removeFilter(filterToRemove: { label: string; value: string }) {
    this.activeFilters = this.activeFilters.filter(f => f.value !== filterToRemove.value);
  }

  getStatusBadgeVariant(status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'hired') return 'success';
    if (lowerStatus === 'application submitted' || lowerStatus === 'shortlisted') return 'warning';
    if (lowerStatus.includes('interview')) return 'primary';
    if (lowerStatus.includes('assessment')) return 'info';
    if (lowerStatus === 'rejected') return 'danger';
    return 'secondary';
  }

  constructor(
    private contractService: ContractService,
    private applicationService: ApplicationService,
    private offerService: OfferService
  ) {}

  ngOnInit(): void {
    this.fetchAppliedContracts();
    this.fetchOffers();
  }

  fetchOffers(): void {
    this.isLoadingOffers = true;
    this.offerService.getFreelancerOffers().subscribe({
      next: (res) => {
        if (res.success) {
          this.offers = res.offers || [];
          this.totalOffers = this.offers.length;
        }
        this.isLoadingOffers = false;
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.isLoadingOffers = false;
      }
    });
  }

  fetchAppliedContracts(): void {
    this.isLoading = true;
    this.contractService.getAppliedContracts().subscribe({
      next: (res) => {
        if (res.success) {
          this.applications = res.applications;
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
    // Add logic to join the interview (e.g., navigate to /meet-page)
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
    
    console.log(`Submitting assessment for application: ${applicationId}`);
    this.applicationService.submitAssessment(applicationId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          // Update status locally
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
