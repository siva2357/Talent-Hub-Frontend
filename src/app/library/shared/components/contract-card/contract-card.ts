import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

export interface ContractCardData {
  industry: string;
  contractTitle: string;
  estimatedBudget: number;
  contractDescription: string;
  contractStartDate: string;
  contractEndDate: string;
  contractType: string;
  contractSubject: string;
  totalDuration: string;
  status: string;
  hasApplied: boolean;
  hasSaved: boolean;
  _id?: string;
}


import { CommonModule } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';

@Component({
  selector: 'app-contract-card',
  standalone: true,
  imports: [Button, Badge, CommonModule],
  templateUrl: './contract-card.html',
  styleUrl: './contract-card.css'
})
export class ContractCard {

  @Input() contract: ContractCardData | null = null;

  @Output() viewDetails =
    new EventEmitter<ContractCardData>();

  @Output() apply =
    new EventEmitter<ContractCardData>();

  @Output() save =
    new EventEmitter<ContractCardData>();


  onViewDetails(): void {

    if (!this.contract) {
      return;
    }

    this.viewDetails.emit(this.contract);
  }


  onApply(): void {

    if (!this.contract) {
      return;
    }

    this.apply.emit(this.contract);
  }


  onSave(): void {

    if (!this.contract) {
      return;
    }

    this.save.emit(this.contract);
  }


  get formattedBudget(): string {

    if (!this.contract) {
      return '';
    }

    return `₹${this.contract.estimatedBudget.toLocaleString('en-IN')}`;
  }


  get formattedStartDate(): string {

    if (!this.contract?.contractStartDate) {
      return '';
    }

    return this.formatDate(this.contract.contractStartDate);
  }


  get formattedEndDate(): string {

    if (!this.contract?.contractEndDate) {
      return '';
    }

    return this.formatDate(this.contract.contractEndDate);
  }


  private formatDate(date: string): string {

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  getStatusVariant(status: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'active':
      case 'open':
        return 'info';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'closed':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}