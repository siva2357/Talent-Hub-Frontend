import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OfferService } from '../../../core/services/offer.service';
import { Button } from '../../../library/ui/components/button/button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-contract-offer',
  imports: [RouterModule, CommonModule, Button],
  templateUrl: './view-contract-offer.html',
  styleUrl: './view-contract-offer.css'
})
export class ViewContractOffer implements OnInit, OnDestroy {
  offerId: string = '';
  offer: any = null;
  isLoading = true;
  errorMessage = '';
  isDeclining = false;
  activeMobileTab: 'details' | 'preview' = 'details';
  safePdfUrl: SafeResourceUrl | null = null;
  countdownText: string = '00d : 00h : 00m : 00s';
  private countdownInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private sanitizer: DomSanitizer
  ) { }

  get rawPdfUrl(): string {
    return `${environment.apiGatewayUrl}/offers/${this.offerId}/pdf`;
  }

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.offerId) {
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.apiGatewayUrl}/offers/${this.offerId}/pdf`);
      this.fetchOfferDetails();
    } else {
      this.isLoading = false;
      this.errorMessage = 'No offer ID provided in URL';
    }
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  fetchOfferDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.offerService.getOfferById(this.offerId).subscribe({
      next: (res) => {
        if (res.success && res.offer) {
          this.offer = res.offer;
          this.startCountdown();
        } else {
          this.errorMessage = res.message || 'Offer not found';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching offer:', err);
        this.errorMessage = err.error?.message || 'Failed to load offer details.';
        this.isLoading = false;
      }
    });
  }

  startCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    const updateTimer = () => {
      if (!this.offer?.createdAt) {
        this.countdownText = '00d : 00h : 00m : 00s';
        return;
      }

      const createdTime = new Date(this.offer.createdAt).getTime();
      const validityDays = Number(this.offer.offerValidityDays || 7);
      const expiryTime = createdTime + validityDays * 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        this.countdownText = 'Offer Expired';
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => String(n).padStart(2, '0');
      this.countdownText = `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
    };

    updateTimer();
    this.countdownInterval = setInterval(updateTimer, 1000);
  }

  formatBudget(budget: any): string {
    if (!budget) return 'N/A';
    if (typeof budget === 'number') {
      return `₹${budget.toLocaleString('en-IN')}`;
    }
    const num = String(budget).replace(/[^0-9]/g, '');
    if (!num) return String(budget);
    return `₹${Number(num).toLocaleString('en-IN')}`;
  }

  formatContractType(type: string): string {
    if (!type) return 'Fixed Price';
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  declineOffer(): void {
    if (!confirm('Are you sure you want to decline this contract offer?')) return;
    this.isDeclining = true;
    this.offerService.declineOffer(this.offerId).subscribe({
      next: (res) => {
        this.isDeclining = false;
        if (res.success) {
          if (this.offer) this.offer.offerStatus = 'declined';
          this.router.navigate(['/proposal-offers']);
        }
      },
      error: (err) => {
        this.isDeclining = false;
        alert(err.error?.message || 'Failed to decline offer');
      }
    });
  }
}
