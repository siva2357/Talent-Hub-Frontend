import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../../../../core/services/contract.service';
import { OfferService } from '../../../../../core/services/offer.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { ApplicationService } from '../../../../../core/services/application.service';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-legal-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ButtonComponent, InputComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './legal-form.component.html',
  styleUrl: './legal-form.component.css'
})
export class LegalFormComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private offerService = inject(OfferService);
  private toastr = inject(ToastrService);

  private fb = inject(FormBuilder);

  contractId: string | null = null;
  appId: string | null = null;
  contractData: any = null;
  selectedApplicant: any = null;
  isLoading = true;
  error: string | null = null;

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  clientSignatureUrl: string | null = null;

  legalForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('contractId');
      this.route.queryParams.subscribe(qParams => {
        this.appId = qParams['appId'];
        if (this.contractId) {
          this.fetchContractDetails(this.contractId);
        } else {
          this.error = "No contract ID provided.";
          this.isLoading = false;
        }
      });
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
            if (this.appId) {
              this.selectedApplicant = this.contractData.applicants.find((a: any) =>
                (a.applicationId._id || a.applicationId) === this.appId
              );
            }

            // Fallback if none found
            if (!this.selectedApplicant) {
              this.selectedApplicant = this.contractData.applicants.find((a: any) =>
                a.applicationId && a.applicationId.applicationStatus === 'shortlisted'
              ) || this.contractData.applicants[0];
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

  onSignatureUploaded(url: string | null): void {
    this.clientSignatureUrl = url;
  }

  sendOffer(): void {
    if (!this.selectedApplicant) {
      this.toastr.warning("No applicant selected for this contract.", "Contract Offer");
      return;
    }

    const appId = this.selectedApplicant.applicationId && typeof this.selectedApplicant.applicationId === 'object'
      ? this.selectedApplicant.applicationId._id
      : this.selectedApplicant.applicationId;

    if (!appId) {
      this.toastr.warning("Application ID is missing.", "Contract Offer");
      return;
    }

    if (this.legalForm.invalid || !this.clientSignatureUrl) {
      this.legalForm.markAllAsTouched();
      if (!this.clientSignatureUrl) {
        this.toastr.warning("Please draw or upload your signature before sending the offer.", "Contract Offer");
      } else if (!this.legalForm.get('confirmTerms')?.value) {
        this.toastr.warning("Please confirm the legal terms by checking the box.", "Contract Offer");
      } else {
        this.toastr.warning("Please fill in the required fields.", "Contract Offer");
      }
      return;
    }

    this.isSubmitting = true;
    const formValues = this.legalForm.value;

    this.offerService.createOffer(appId, {
      scopeOfWork: formValues.scopeOfWork,
      additionalTerms: formValues.additionalTerms,
      clientSignature: this.clientSignatureUrl
    }).subscribe({
      next: (res) => {
        this.toastr.success("Offer generated and sent successfully!", "Contract Offer");
        this.isSubmitting = false;
        this.router.navigate(['/user/contract-proposals'], { queryParams: { contractId: this.contractId } });
      },
      error: (err) => {
        console.error("Error sending offer:", err);
        this.toastr.error(err.error?.message || "Failed to send contract offer. Please try again.", "Contract Offer");
        this.isSubmitting = false;
      }
    });
  }
}

