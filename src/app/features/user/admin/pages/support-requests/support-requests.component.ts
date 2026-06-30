import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SupportService } from '../../../../../core/services/support.service';
import { SupportRequest } from '../../../../../core/model/support-request.model';
import { FilePreviewComponent } from "../../../../../shared/components/file-preview/file-preview.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { BadgeComponent } from "../../../../../shared/components/badge/badge.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-support-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilePreviewComponent,
    InputComponent,
    BadgeComponent,
    ButtonComponent
  ],
  templateUrl: './support-requests.component.html',
  styleUrl: './support-requests.component.css'
})
export class SupportRequestsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  private supportService = inject(SupportService);
  private toastr = inject(ToastrService);

  requests = signal<SupportRequest[]>([]);
  
  searchTerm = signal('');

  statusFilter = signal<
    | 'All'
    | 'Open'
    | 'WaitingForAdmin'
    | 'WaitingForUser'
    | 'Resolved'
    | 'Closed'
  >('All');

  userTypeFilter = signal<
    | 'All'
    | 'Client'
    | 'Freelancer'
  >('All');

  statusOptions = [
    { label: 'All Status', value: 'All' },
    { label: 'Open', value: 'Open' },
    { label: 'Waiting For Admin', value: 'WaitingForAdmin' },
    { label: 'Waiting For User', value: 'WaitingForUser' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' }
  ];

  userTypeOptions = [
    { label: 'All Users', value: 'All' },
    { label: 'Client', value: 'Client' },
    { label: 'Freelancer', value: 'Freelancer' }
  ];

  isLoading = signal(true);
  selectedRequest = signal<SupportRequest | null>(null);
  replyText = signal('');

  filteredRequests = computed(() => {
    const search = this.searchTerm().toLowerCase();
    
    return this.requests().filter(ticket => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(search) ||
        ticket.userName.toLowerCase().includes(search) ||
        ticket.userEmail.toLowerCase().includes(search) ||
        ticket.message.toLowerCase().includes(search);

      const status = this.statusFilter();
      const matchesStatus =
        status === 'All' ||
        ticket.status === status;

      const userType = this.userTypeFilter();
      const matchesUserType =
        userType === 'All' ||
        ticket.userType === userType;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUserType
      );
    });
  });

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {

    this.isLoading.set(true);

    this.supportService.getAllTickets().subscribe({
      next: (tickets) => {

        this.requests.set(tickets);
        this.isLoading.set(false);
        this.autoSelectTicket();
      },

      error: (error) => {

        console.error(error);

        this.isLoading.set(false);

        this.toastr.error(
          'Failed to load support tickets',
          'Support Desk'
        );
      }
    });
  }

  onFilterStatus(status: 'All' | 'Open' | 'WaitingForAdmin' | 'WaitingForUser' | 'Resolved' | 'Closed'): void {
    this.statusFilter.set(status);
    this.autoSelectTicket();
  }

  onFilterUserType(userType: 'All' | 'Client' | 'Freelancer'): void {
    this.userTypeFilter.set(userType);
    this.autoSelectTicket();
  }

  autoSelectTicket(): void {
    const filtered = this.filteredRequests();
    if (!filtered.length) {
      this.selectedRequest.set(null);
      return;
    }

    const selected = this.selectedRequest();
    if (!selected || !filtered.some(ticket => ticket.id === selected.id)) {
      this.selectedRequest.set(filtered[0]);
      return;
    }

    const updatedTicket = filtered.find(ticket => ticket.id === selected.id);
    if (updatedTicket) {
      this.selectedRequest.set(updatedTicket);
    }
  }

  selectRequest(
    request: SupportRequest
  ): void {

    this.selectedRequest.set(request);
    this.replyText.set('');
  }

  submitReply(): void {

    if (
      !this.selectedRequest() ||
      !this.replyText().trim()
    ) {
      return;
    }

    this.supportService.adminReplyToTicket(
      this.selectedRequest()!.id,
      {
        message: this.replyText().trim()
      }
    ).subscribe({

      next: (response) => {

        this.replyText.set('');

        this.toastr.success(
          response.message,
          'Support Desk'
        );

        this.loadRequests();
      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          'Failed to send reply',
          'Support Desk'
        );
      }
    });
  }

  updateStatus(
    status:
      | 'Open'
      | 'WaitingForAdmin'
      | 'WaitingForUser'
      | 'Resolved'
      | 'Closed'
  ): void {

    if (!this.selectedRequest()) {
      return;
    }

    this.supportService.updateTicketStatus(
      this.selectedRequest()!.id,
      {
        status
      }
    ).subscribe({

      next: (response) => {

        this.toastr.success(
          response.message,
          'Support Desk'
        );

        this.loadRequests();
      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          'Failed to update status',
          'Support Desk'
        );
      }
    });
  }

  closeTicket(): void {

    if (!this.selectedRequest()) {
      return;
    }

    this.supportService.closeTicket(
      this.selectedRequest()!.id
    ).subscribe({

      next: (response) => {

        this.toastr.success(
          response.message,
          'Support Desk'
        );

        this.loadRequests();
      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          'Failed to close ticket',
          'Support Desk'
        );
      }
    });
  }
}