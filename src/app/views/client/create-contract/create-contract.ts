import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContractService } from '../../../core/services/contract.service';
import { CreateContractDto } from '../../../core/dtos/contract.dto';



@Component({
  selector: 'app-create-contract',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-contract.html',
  styleUrl: './create-contract.css'
})

export class CreateContract implements OnInit {
  contractForm!: FormGroup;
  currentStep = 1;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private contractService: ContractService
  ) { }

  ngOnInit(): void {
    this.initForm();
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
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.currentStep = 3;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitContract(): void {
    // if (this.contractForm.invalid) {
    //   this.contractForm.markAllAsTouched();
    //   return;
    // }

    this.isSubmitting = true;
    const payload: CreateContractDto = { ...this.contractForm.value };
    payload.contractStartDate = new Date(payload.contractStartDate).toISOString();
    payload.contractEndDate = new Date(payload.contractEndDate).toISOString();
    delete (payload as any).agreeToTerms1;
    delete (payload as any).agreeToTerms2;
    delete (payload as any).agreeToTerms3;

    this.contractService.createContract(payload).subscribe({
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

