import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OfferService } from '../../../core/services/offer.service';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';
import { Button } from '../../../library/ui/components/button/button';
import { StatCardData } from '../../../core/models/ui.model';

@Component({
  selector: 'app-view-contract-offer',
  imports: [RouterModule, CommonModule, StatCard, Button],
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
  ) { }

  get stats(): StatCardData[] {
    if (!this.offer) return [];

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return [
      { title: 'Client', value: this.offer.clientId?.registrationDetails?.fullName || 'N/A', icon: 'bi bi-person-badge text-primary' },
      { title: 'Contractor', value: this.offer.freelancerId?.registrationDetails?.fullName || 'N/A', icon: 'bi bi-person-workspace text-secondary' },
      { title: 'Contract Title', value: this.offer.contractId?.contractTitle || 'N/A', icon: 'bi bi-file-earmark-text text-info' },
      { title: 'Contract Type', value: this.offer.contractId?.contractType || 'Fixed Price', icon: 'bi bi-cash-stack text-success' },
      { title: 'Budget', value: `₹${this.offer.contractId?.estimatedBudget || 'N/A'}`, icon: 'bi bi-currency-rupee text-success' },
      { title: 'Category', value: this.offer.contractId?.contractSubject || 'N/A', icon: 'bi bi-folder2-open text-primary' },
      { title: 'Offer Date', value: formatDate(this.offer.createdAt), icon: 'bi bi-calendar-check text-purple' },
      { title: 'Start Date', value: formatDate(this.offer.contractId?.contractStartDate), icon: 'bi bi-calendar-event text-primary' },
      { title: 'End Date', value: formatDate(this.offer.contractId?.contractEndDate), icon: 'bi bi-calendar-x text-danger' }
    ];
  }

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
