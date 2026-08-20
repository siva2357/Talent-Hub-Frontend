import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OfferService } from '../../../core/services/offer.service';

@Component({
  selector: 'app-view-contract-offer',
  imports: [RouterModule, CommonModule],
  templateUrl: './view-contract-offer.html',
  styleUrl: './view-contract-offer.css'
})
export class ViewContractOffer implements OnInit {
  offerId: string = '';
  offer: any = null;
  isLoading = true;
  safePdfUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.offerId) {
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:5000/api/offers/${this.offerId}/pdf`);
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
}
