import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Availability } from '../../../../../core/enums/availability.enum';
import { BudgetTypeEnum } from '../../../../../core/enums/contract.enum';
import { Gender } from '../../../../../core/enums/gender.enum';
import { Language } from '../../../../../core/enums/language.enum';
import { ChipComponent } from "../../../../../shared/components/chip/chip.component";


@Component({
  selector: 'app-contract-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, InputComponent, ButtonComponent, ChipComponent],
  templateUrl: './contract-proposals.component.html',
  styleUrl: './contract-proposals.component.css'
})

export class ContractProposalsComponent implements OnInit {
  searchQuery: string = '';
  isLoading: boolean = false;
  showRecruitmentModal = false;
  isSubmitting = false;
  selectedProposal: any = null;
  nextAction: string = '';
  assessmentFormGroup!: FormGroup;
  interviewFormGroup!: FormGroup;
  rejectionReason = '';

selectedAvailability = ''; 
 contractId: string | null = null;
selectedBudgetType = '';
selectedGender = '';
selectedLanguages: string[] = [];

applicants: any[] = [];

  constructor(private contractService: ContractService, private applicationService: ApplicationService,  private route: ActivatedRoute, private fb: FormBuilder) { }

ngOnInit(): void {

  this.route.queryParamMap.subscribe(params => {
    this.contractId = params.get('contractId');
    this.getApplicants();
  });

  this.assessmentFormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required]
  });

  this.interviewFormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required]
  });

}


getApplicants(): void {

  this.isLoading = true;

  this.contractService
    .getContractApplicants(this.contractId || undefined)
    .subscribe({

      next: (res) => {

        this.applicants = res.applicants || [];
        console.log(this.applicants);

        this.isLoading = false;
      },

      error: (err) => {

        console.error(err);
        this.isLoading = false;

      }

    });

}

  viewProfile(freelancerId: string): void {
  console.log('View profile:', freelancerId);

  // later:
  // this.router.navigate(['/freelancer', freelancerId]);
}



  getStatusLabel( status: string): string {
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


  availabilityOptions = [
  { label: 'All Availability', value: '' },
  ...Object.values(Availability).map(value => ({
    label: value.replace('-', ' '),
    value
  }))
];

budgetTypeOptions = [
  { label: 'All Budget Types', value: '' },
  ...Object.values(BudgetTypeEnum).map(value => ({
    label: value,
    value
  }))
];

genderOptions = [
  { label: 'All Genders', value: '' },
  ...Object.values(Gender).map(value => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value
  }))
];

languageOptions = Object.values(Language).map(value => ({
  label: value,
  value
}));



activeFilters: {
  key: string;
  label: string;
}[] = [];


applyFilters(): void {

  this.activeFilters = [];

  if (this.selectedAvailability) {
    this.activeFilters.push({
      key: 'availability',
      label: `Availability: ${this.selectedAvailability}`
    });
  }

  if (this.selectedBudgetType) {
    this.activeFilters.push({
      key: 'budgetType',
      label: `Budget: ${this.selectedBudgetType}`
    });
  }

  if (this.selectedGender) {
    this.activeFilters.push({
      key: 'gender',
      label: `Gender: ${this.selectedGender}`
    });
  }

  this.selectedLanguages.forEach(lang => {
    this.activeFilters.push({
      key: `language-${lang}`,
      label: lang
    });
  });
}


removeFilter(key: string): void {

  switch (key) {

    case 'availability':
      this.selectedAvailability = '';
      break;

    case 'budgetType':
      this.selectedBudgetType = '';
      break;

    case 'gender':
      this.selectedGender = '';
      break;

    default:

      if (key.startsWith('language-')) {

        const language = key.replace('language-', '');

        this.selectedLanguages =
          this.selectedLanguages.filter(
            x => x !== language
          );
      }

      break;
  }

  this.applyFilters();
}


getFilteredProposals(proposals: any[]): any[] {

  return proposals.filter((proposal: any) => {

    const freelancer = proposal.freelancer;

    const searchMatch =
      !this.searchQuery ||
      freelancer?.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      freelancer?.professionalHeadline?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      freelancer?.skills?.some((s: string) =>
        s.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

    const availabilityMatch =
      !this.selectedAvailability ||
      freelancer?.availability?.includes(this.selectedAvailability);

    const budgetTypeMatch =
      !this.selectedBudgetType ||
      freelancer?.budgetType === this.selectedBudgetType;

    const genderMatch =
      !this.selectedGender ||
      freelancer?.gender === this.selectedGender;

    const languageMatch =
      this.selectedLanguages.length === 0 ||
      this.selectedLanguages.every((lang: string) =>
        freelancer?.languages?.includes(lang)
      );

    return (
      searchMatch &&
      availabilityMatch &&
      budgetTypeMatch &&
      genderMatch &&
      languageMatch
    );
  });
}

clearFilters(): void {

  this.searchQuery = '';

  this.selectedAvailability = '';

  this.selectedBudgetType = '';

  this.selectedGender = '';

  this.selectedLanguages = [];

  this.activeFilters = [];
}


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
    this.assessmentFormGroup.reset();
    this.interviewFormGroup.reset();
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

    const id =  this.selectedProposal.applicationId;
    this.isSubmitting = true;
    switch (this.nextAction) {

      case 'shortlist':
        this.applicationService.shortlistApplication(id).subscribe({
            next: () => {
              this.handleSuccess();
            },
            error: (err) => {
              this.handleError(err);
            }
          });
        break;

      case 'reject':
        this.applicationService.rejectApplication(id, {}).subscribe({
            next: () => {
              this.handleSuccess();
            },

            error: (err) => {
              this.handleError(err);
            }

          });

        break;

      case 'schedule-assessment':
        if (this.assessmentFormGroup.invalid) {
          this.assessmentFormGroup.markAllAsTouched();
          this.isSubmitting = false;
          return;
        }
        this.applicationService.scheduleAssessment( id,this.assessmentFormGroup.value).subscribe({
            next: () => {
              this.handleSuccess();
            },
            error: (err) => {
              this.handleError(err);
            }
          });

        break;

      case 'assessment-pass':
  this.applicationService.assessmentResult(
    id,
    { result: 'passed' }
  ).subscribe({
    next: () => this.handleSuccess(),
    error: (err) => this.handleError(err)
  });
break;

      case 'assessment-fail':
        this.applicationService.assessmentResult( id,{ result: 'failed'}).subscribe({
            next: () => {
              this.handleSuccess();
            },
            error: (err) => {
              this.handleError(err);
            }
          });

        break;

      case 'schedule-interview':
        if (this.interviewFormGroup.invalid) {
          this.interviewFormGroup.markAllAsTouched();
          this.isSubmitting = false;
          return;
        }
        this.applicationService.scheduleInterview( id,this.interviewFormGroup.value).subscribe({
            next: () => {
              this.handleSuccess();
            },
            error: (err) => {
              this.handleError(err);
            }
          });

        break;

      case 'complete-interview':
        this.applicationService.interviewResult( id,{ result: 'passed'}).subscribe({
            next: () => {
              this.handleSuccess();
            },
            error: (err) => {
              this.handleError(err);
            }
          });

        break;

      case 'hire':
        this.applicationService.finalizeApplication( id, { result: 'shortlisted'}).subscribe({
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

  this.closeModal();
  this.getApplicants();

}

  private handleError(error: any): void {
    console.error(error);
    this.isSubmitting = false;
  }



  sendOffer(proposal: any): void {

  const payload = {
    scopeOfWork: '',
    additionalTerms: ''
  };

  this.applicationService
    .sendOffer(
      proposal.applicationId,
      payload
    )
    .subscribe({

      next: () => {
        this.getApplicants();
      },

      error: (err) => {
        console.error(err);
      }

    });

}




}