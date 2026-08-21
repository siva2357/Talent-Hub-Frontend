import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';

@Component({
  selector: 'app-legal-contract-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './legal-contract-page.html',
  styleUrl: './legal-contract-page.css'
})
export class LegalContractPage implements OnInit {
  offerForm!: FormGroup;
  applicationId: string | null = null;
  applicationData: any = null;
  isSubmitting = false;
  fileName: string = '';
  signaturePreview: string | ArrayBuffer | null = null;
  isLoading = true;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.paramMap.get('applicationId');

    this.offerForm = this.fb.group({
      scopeOfWork: ['', Validators.required],
      additionalTerms: [''],
      clientSignature: ['', Validators.required],
      confirmAccuracy: [false, Validators.requiredTrue],
      confirmSignatureAuth: [false, Validators.requiredTrue],
      confirmLegallyBinding: [false, Validators.requiredTrue],
      confirmTermsPrivacy: [false, Validators.requiredTrue]
    });

    if (this.applicationId) {
      this.fetchApplicationDetails(this.applicationId);
    } else {
      this.isLoading = false;
    }
  }

  fetchApplicationDetails(id: string): void {
    this.applicationService.getApplicationById(id).subscribe({
      next: (res) => {
        // Based on the actual response structure, use res.application
        this.applicationData = res.application || res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching application details', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
      
      // Upload the signature immediately to get the URL
      this.fileService.uploadFile(file, UploadBucket.ClientData, UploadSection.DigitalSignature).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.signaturePreview = res.url;
            this.offerForm.patchValue({
              clientSignature: res.url
            });
          }
        },
        error: (err) => console.error('Error uploading signature', err)
      });
    }
  }

  onSubmit(): void {
    if (this.offerForm.valid && this.applicationId) {
      this.isSubmitting = true;
      const formData = this.offerForm.value;

      const payload = {
        scopeOfWork: formData.scopeOfWork,
        additionalTerms: formData.additionalTerms,
        clientSignature: formData.clientSignature,
        status: 'pending'
      };

      this.offerService.createOffer(this.applicationId, payload).subscribe({
        next: (res: any) => {
          console.log('Offer sent successfully', res);
          const contractId = this.applicationData.contractId._id || this.applicationData.contractId;
          this.router.navigate(['/applicants', contractId]);
        },
        error: (err) => {
          console.error('Error sending offer', err);
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.offerForm.controls).forEach(key => {
        this.offerForm.get(key)?.markAsTouched();
      });
    }
  }
}