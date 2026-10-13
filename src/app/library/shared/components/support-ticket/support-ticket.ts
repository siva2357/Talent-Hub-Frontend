import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SupportTicketData } from '../../../../core/models/support-ticket.model';
export type {  SupportTicketData  };


@Component({
  selector: 'app-support-ticket',
  standalone: true,
  templateUrl: './support-ticket.html',
  styleUrl: './support-ticket.css'
})
export class SupportTicket {

  @Input() ticket!: SupportTicketData;


  @Output() viewDetails =
    new EventEmitter<SupportTicketData>();


  onViewDetails(): void {

    this.viewDetails.emit(this.ticket);

  }


  get formattedCreatedDate(): string {

    if (!this.ticket?.createdAt) {
      return 'N/A';
    }

    return this.formatDate(this.ticket.createdAt);

  }


  get formattedClosedDate(): string {
    if (!this.ticket || this.ticket.status !== 'Closed' || !this.ticket.updatedAt) {
      return '';
    }
    return this.formatDate(this.ticket.updatedAt);
  }

  private formatDate(date: string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(d);
  }

}