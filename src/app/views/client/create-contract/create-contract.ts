import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContractService } from '../../../core/services/contract.service';
import { CreateContractDto, UpdateContractDto } from '../../../core/dtos/contract.dto';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { Timeline, TimelineStep } from '../../../library/shared/components/timeline/timeline';


@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputField, Button, Timeline],
  templateUrl: './create-contract.html',
  styleUrl: './create-contract.css'
})

export class CreateContract implements OnInit {
  contractForm!: FormGroup;
  currentStep = 1;
  isSubmitting = false;
  editContractId: string | null = null;
  isLoading = false;

  contractTypeOptions: InputOption[] = [
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' }
  ];

  contractCategoryOptions: InputOption[] = [
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Development', value: 'Mobile Development' },
    { label: 'Design', value: 'Design' }
  ];

  contractSubjectOptions: InputOption[] = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Full Stack', value: 'Full Stack' }
  ];

  contractStatusOptions: InputOption[] = [
    { label: 'Draft', value: 'draft' },
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Closed', value: 'closed' }
  ];

  timelineSteps: TimelineStep[] = [
    { title: 'Basic Details', status: 'active' },
    { title: 'Terms & Conditions', status: 'upcoming' },
    { title: 'Review & Create', status: 'upcoming' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.editContractId = params['id'];
        this.loadContractData(this.editContractId!);
      }
    });
  }

  loadContractData(id: string): void {
    this.isLoading = true;
    this.contractService.getClientContractById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.contract) {
          const c = res.contract;
          this.contractForm.patchValue({
            contractTitle: c.contractTitle,
            contractType: c.contractType,
            contractCategory: c.contractCategory || '',
            contractSubject: c.contractSubject,
            contractDescription: c.contractDescription,
            contractStartDate: c.contractStartDate ? new Date(c.contractStartDate).toISOString().split('T')[0] : '',
            contractEndDate: c.contractEndDate ? new Date(c.contractEndDate).toISOString().split('T')[0] : '',
            status: c.status,
            estimatedBudget: c.estimatedBudget,
            currency: c.currency || 'INR'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching contract', err);
        alert('Failed to load contract data');
      }
    });
  }

  initForm(): void {
    this.contractForm = this.fb.group({
      // Step 1: Basic Details
      contractTitle: ['', [Validators.required, Validators.minLength(5)]],
      contractType: ['', Validators.required],
      contractCategory: ['', Validators.required],
      contractSubject: ['', Validators.required],
      contractDescription: ['', Validators.required],
      contractStartDate: ['', Validators.required],
      contractEndDate: ['', Validators.required],
      status: ['draft'],

      // Step 2: Terms & Conditions (formerly Step 3)
      agreeToTerms1: [false, Validators.requiredTrue],
      agreeToTerms2: [false, Validators.requiredTrue],
      agreeToTerms3: [false, Validators.requiredTrue],


      // Step 2: Budget & Duration
      estimatedBudget: [null, [Validators.required, Validators.min(30000), Validators.max(75000)]],
      currency: ['INR', Validators.required]
    });
  }



  get durationDetails(): { totalDays: number, workingDays: number, weeks: number, approxMonths: number } {
    const start = this.contractForm.get('contractStartDate')?.value;
    const end = this.contractForm.get('contractEndDate')?.value;

    if (!start || !end) return { totalDays: 0, workingDays: 0, weeks: 0, approxMonths: 0 };

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < startDate) return { totalDays: 0, workingDays: 0, weeks: 0, approxMonths: 0 };

    const timeDiff = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    let workingDays = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        workingDays++;
      }
    }

    const weeks = Math.ceil(totalDays / 7);
    const approxMonths = Math.round(totalDays / 30 * 10) / 10;

    return { totalDays, workingDays, weeks, approxMonths };
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (this.contractForm.get('contractTitle')?.invalid || this.contractForm.get('contractType')?.invalid || this.contractForm.get('contractCategory')?.invalid || this.contractForm.get('contractSubject')?.invalid || this.contractForm.get('contractDescription')?.invalid || this.contractForm.get('contractStartDate')?.invalid || this.contractForm.get('contractEndDate')?.invalid || this.contractForm.get('estimatedBudget')?.invalid) {
        this.contractForm.markAllAsTouched();
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (this.contractForm.get('agreeToTerms1')?.invalid || this.contractForm.get('agreeToTerms2')?.invalid || this.contractForm.get('agreeToTerms3')?.invalid) {
        return;
      }
      this.currentStep = 3;
    }
    this.updateTimeline();
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateTimeline();
    }
  }

  onStepClicked(stepIndex: number): void {
    const targetStep = stepIndex + 1;
    if (targetStep < this.currentStep) {
      this.currentStep = targetStep;
      this.updateTimeline();
    }
  }

  private updateTimeline(): void {
    this.timelineSteps = this.timelineSteps.map((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber < this.currentStep) {
        return { ...step, status: 'completed' };
      } else if (stepNumber === this.currentStep) {
        return { ...step, status: 'active' };
      } else {
        return { ...step, status: 'upcoming' };
      }
    });
  }

  submitContract(): void {
    // if (this.contractForm.invalid) {
    //   this.contractForm.markAllAsTouched();
    //   return;
    // }

    this.isSubmitting = true;
    const payload: any = { ...this.contractForm.value };
    payload.contractStartDate = new Date(payload.contractStartDate).toISOString();
    payload.contractEndDate = new Date(payload.contractEndDate).toISOString();
    delete payload.agreeToTerms1;
    delete payload.agreeToTerms2;
    delete payload.agreeToTerms3;

    if (this.editContractId) {
      this.contractService.updateContract(this.editContractId, payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          alert('Contract updated successfully!');
          this.router.navigate(['/manage-contract']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating contract:', error);
          alert(error.error?.message || 'Failed to update contract');
        }
      });
    } else {
      this.contractService.createContract(payload as CreateContractDto).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          alert('Contract created successfully!');
          this.router.navigate(['/manage-contract']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating contract:', error);
          alert(error.error?.message || 'Failed to create contract');
        }
      });
    }
  }
}

