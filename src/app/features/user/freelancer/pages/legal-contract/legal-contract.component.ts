import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { OfferService } from '../../../../../core/services/offer.service';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-legal-contract',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './legal-contract.component.html',
  styleUrl: './legal-contract.component.css'
})
export class LegalContractComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private offerService = inject(OfferService);
  private toastr = inject(ToastrService);

  offerId = signal<string | null>(null);
  offerData = signal<any>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  hasAgreed = signal<boolean>(false);
  isSigning = signal<boolean>(false);
  signatureImage = signal<string | null>(null);
  
  currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.offerId.set(params.get('id'));
      if (this.offerId()) {
        this.fetchOfferDetails(this.offerId()!);
      } else {
        this.error.set("No contract offer ID provided.");
        this.isLoading.set(false);
      }
    });
  }

  fetchOfferDetails(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    if (id.startsWith('mock_')) {
      // Load mock data for testing with mock offers
      setTimeout(() => {
        this.offerData.set({
          contractId: {
            contractTitle: id === 'mock_1' ? 'Senior Angular Developer' : 'UI Designer for Mobile App',
            budgetType: 'Fixed Price',
            estimatedBudget: id === 'mock_1' ? 5000 : 3200,
            contractStartDate: new Date(),
            contractEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            contractDescription: 'This is a mock contract description.'
          },
          clientId: {
            registrationDetails: {
              fullName: id === 'mock_1' ? 'TechNova' : 'GrowthLabs',
              email: 'client@example.com'
            }
          },
          freelancerId: {
            registrationDetails: {
              fullName: 'Siva Prasad',
              email: 'freelancer@example.com'
            }
          },
          scopeOfWork: 'Design and develop key screens and API integrations as per requirements.',
          additionalTerms: 'Payment will be made upon completion.'
        });
        this.isLoading.set(false);
      }, 500);
      return;
    }

    this.offerService.getOfferById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.offer) {
          this.offerData.set(res.offer);
        } else {
          this.error.set("Failed to load offer details.");
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading offer:", err);
        this.error.set("Failed to load contract offer details from the server.");
        this.isLoading.set(false);
      }
    });
  }

  onSignatureUploaded(url: string | null): void {
    this.signatureImage.set(url);
  }

  getContractPdfUrl(): string {
    if (!this.offerId()) return '#';
    return this.offerService.getContractPdfUrl(this.offerId()!);
  }

  downloadContractPdf(): void {
    const currentId = this.offerId();
    if (!currentId || currentId.startsWith('mock_')) {
      this.toastr.warning("PDF download is only available for real server-created offers.", "Contract Signature");
      return;
    }
    window.open(this.getContractPdfUrl(), '_blank');
  }

  signContract() {
    const currentId = this.offerId();
    const currentSignature = this.signatureImage();
    
    if (!this.hasAgreed() || !currentSignature || !currentId) return;

    this.isSigning.set(true);

    if (currentId.startsWith('mock_')) {
      setTimeout(() => {
        this.isSigning.set(false);
        this.toastr.success("Mock offer signed successfully!", "Contract Signature");
        this.router.navigate(['/user/offers']);
      }, 1500);
      return;
    }

    this.offerService.signOffer(currentId, { freelancerSignature: currentSignature }).subscribe({
      next: (res) => {
        this.toastr.success("Contract accepted, signed, and activated successfully!", "Contract Signature");
        this.isSigning.set(false);
        this.router.navigate(['/user/contracts']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Failed to sign the contract. Please try again.", "Contract Signature");
        this.isSigning.set(false);
      }
    });
  }
}
