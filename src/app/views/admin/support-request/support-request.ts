import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/support.service';

@Component({
  selector: 'app-support-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './support-request.html',
  styleUrl: './support-request.css'
})
export class SupportRequest implements OnInit {
  tickets: any[] = [];
  filteredTickets: any[] = [];
  isLoading = true;
  
  // Modal Data
  selectedTicket: any = null;
  replyMessage = '';
  isReplying = false;

  // Filters
  searchTerm = '';
  statusFilter = '';

  constructor(private supportService: SupportService) {}

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.isLoading = true;
    this.supportService.getAllTicketsAdmin().subscribe({
      next: (res) => {
        if (res.success) {
          this.tickets = res.tickets || [];
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tickets', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredTickets = this.tickets.filter(t => {
      const matchSearch = t.ticketId.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          t.userName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.statusFilter ? t.status === this.statusFilter : true;
      return matchSearch && matchStatus;
    });
  }

  openTicketModal(ticket: any) {
    this.selectedTicket = ticket;
    this.replyMessage = '';
    // Use bootstrap modal API to open modal
    const modal = document.getElementById('ticketDetailsModal');
    if (modal) {
      // @ts-ignore
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }

  submitReply() {
    if (!this.replyMessage.trim() || !this.selectedTicket) return;
    
    this.isReplying = true;
    const payload = {
      message: this.replyMessage,
      attachments: [] // Admins only send text based on user requirements
    };

    this.supportService.replyToTicketAdmin(this.selectedTicket.ticketId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          // If the ticket object is returned, handle it. If replies array is returned, use it.
          // Fallback to manually pushing if backend only returns success.
          if (res.ticket && res.ticket.replies) {
             this.selectedTicket.replies = res.ticket.replies;
          } else if (res.reply) {
             this.selectedTicket.replies.push(res.reply);
          }
          this.selectedTicket.status = res.ticket ? res.ticket.status : 'WaitingForUser';
          this.replyMessage = '';
          this.applyFilters();
        }
        this.isReplying = false;
      },
      error: (err) => {
        console.error('Error submitting reply', err);
        this.isReplying = false;
      }
    });
  }

  changeStatus(status: string) {
    if (!this.selectedTicket) return;
    this.supportService.updateTicketStatus(this.selectedTicket.ticketId, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedTicket.status = status;
          this.applyFilters();
        }
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  getStatusBadgeClass(status: string): string {
    const map: {[key: string]: string} = {
      'Open': 'bg-primary bg-opacity-10 text-primary border-primary',
      'WaitingForAdmin': 'bg-warning bg-opacity-10 text-warning-dark border-warning',
      'WaitingForUser': 'bg-info bg-opacity-10 text-info border-info',
      'Resolved': 'bg-success bg-opacity-10 text-success border-success',
      'Closed': 'bg-secondary bg-opacity-10 text-secondary border-secondary'
    };
    return map[status] ? `${map[status]} border border-opacity-50` : 'bg-primary bg-opacity-10 text-primary';
  }
}

