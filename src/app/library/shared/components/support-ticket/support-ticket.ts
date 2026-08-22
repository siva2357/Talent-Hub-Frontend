import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';


export interface SupportTicketData {

  _id: string;

  ticketId: string;

  userId: string;

  userType: string;

  userName: string;

  userEmail: string;

  subject: string;

  category: string;

  priority: string;

  message: string;

  attachments: {
    name: string;
    url: string;
    _id: string;
  }[];

  status: string;

  replies: {
    sender: string;
    message: string;
    _id: string;
    attachments: unknown[];
    timestamp: string;
  }[];

  createdAt: string;

  updatedAt: string;

  __v?: number;

}


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

    if (
      !this.ticket ||
      this.ticket.status !== 'Closed'
    ) {
      return '';
    }

    return this.formatDate(this.ticket.updatedAt);

  }


  private formatDate(date: string): string {

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(date));

  }

}