import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-legal-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './legal-form.component.html',
  styleUrl: './legal-form.component.css'
})
export class LegalFormComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);

  private fb = inject(FormBuilder);

  contractId: string | null = null;
  contractData: any = null;
  selectedApplicant: any = null;
  isLoading = true;
  error: string | null = null;

  legalForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('contractId');
      if (this.contractId) {
        this.fetchContractDetails(this.contractId);
      } else {
        this.error = "No contract ID provided.";
        this.isLoading = false;
      }
    });
  }

  initForm(): void {
    this.legalForm = this.fb.group({
      scopeOfWork: ['', Validators.required],
      additionalTerms: [''],
      confirmTerms: [false, Validators.requiredTrue]
    });
  }

  fetchContractDetails(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.contractService.getMyContractById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.contract) {
          this.contractData = res.contract;
          
          // Find the shortlisted applicant (the one we are sending the offer to)
          if (this.contractData.applicants && this.contractData.applicants.length > 0) {
            // Find an applicant whose populated applicationId has applicationStatus === 'shortlisted'
            this.selectedApplicant = this.contractData.applicants.find((a: any) => 
              a.applicationId && a.applicationId.applicationStatus === 'shortlisted'
            );
            
            // Fallback if none is marked shortlisted, just take the first one (for robust testing)
            if (!this.selectedApplicant) {
              this.selectedApplicant = this.contractData.applicants[0];
            }
          }
        } else {
          this.error = "Failed to load contract details.";
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching contract:", err);
        this.error = "An error occurred while fetching contract details.";
        this.isLoading = false;
      }
    });
  }

  sendOffer(): void {
    if (!this.selectedApplicant) {
      alert("No applicant selected for this contract.");
      return;
    }
    
    const appId = this.selectedApplicant.applicationId && typeof this.selectedApplicant.applicationId === 'object'
      ? this.selectedApplicant.applicationId._id
      : this.selectedApplicant.applicationId;

    if (!appId) {
      alert("Application ID is missing.");
      return;
    }

    if (this.legalForm.invalid) {
      this.legalForm.markAllAsTouched();
      if (!this.legalForm.get('confirmTerms')?.value) {
        alert("Please confirm the legal terms by checking the box.");
      } else {
        alert("Please fill in the required fields.");
      }
      return;
    }

    this.isSubmitting = true;
    const formValues = this.legalForm.value;
    
    this.applicationService.sendOffer(appId, {
      scopeOfWork: formValues.scopeOfWork,
      additionalTerms: formValues.additionalTerms
    }).subscribe({
      next: (res) => {
        alert("Offer generated and sent successfully!");
        this.isSubmitting = false;
        // Redirect to hired-talent page and activate the offers tab
        this.router.navigate(['/user/hired-talent'], { queryParams: { tab: 'offers' } });
      },
      error: (err) => {
        console.error("Error sending offer:", err);
        alert(err.error?.message || "Failed to send contract offer. Please try again.");
        this.isSubmitting = false;
      }
    });
  }
}

