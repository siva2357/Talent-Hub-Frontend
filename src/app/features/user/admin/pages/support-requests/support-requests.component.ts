import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SupportService } from '../../../../../core/services/support.service';
import { SupportRequest } from '../../../../../core/model/support-request.model';
import { FilePreviewComponent } from "../../../../../shared/components/file-preview/file-preview.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { BadgeComponent } from "../../../../../shared/components/badge/badge.component";
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-support-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilePreviewComponent,
    InputComponent,
    BadgeComponent
  ],
  templateUrl: './support-requests.component.html',
  styleUrl: './support-requests.component.css'
})
export class SupportRequestsComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;


  private supportService = inject(SupportService);
  private toastr = inject(ToastrService);

  requests: SupportRequest[] = [];
  filteredRequests: SupportRequest[] = [];

  searchTerm = '';

  statusFilter:
    | 'All'
    | 'Open'
    | 'WaitingForAdmin'
    | 'WaitingForUser'
    | 'Resolved'
    | 'Closed' = 'All';

  userTypeFilter:
    | 'All'
    | 'Client'
    | 'Freelancer' = 'All';

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

  isLoading = true;


  selectedRequest: SupportRequest | null = null;

  replyText = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {

    this.isLoading = true;

    this.supportService.getAllTickets().subscribe({
      next: (tickets) => {

        this.requests = tickets;

        this.applyFilters();

        this.isLoading = false;
      },

      error: (error) => {

        console.error(error);

        this.isLoading = false;

        this.toastr.error(
          'Failed to load support tickets',
          'Support Desk'
        );
      }
    });
  }

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm = input.value;

    this.applyFilters();
  }

  onFilterStatus(
    status:
      | 'All'
      | 'Open'
      | 'WaitingForAdmin'
      | 'WaitingForUser'
      | 'Resolved'
      | 'Closed'
  ): void {

    this.statusFilter = status;

    this.applyFilters();
  }

  onFilterUserType(
    userType:
      | 'All'
      | 'Client'
      | 'Freelancer'
  ): void {

    this.userTypeFilter = userType;

    this.applyFilters();
  }

  applyFilters(): void {

    const search =
      this.searchTerm.toLowerCase();

    this.filteredRequests =
      this.requests.filter(ticket => {

        const matchesSearch =
          ticket.id.toLowerCase().includes(search) ||
          ticket.userName.toLowerCase().includes(search) ||
          ticket.userEmail.toLowerCase().includes(search) ||
          ticket.message.toLowerCase().includes(search);

        const matchesStatus =
          this.statusFilter === 'All' ||
          ticket.status === this.statusFilter;

        const matchesUserType =
          this.userTypeFilter === 'All' ||
          ticket.userType === this.userTypeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesUserType
        );
      });

    if (!this.filteredRequests.length) {

      this.selectedRequest = null;

      return;
    }

    if (
      !this.selectedRequest ||
      !this.filteredRequests.some(
        ticket =>
          ticket.id ===
          this.selectedRequest?.id
      )
    ) {

      this.selectedRequest =
        this.filteredRequests[0];

      return;
    }

    const updatedTicket =
      this.filteredRequests.find(
        ticket =>
          ticket.id ===
          this.selectedRequest?.id
      );

    if (updatedTicket) {

      this.selectedRequest =
        updatedTicket;
    }
  }

  selectRequest(
    request: SupportRequest
  ): void {

    this.selectedRequest = request;

    this.replyText = '';
  }

  submitReply(): void {

    if (
      !this.selectedRequest ||
      !this.replyText.trim()
    ) {
      return;
    }

    this.supportService.adminReplyToTicket(
      this.selectedRequest.id,
      {
        message: this.replyText.trim()
      }
    ).subscribe({

      next: (response) => {

        this.replyText = '';

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

    if (!this.selectedRequest) {
      return;
    }

    this.supportService.updateTicketStatus(
      this.selectedRequest.id,
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

    if (!this.selectedRequest) {
      return;
    }

    this.supportService.closeTicket(
      this.selectedRequest.id
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