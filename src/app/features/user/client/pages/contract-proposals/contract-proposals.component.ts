import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ContractService }
from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


import { TalentCardComponent } from '../../../../../shared/components/talent-card/talent-card.component';

@Component({
  selector: 'app-contract-proposals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputComponent,
    ButtonComponent,
    TalentCardComponent
  ],
  templateUrl:
    './contract-proposals.component.html',
  styleUrl:
    './contract-proposals.component.css'
})

export class ContractProposalsComponent
implements OnInit {

  // ========================================
  // UI State
  // ========================================

  expandedContractId: string | null = null;

  searchQuery: string = '';

  isLoading: boolean = false;

  // ========================================
  // Data
  // ========================================

  contractApplicants: any[] = [];

  constructor( private contractService:ContractService,  private applicationService: ApplicationService ) {}

  // ========================================
  // Init
  // ========================================

  ngOnInit(): void {

    this.getApplicants();

  }

  // ========================================
  // Get Contracts With Applicants
  // ========================================

  getApplicants(): void {

    this.isLoading = true;

    this.contractService
      .getContractApplicants()
      .subscribe({

        next: (res) => {

          const rawContracts = res.contracts || [];
          this.contractApplicants = rawContracts.map((contract: any) => {
            if (contract.applicants && Array.isArray(contract.applicants)) {
              contract.applicants = contract.applicants.map((proposal: any) => {
                const freelancer = proposal.freelancer;
                if (freelancer) {
                  const hasContracts = (freelancer.contractCount || 0) > 0;
                  const idHash = freelancer._id ? freelancer._id.toString().split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0) : 10;
                  
                  const rating = hasContracts ? (4.5 + (idHash % 5) / 10).toFixed(1) : '0.0';
                  const projectsCount = hasContracts ? (10 + (idHash % 40)) : 0;
                  const totalHours = hasContracts ? (100 + (idHash % 10) * 150) : 0;
                  const completedCount = freelancer.completedContractsCount || 0;
                  const performance = Math.min(100, completedCount * 10);
                  
                  let performanceTier = 'Low';
                  if (performance >= 80) {
                    performanceTier = 'High';
                  } else if (performance >= 40) {
                    performanceTier = 'Medium';
                  } else {
                    performanceTier = 'Low';
                  }

                  // Bind properties back to proposal and freelancer objects
                  proposal.performance = performance;
                  proposal.performanceTier = performanceTier;
                  proposal.rating = rating;
                  proposal.successRate = performance;
                  proposal.hourlyRate = freelancer.hourlyRate || 50;
                  proposal.duration = hasContracts ? `${2 + (idHash % 5)} months` : 'N/A';
                  proposal.stats = [
                    { value: `$${freelancer.hourlyRate || 50}`, label: 'Bid Rate' },
                    { value: proposal.duration, label: 'Est. Time' },
                    { value: `${performance}%`, label: 'Success' },
                    { value: rating, label: 'Rating', hasStar: true }
                  ];
                } else {
                  proposal.performance = 0;
                  proposal.performanceTier = 'Low';
                  proposal.rating = '0.0';
                  proposal.successRate = 0;
                  proposal.hourlyRate = 0;
                  proposal.duration = 'N/A';
                  proposal.stats = [
                    { value: '$0', label: 'Bid Rate' },
                    { value: 'N/A', label: 'Est. Time' },
                    { value: '0%', label: 'Success' },
                    { value: '0.0', label: 'Rating', hasStar: true }
                  ];
                }
                return proposal;
              });
            }
            return contract;
          });

         const previousExpandedId =
  this.expandedContractId;

if (
  previousExpandedId &&
  this.contractApplicants.some(
    contract =>
      contract._id ===
      previousExpandedId
  )
) {

  this.expandedContractId =
    previousExpandedId;

}
else if (
  this.contractApplicants.length > 0
) {

  this.expandedContractId =
    this.contractApplicants[0]._id;

}

          this.isLoading = false;

        },

        error: (err) => {

          console.error(err);

          this.isLoading = false;

        }

      });

  }

  // ========================================
  // Toggle Accordion
  // ========================================

  toggleContract(id: string): void {

    this.expandedContractId =
      this.expandedContractId === id
        ? null
        : id;

  }

  // ========================================
  // Advance Recruitment Status
  // ========================================

  // ========================================
  // Status Label
  // ========================================

  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'application received':
        return 'Applied';

      case 'application shortlisted':
        return 'Shortlisted';

      case 'assessment scheduled':
        return 'Assessment Pending';

      case 'assessment completed':
        return 'Assessment Completed';

      case 'interview scheduled':
        return 'Interview Pending';
        
      case 'interview completed':
        return 'Interview Completed';

      case 'shortlisted':
        return 'Hired';

      case 'rejected':
        return 'Rejected';

      default:
        return status;

    }

  }

  // ========================================
  // Search Filter
  // ========================================

  getFilteredProposals(
    proposals: any[]
  ): any[] {

    if (
      !this.searchQuery.trim()
    ) {

      return proposals;

    }

    const q =
      this.searchQuery.toLowerCase();

    return proposals.filter(

      (proposal: any) =>

        proposal.freelancer?.fullName
          ?.toLowerCase()
          .includes(q)

        ||

        proposal.freelancer?.professionalHeadline
          ?.toLowerCase()
          .includes(q)

        ||

        proposal.freelancer?.skills?.some(

          (skill: string) =>

            skill
              .toLowerCase()
              .includes(q)

        )

    );

  }

  // ========================================
  // Step Progress
  // ========================================

  getProgressClass(
    status: string
  ): string {

    switch (status) {

      case 'application shortlisted':
        return 'progress-20';

      case 'assessment scheduled':
        return 'progress-40';

      case 'assessment completed':
        return 'progress-50';

      case 'interview scheduled':
        return 'progress-60';
        
      case 'interview completed':
        return 'progress-80';

      case 'shortlisted':
        return 'progress-100';

      case 'rejected':
        return 'progress-100';

      default:
        return '';

    }

  }




// ========================================
// Recruitment Modal State
// ========================================

showRecruitmentModal = false;
isSubmitting = false;
selectedProposal: any = null;

// The chosen action from the dropdown
nextAction: string = '';

// Forms
assessmentForm = { title: '', description: '', date: '' };
interviewForm = { title: '', description: '', date: '' };
rejectionReason = '';

getAvailableActions(): { label: string; value: string }[] {

  if (!this.selectedProposal) {
    return [];
  }

  const status =
    this.selectedProposal.applicationStatus;

  switch (status) {

    case 'application received':
      return [
        {
          label: 'Shortlist Application',
          value: 'shortlist'
        },
        {
          label: 'Reject Application',
          value: 'reject'
        }
      ];

    case 'application shortlisted':
      return [
        {
          label: 'Schedule Assessment',
          value: 'schedule-assessment'
        },
        {
          label: 'Reject Application',
          value: 'reject'
        }
      ];

    case 'assessment scheduled':
      return [
        {
          label: 'Assessment Passed',
          value: 'assessment-pass'
        },
        {
          label: 'Assessment Failed',
          value: 'assessment-fail'
        }
      ];

case 'assessment completed':

  if (
    this.selectedProposal?.assessment?.status
      === 'completed'
  ) {

    return [
      {
        label: 'Schedule Interview',
        value: 'schedule-interview'
      }
    ];

  }

  return [
    {
      label: 'Reject Application',
      value: 'reject'
    }
  ];

    case 'interview scheduled':
      return [
        {
          label: 'Mark Interview Completed',
          value: 'complete-interview'
        }
      ];

    case 'interview completed':
      return [
        {
          label: 'Hire Candidate',
          value: 'hire'
        },
        {
          label: 'Reject Application',
          value: 'reject'
        }
      ];

    default:
      return [];
  }

}

openRecruitmentModal(proposal: any): void {
  this.selectedProposal = proposal;
  this.nextAction = '';
  this.assessmentForm = { title: '', description: '', date: '' };
  this.interviewForm = { title: '', description: '', date: '' };
  this.rejectionReason = '';

  const actions = this.getAvailableActions();
  if (actions.length > 0) {
    this.nextAction = actions[0].value;
  }

  this.showRecruitmentModal = true;
  document.body.classList.add('modal-open');
}

submitRecruitmentAction(): void {

  if (
    !this.selectedProposal ||
    !this.nextAction
  ) {
    return;
  }

  const id =
    this.selectedProposal.applicationId;

  this.isSubmitting = true;

  switch (this.nextAction) {

    case 'shortlist':

      this.applicationService
        .shortlistApplication(id)
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'reject':

      this.applicationService
        .rejectApplication(id, {})
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'schedule-assessment':

      this.applicationService
        .scheduleAssessment(
          id,
          this.assessmentForm
        )
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'assessment-pass':

      this.applicationService
        .assessmentResult(
          id,
          {
            result: 'completed'
          }
        )
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'assessment-fail':

      this.applicationService
        .assessmentResult(
          id,
          {
            result: 'failed'
          }
        )
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'schedule-interview':

      this.applicationService
        .scheduleInterview(
          id,
          this.interviewForm
        )
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'complete-interview':

      this.applicationService
        .interviewResult(
          id,
          {
            feedback: ''
          }
        )
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

    case 'hire':

      this.applicationService
        .finalizeApplication(
          id,
          {
            result: 'shortlisted'
          }
        )
        .subscribe({

          next: () => {

            this.handleSuccess();

          },

          error: (err) => {

            this.handleError(err);

          }

        });

      break;

  }

}

closeModal(): void {
  this.showRecruitmentModal = false;
  this.selectedProposal = null;
  this.nextAction = '';
  this.isSubmitting = false;
  document.body.classList.remove('modal-open');
}


private handleSuccess(): void {

  const expandedId =
    this.expandedContractId;

  this.closeModal();

  this.isLoading = true;

  this.getApplicants();

  setTimeout(() => {

    this.expandedContractId =
      expandedId;

  }, 300);

}

private handleError(error: any): void {

  console.error(error);

  this.isSubmitting = false;

}

}