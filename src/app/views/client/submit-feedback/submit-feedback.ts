import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FeedbackService } from '../../../core/services/feedback.service';
import { ContractService } from '../../../core/services/contract.service';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-submit-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Button],
  templateUrl: './submit-feedback.html',
  styleUrl: './submit-feedback.css'
})
export class SubmitFeedback implements OnInit {
  feedbackForm!: FormGroup;
  contractId: string = '';
  freelancerId: string = '';
  isSubmitting = false;
  contractDetails: any = null;

  // For star rating UI
  ratingHover: { [key: string]: number } = {
    overallRating: 0,
    qualityOfWork: 0,
    requirementsAndDeliverables: 0,
    communication: 0,
    timeliness: 0,
    behaviorAndProfessionalism: 0
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private feedbackService: FeedbackService,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.contractId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.contractId) {
      this.router.navigate(['/manage-contract']);
      return;
    }

    this.initForm();
    this.fetchContractDetails();
  }

  initForm(): void {
    this.feedbackForm = this.fb.group({
      overallRating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      qualityOfWork: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      requirementsAndDeliverables: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      communication: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      timeliness: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      behaviorAndProfessionalism: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      clientComments: ['', [Validators.required, Validators.maxLength(1000)]],
      pros: [''], // Will split by comma
      cons: ['']  // Will split by comma
    });
  }

  fetchContractDetails(): void {
    this.contractService.getClientContractById(this.contractId).subscribe({
      next: (res: any) => {
        if (res.success && res.contract) {
          this.contractDetails = res.contract;
          if (this.contractDetails.applicants && this.contractDetails.applicants.length > 0) {
            // Assuming first applicant is the hired freelancer
            this.freelancerId = this.contractDetails.applicants[0].freelancerId._id;
          }
        }
      },
      error: (err: any) => console.error(err)
    });
  }

  setRating(field: string, value: number): void {
    this.feedbackForm.get(field)?.setValue(value);
  }

  hoverRating(field: string, value: number): void {
    this.ratingHover[field] = value;
  }

  getRating(field: string): number {
    return this.feedbackForm.get(field)?.value || 0;
  }

  submit(): void {
    if (this.feedbackForm.invalid) {
      alert("Please provide an overall rating and fill out all required category ratings and comments.");
      return;
    }

    this.isSubmitting = true;
    const formValue = this.feedbackForm.value;

    const payload = {
      contractId: this.contractId,
      freelancerId: this.freelancerId,
      overallRating: formValue.overallRating,
      categories: {
        qualityOfWork: formValue.qualityOfWork,
        requirementsAndDeliverables: formValue.requirementsAndDeliverables,
        communication: formValue.communication,
        timeliness: formValue.timeliness,
        behaviorAndProfessionalism: formValue.behaviorAndProfessionalism
      },
      clientComments: formValue.clientComments,
      pros: formValue.pros ? formValue.pros.split(',').map((p: string) => p.trim()).filter((p: string) => p) : [],
      cons: formValue.cons ? formValue.cons.split(',').map((p: string) => p.trim()).filter((p: string) => p) : []
    };

    this.feedbackService.submitFeedback(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Feedback submitted successfully!');
          this.router.navigate(['/manage-contract']);
        }
        this.isSubmitting = false;
      },
      error: (err: any) => {
        alert(err.error?.message || 'Failed to submit feedback.');
        this.isSubmitting = false;
      }
    });
  }
}
