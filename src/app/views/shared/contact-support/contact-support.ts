import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../core/services/support.service';
import { AuthService } from '../../../core/services/auth.service';
import { SupportTicket } from '../../../library/shared/components/support-ticket/support-ticket';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, SupportTicket, StatCard],
  providers: [DatePipe],
  templateUrl: './contact-support.html',
  styleUrl: './contact-support.css'
})
export class ContactSupport implements OnInit {
  tickets: any[] = [];
  selectedTicket: any = null;
  isLoading = true;
  replyMessage: string = '';
  isReplying = false;

  // Stats
  totalTickets = 0;
  openTickets = 0;
  resolvedTickets = 0;
  closedTickets = 0;

  constructor(
    private supportService: SupportService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.isLoading = true;
    this.supportService.getUserTickets().subscribe({
      next: (res) => {
        if (res.success) {
          this.tickets = res.tickets || [];
          this.calculateStats();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tickets', err);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.totalTickets = this.tickets.length;
    this.openTickets = this.tickets.filter(t => t.status === 'Open' || t.status === 'WaitingForUser' || t.status === 'WaitingForAdmin').length;
    this.resolvedTickets = this.tickets.filter(t => t.status === 'Resolved').length;
    this.closedTickets = this.tickets.filter(t => t.status === 'Closed').length;
  }

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
    this.replyMessage = '';
  }

  submitReply() {
    if (!this.replyMessage.trim() || !this.selectedTicket) return;

    this.isReplying = true;
    const payload = {
      message: this.replyMessage,
      attachments: []
    };

    this.supportService.replyToTicketByUser(this.selectedTicket.ticketId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedTicket.replies.push({
            sender: 'User',
            message: this.replyMessage,
            isAdmin: false,
            createdAt: new Date()
          });
          this.replyMessage = '';
        }
        this.isReplying = false;
      },
      error: (err) => {
        console.error('Error submitting reply', err);
        this.isReplying = false;
      }
    });
  }

  resolveTicket() {
    if (!this.selectedTicket) return;
    if (confirm('Are you sure you want to mark this ticket as resolved?')) {
      this.supportService.resolveTicket(this.selectedTicket.ticketId).subscribe({
        next: (res) => {
          if (res.success) {
            this.selectedTicket.status = 'Resolved';
            this.calculateStats();
          }
        },
        error: (err) => console.error('Error resolving ticket', err)
      });
    }
  }

  getCategoryIcon(category: string): string {
    const map: { [key: string]: string } = {
      'General Support': 'bi-headset',
      'Technical Issue': 'bi-wrench-adjustable',
      'Billing & Payments': 'bi-receipt',
      'Contract & Proposals': 'bi-clipboard2-check',
      'Account & Profile': 'bi-person-badge',
      'Project & Delivery': 'bi-box-seam',
      'Disputes & Resolution': 'bi-scales',
      'Feature Request': 'bi-lightbulb'
    };
    return map[category] || 'bi-ticket';
  }

  getCategoryBg(category: string): string {
    const map: { [key: string]: string } = {
      'General Support': 'bg-purple-soft text-purple',
      'Technical Issue': 'bg-success bg-opacity-10 text-success',
      'Billing & Payments': 'bg-primary bg-opacity-10 text-primary',
      'Contract & Proposals': 'bg-warning bg-opacity-10 text-warning-dark',
      'Account & Profile': 'bg-purple-soft text-purple',
      'Project & Delivery': 'bg-info bg-opacity-10 text-info',
      'Disputes & Resolution': 'bg-danger bg-opacity-10 text-danger',
      'Feature Request': 'bg-secondary bg-opacity-10 text-secondary'
    };
    return map[category] || 'bg-primary bg-opacity-10 text-primary';
  }

  getStatusBadgeClass(status: string): string {
    const map: { [key: string]: string } = {
      'Open': 'bg-primary bg-opacity-10 text-primary border-primary',
      'WaitingForAdmin': 'bg-warning bg-opacity-10 text-warning-dark border-warning',
      'WaitingForUser': 'bg-info bg-opacity-10 text-info border-info',
      'Resolved': 'bg-success bg-opacity-10 text-success border-success',
      'Closed': 'bg-secondary bg-opacity-10 text-secondary border-secondary'
    };
    return map[status] ? `${map[status]} border border-opacity-50` : 'bg-primary bg-opacity-10 text-primary';
  }
}
