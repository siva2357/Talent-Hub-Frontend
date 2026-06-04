import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContractService }
from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


@Component({
  selector: 'app-contract-proposals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent
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
                  const performance = hasContracts ? (50 + (idHash % 51)) : 0;
                  
                  let performanceTier = 'New';
                  if (hasContracts) {
                    if (performance >= 75) {
                      performanceTier = 'High';
                    } else if (performance < 55) {
                      performanceTier = 'Low';
                    } else {
                      performanceTier = 'Medium';
                    }
                  }

                  // Bind properties back to proposal and freelancer objects
                  proposal.performance = performance;
                  proposal.performanceTier = performanceTier;
                  proposal.rating = rating;
                  proposal.successRate = performance;
                  proposal.hourlyRate = freelancer.hourlyRate || 50;
                  proposal.duration = hasContracts ? `${2 + (idHash % 5)} months` : 'N/A';
                } else {
                  proposal.performance = 0;
                  proposal.performanceTier = 'New';
                  proposal.rating = '0.0';
                  proposal.successRate = 0;
                  proposal.hourlyRate = 0;
                  proposal.duration = 'N/A';
                }
                return proposal;
              });
            }
            return contract;
          });

          // Open first contract
          if (
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

getAvailableActions(): { label: string, value: string }[] {
  if (!this.selectedProposal) return [];
  const status = this.selectedProposal.applicationStatus;
  
  if (status === 'application received') {
    return [
      { label: 'Shortlist Application', value: 'shortlist' },
      { label: 'Reject Application', value: 'reject' }
    ];
  }
  if (status === 'application shortlisted') {
    return [
      { label: 'Schedule Assessment', value: 'schedule-assessment' },
      { label: 'Reject Application', value: 'reject' }
    ];
  }
  if (status === 'assessment completed') {
    return [
      { label: 'Schedule Interview', value: 'schedule-interview' },
      { label: 'Reject Application', value: 'reject' }
    ];
  }
  if (status === 'interview scheduled') {
    return [
      { label: 'Mark Interview Completed', value: 'complete-interview' }
    ];
  }
  if (status === 'interview completed') {
    return [
      { label: 'Hire Candidate (Final Shortlist)', value: 'hire' },
      { label: 'Reject Application', value: 'reject' }
    ];
  }
  return [];
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
  if (!this.selectedProposal || !this.nextAction) return;

  const id = this.selectedProposal.applicationId;
  this.isSubmitting = true;

  if (this.nextAction === 'shortlist') {
    this.applicationService.shortlistApplication(id).subscribe({
      next: () => {
        this.selectedProposal.applicationStatus = 'application shortlisted';
        this.closeModal();
      },
      error: () => this.isSubmitting = false
    });
  } 
  else if (this.nextAction === 'reject') {
    this.applicationService.rejectApplication(id, {}).subscribe({
      next: () => {
        this.selectedProposal.applicationStatus = 'rejected';
        this.closeModal();
      },
      error: () => this.isSubmitting = false
    });
  }
  else if (this.nextAction === 'schedule-assessment') {
    this.applicationService.scheduleAssessment(id, this.assessmentForm).subscribe({
      next: () => {
        this.selectedProposal.applicationStatus = 'assessment scheduled';
        this.closeModal();
      },
      error: () => this.isSubmitting = false
    });
  }
  else if (this.nextAction === 'schedule-interview') {
    this.applicationService.scheduleInterview(id, this.interviewForm).subscribe({
      next: () => {
        this.selectedProposal.applicationStatus = 'interview scheduled';
        this.closeModal();
      },
      error: () => this.isSubmitting = false
    });
  }
  else if (this.nextAction === 'complete-interview') {
    this.applicationService.interviewResult(id, { result: 'completed' }).subscribe({
      next: () => {
        this.selectedProposal.applicationStatus = 'interview completed';
        this.closeModal();
      },
      error: () => this.isSubmitting = false
    });
  }
  else if (this.nextAction === 'hire') {
    this.applicationService.finalizeApplication(id, { result: 'shortlisted' }).subscribe({
      next: () => {
        this.selectedProposal.applicationStatus = 'shortlisted';
        this.closeModal();
      },
      error: () => this.isSubmitting = false
    });
  }
}

closeModal(): void {
  this.showRecruitmentModal = false;
  this.selectedProposal = null;
  this.nextAction = '';
  this.isSubmitting = false;
  document.body.classList.remove('modal-open');
}

}