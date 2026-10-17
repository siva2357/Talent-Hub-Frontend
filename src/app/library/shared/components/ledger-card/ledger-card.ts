import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../ui/components/badge/badge';
import { Button } from '../../../ui/components/button/button';
import { LedgerTransaction } from '../../../../core/models/ledger-transaztion';


export type { LedgerTransaction };

@Component({
  selector: 'app-ledger-card',
  standalone: true,
  imports: [CommonModule, Badge, Button],
  templateUrl: './ledger-card.html',
  styleUrl: './ledger-card.css'
})
export class LedgerCard {
  @Input({ required: true }) transaction!: LedgerTransaction;
  @Output() payout = new EventEmitter<{ id: string; amount: number }>();

  onProcessPayout(): void {
    if (this.transaction) {
      this.payout.emit({
        id: this.transaction.id,
        amount: this.transaction.freelancerPayment || this.transaction.amount || 0
      });
    }
  }
}
