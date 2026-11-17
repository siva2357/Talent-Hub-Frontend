import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';
import { OfferLetterCardData } from '../../../../core/models/job.model';

export type { OfferLetterCardData };

@Component({
  selector: 'app-offer-letter-card',
  standalone: true,
  imports: [CommonModule, Badge, Button],
  templateUrl: './offer-letter-card.html',
  styleUrl: './offer-letter-card.css'
})
export class OfferLetterCard {

  @Input() offer: OfferLetterCardData | null = null;

  @Output() viewOffer = new EventEmitter<OfferLetterCardData>();
  @Output() acceptOffer = new EventEmitter<OfferLetterCardData>();
  @Output() declineOffer = new EventEmitter<OfferLetterCardData>();

  getStatusVariant(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'declined':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  get formattedJoiningDate(): string {
    if (!this.offer?.joiningDate) return 'N/A';
    return this.formatDate(this.offer.joiningDate);
  }

  get formattedExpiryDate(): string {
    if (!this.offer?.expiryDate) return 'N/A';
    return this.formatDate(this.offer.expiryDate);
  }

  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  onViewOffer(): void {
    if (!this.offer) return;
    this.viewOffer.emit(this.offer);
  }

  onAcceptOffer(): void {
    if (!this.offer) return;
    this.acceptOffer.emit(this.offer);
  }

  onDeclineOffer(): void {
    if (!this.offer) return;
    this.declineOffer.emit(this.offer);
  }
}
