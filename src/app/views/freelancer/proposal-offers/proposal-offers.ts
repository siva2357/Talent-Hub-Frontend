import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';

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
  applications: AppliedContract[] = [];
  totalApplications = 0;
  isLoading = true;

  constructor(
    private contractService: ContractService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.fetchAppliedContracts();
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
    if (status === 'hired' || status === 'rejected') return '100%';
    if (['interview scheduled', 'interview completed', 'offer sent', 'offer accepted'].includes(status)) return '66%';
    if (['shortlisted', 'assessment assigned', 'assessment completed'].includes(status)) return '33%';
    return '0%';
  }

  isAssessmentActive(status: string): boolean {
    return ['shortlisted', 'assessment assigned', 'assessment completed', 'interview scheduled', 'interview completed', 'offer sent', 'offer accepted', 'hired', 'rejected'].includes(status);
  }

  isAssessmentDone(status: string): boolean {
    return ['interview scheduled', 'interview completed', 'offer sent', 'offer accepted', 'hired', 'rejected'].includes(status);
  }

  isInterviewActive(status: string): boolean {
    return ['interview scheduled', 'interview completed', 'offer sent', 'offer accepted', 'hired', 'rejected'].includes(status);
  }

  isInterviewDone(status: string): boolean {
    return ['hired', 'rejected'].includes(status);
  }

  isDecisionActive(status: string): boolean {
    return ['hired', 'rejected'].includes(status);
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
}
