import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { RichTextEditor } from '../../../library/shared/components/rich-text-editor/rich-text-editor';

@Component({
  selector: 'app-legal-contract-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Button, FileUpload, FilePreview, RichTextEditor],
  templateUrl: './legal-contract-page.html',
  styleUrl: './legal-contract-page.css'
})
export class LegalContractPage implements OnInit {
  UploadBucket = UploadBucket;
  UploadSection = UploadSection;
  
  offerForm!: FormGroup;
  applicationId: string | null = null;
  contractId: string | null = null;
  applicationData: any = null;
  isSubmitting = false;
  fileName: string = '';
  signaturePreview: string | null = null;
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
        this.contractId = this.applicationData?.contractId?._id || this.applicationData?.contractId;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching application details', err);
        this.isLoading = false;
      }
    });
  }

  onUploadComplete(url: string): void {
    if (url) {
      this.signaturePreview = url;
      this.offerForm.patchValue({
        clientSignature: url
      });
    }
  }

  get isOfferAlreadySent(): boolean {
    const status = this.applicationData?.offerStatus || this.applicationData?.offer?.offerStatus;
    return !!status && status.toLowerCase() !== 'none';
  }

  onSubmit(): void {
    if (this.isOfferAlreadySent) {
      return;
    }

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
          this.router.navigate(['/applicants', this.contractId]);
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

  formatContractType(type?: string): string {
    if (!type) return 'Fixed Price';
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getFreelancerInitials(): string {
    const name = this.applicationData?.freelancerId?.registrationDetails?.fullName;
    if (!name) return 'FL';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  getContractDuration(): string {
    const start = this.applicationData?.contractId?.contractStartDate;
    const end = this.applicationData?.contractId?.contractEndDate;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 30) {
        const months = Math.round(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} (${diffDays} days)`;
      }
      if (diffDays >= 7) {
        const weeks = Math.round(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} (${diffDays} days)`;
      }
      return `${diffDays} days`;
    }
    return this.applicationData?.contractId?.duration || 'Timeline specified in contract';
  }
}