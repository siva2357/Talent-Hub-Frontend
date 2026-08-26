import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OfferService } from '../../../core/services/offer.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';

@Component({
  selector: 'app-legal-contract-acceptance',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Button, FileUpload, FilePreview],
  templateUrl: './legal-contract-acceptance.html',
  styleUrl: './legal-contract-acceptance.css'
})
export class LegalContractAcceptance implements OnInit {
  UploadBucket = UploadBucket;
  UploadSection = UploadSection;

  offerId: string = '';
  offer: any = null;
  isLoading = true;
  signatureFile: File | null = null;
  signaturePreview: string | null = null;
  uploadedSignatureUrl: string = '';
  isSubmitting = false;
  isUploading = false;

  consent1 = false;
  consent2 = false;
  consent3 = false;
  consent4 = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) { }

  getSafePdfUrl(): SafeResourceUrl {
    const url = `http://localhost:5000/api/offers/${this.offerId}/pdf`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.offerId) {
      this.fetchOfferDetails();
    }
  }

  fetchOfferDetails(): void {
    this.isLoading = true;
    this.offerService.getOfferById(this.offerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.offer = res.offer;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching offer:', err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(file: File): void {
    if (file) {
      this.signatureFile = file;
      this.isUploading = true;

      // Local preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.signaturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadComplete(url: string): void {
    this.isUploading = false;
    this.uploadedSignatureUrl = url;
  }

  acceptContract(): void {
    if (this.isUploading) {
      alert('Please wait for your signature to finish uploading.');
      return;
    }
    if (!this.consent1 || !this.consent2 || !this.consent3 || !this.consent4) {
      alert('Please check all consent boxes to agree to the legal terms.');
      return;
    }
    if (!this.uploadedSignatureUrl) {
      alert('Please upload your digital signature first.');
      return;
    }

    this.isSubmitting = true;

    this.offerService.signOffer(this.offerId, { freelancerSignature: this.uploadedSignatureUrl }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.router.navigate(['/my-contracts']); // Or whatever the success route is
        } else {
          alert('Failed to accept contract. Please try again.');
        }
      },
      error: (err) => {
        console.error('Error accepting contract:', err);
        this.isSubmitting = false;
        alert('An error occurred while accepting the contract.');
      }
    });
  }
}
