import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService, SupportRequest } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-support-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-requests.component.html',
  styleUrl: './support-requests.component.css'
})
export class SupportRequestsComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);

  requests: SupportRequest[] = [];
  filteredRequests: SupportRequest[] = [];
  
  searchTerm = '';
  statusFilter: 'All' | 'Pending' | 'Resolved' | 'Unresolved' = 'All';
  userTypeFilter: 'All' | 'Client' | 'Freelancer' = 'All';

  selectedRequest: SupportRequest | null = null;
  replyText = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.adminService.getSupportRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.applyFilters();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onFilterStatus(status: 'All' | 'Pending' | 'Resolved' | 'Unresolved'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onFilterUserType(userType: 'All' | 'Client' | 'Freelancer'): void {
    this.userTypeFilter = userType;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRequests = this.requests.filter(r => {
      const matchesSearch = r.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            r.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            r.message.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            r.id.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'All' || r.status === this.statusFilter;
      const matchesUserType = this.userTypeFilter === 'All' || r.userType === this.userTypeFilter;

      return matchesSearch && matchesStatus && matchesUserType;
    });

    // Auto-select first request if active list has items, otherwise clear selection
    if (this.filteredRequests.length > 0) {
      if (!this.selectedRequest || !this.filteredRequests.some(r => r.id === this.selectedRequest!.id)) {
        this.selectedRequest = this.filteredRequests[0];
      } else {
        const updatedSelected = this.filteredRequests.find(r => r.id === this.selectedRequest!.id);
        if (updatedSelected) {
          this.selectedRequest = updatedSelected;
        }
      }
    } else {
      this.selectedRequest = null;
    }
  }

  changeRequestStatus(id: string, status: 'Pending' | 'Resolved' | 'Unresolved'): void {
    if (status === 'Resolved') {
      this.toastr.warning('Tickets can only be resolved by direct user feedback.', 'Support Desk');
      return;
    }
    this.adminService.updateSupportRequestStatus(id, status);
    this.toastr.info(`Ticket status marked as ${status}`, 'Support Desk');
    this.loadRequests();
  }

  selectRequest(request: SupportRequest): void {
    this.selectedRequest = request;
    this.replyText = '';
  }

  submitReply(): void {
    if (!this.selectedRequest || !this.replyText.trim()) return;

    this.adminService.replyToSupportRequest(this.selectedRequest.id, this.replyText.trim());
    this.toastr.success('Reply sent successfully. Ticket marked as Pending.', 'Support Desk');
    this.replyText = '';
    this.loadRequests();
  }

  simulateUserFeedback(feedbackText: string): void {
    if (!this.selectedRequest) return;
    this.adminService.submitUserFeedbackAndResolve(this.selectedRequest.id, feedbackText);
    this.toastr.success('Simulated user feedback submitted. Ticket resolved.', 'Support Desk');
    this.loadRequests();
  }
}
