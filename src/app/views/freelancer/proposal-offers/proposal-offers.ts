import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { OfferService } from '../../../core/services/offer.service';

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
  imports: [RouterModule, CommonModule],
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
