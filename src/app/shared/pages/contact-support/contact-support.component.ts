import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';

import { AuthService } from '../../../core/services/auth.service';
import { SupportService } from '../../../core/services/support.service';

import { BucketKey, UploadSection } from '../../../core/enums/upload.enum';

import { CreateSupportTicketDto } from '../../../core/DTOs/support-ticket.dto';
import { SupportAttachment, SupportRequest, UploadedFileEvent } from '../../../core/model/support-request.model';
import { FilePreviewComponent } from "../../components/file-preview/file-preview.component";
import { DateTimeHelper } from '../../../core/helpers/date-time.helper';

interface Subcategory {
  label: string;
  value: string;
}

interface SupportCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
}

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    FileUploadComponent,
    FilePreviewComponent
],
  templateUrl: './contact-support.component.html',
  styleUrl: './contact-support.component.css',
})
export class ContactSupportComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private authService = inject(AuthService);
  private supportService = inject(SupportService);

  bucketKey: BucketKey = BucketKey.FreelancerData;

  readonly uploadSection = UploadSection.SupportRequest;
replyMessage = '';
  selectedCategoryId = '';
  selectedSubcategoryValue = '';
  issueDescription = '';

  uploadedAttachments: SupportAttachment[] = [];

  generatedTicketId = '';
uploadResetTrigger = 0;
  isSuccessModalOpen = false;
  isSubmitting = false;

  tickets: SupportRequest[] = [];
activeTab: 'create' | 'tickets' = 'create';

selectedTicket: SupportRequest | null = null;


selectTicket(ticket: SupportRequest): void {

  this.selectedTicket = ticket;

  this.replyMessage = '';

}
  
ngOnInit(): void {
  const role = this.authService.currentUser()?.role?.toLowerCase();

  if (role === 'client') {
    this.bucketKey = BucketKey.ClientData;
  } else if (role === 'freelancer') {
    this.bucketKey = BucketKey.FreelancerData;
  } else {
    throw new Error('Unsupported role for support ticket uploads');
  }
  this.loadMyTickets()
}



loadMyTickets(): void {

  const currentTicketId =
    this.selectedTicket?.ticketId;

  this.supportService.getMyTickets().subscribe({

    next: (res) => {

      this.tickets = res.tickets;

      if (!this.tickets.length) {

        this.selectedTicket = null;

        return;
      }

      if (currentTicketId) {

        const updatedTicket =
          this.tickets.find(
            ticket =>
              ticket.ticketId ===
              currentTicketId
          );

        if (updatedTicket) {

          this.selectedTicket =
            updatedTicket;

          return;
        }
      }

      this.selectedTicket =
        this.tickets[0];
    }

  });

}


getStatusClass(status: string): string {

  switch (status) {

    case 'Open':
      return 'status-open';

    case 'WaitingForAdmin':
      return 'status-admin';

    case 'WaitingForUser':
      return 'status-user';

    case 'Resolved':
      return 'status-resolved';

    case 'Closed':
      return 'status-closed';

    default:
      return '';
  }
}



  getDashboardLink(): string {
    const role = this.authService.currentUser()?.role?.toLowerCase();

    switch (role) {
      case 'client':
        return '/user/client-dashboard';

      case 'freelancer':
        return '/user/my-dashboard';


      default:
        return '/';
    }
  }

  categories: SupportCategory[] = [
    {
      id: 'interview',
      label: 'Interview Phase',
      icon: 'bi-people-fill',
      description: 'Issues with schedule sync, expired meeting rooms, or chat linkages.',
      subcategories: [
        {
          label: 'Virtual interview room connection issue',
          value: 'room-connection',
        },
        {
          label: 'Schedule synchronization mismatch',
          value: 'schedule-mismatch',
        },
        {
          label: 'Client/Freelancer failed to attend',
          value: 'no-show',
        },
        {
          label: 'Interview chat link expired',
          value: 'chat-expired',
        },
      ],
    },
    {
      id: 'application',
      label: 'Application Phase',
      icon: 'bi-file-earmark-post',
      description: 'Trouble posting proposals, bid credit issues, or offer letter visibility.',
      subcategories: [
        {
          label: 'Proposal editing error',
          value: 'proposal-error',
        },
        {
          label: 'Bid token consumption error',
          value: 'token-error',
        },
        {
          label: 'Offer letter not visible',
          value: 'offer-hidden',
        },
        {
          label: 'Portfolio asset attachment issue',
          value: 'portfolio-attachment',
        },
      ],
    },
    {
      id: 'contract',
      label: 'Contract Management',
      icon: 'bi-file-earmark-lock2-fill',
      description: 'Errors during digital signature uploads or scope edits.',
      subcategories: [
        {
          label: 'Digital signature upload failure',
          value: 'signature-upload',
        },
        {
          label: 'Scope modification approval stuck',
          value: 'scope-stuck',
        },
        {
          label: 'Contract closure request dispute',
          value: 'closure-dispute',
        },
        {
          label: 'Contract diary tracking mismatch',
          value: 'diary-mismatch',
        },
      ],
    },
    {
      id: 'payment',
      label: 'Payment & Escrow',
      icon: 'bi-credit-card-2-front-fill',
      description: 'Invoicing transaction failures, escrow holding delay, or refunds.',
      subcategories: [
        {
          label: 'Invoice processing failure',
          value: 'invoice-failure',
        },
        {
          label: 'Escrow release dispute',
          value: 'escrow-dispute',
        },
        {
          label: 'Refund transaction delay',
          value: 'refund-delay',
        },
        {
          label: 'Milestone funding error',
          value: 'milestone-error',
        },
      ],
    },
    {
      id: 'general',
      label: 'General & Account',
      icon: 'bi-gear-wide-connected',
      description: 'Login difficulties, 2FA authorization lockout, or settings delay.',
      subcategories: [
        {
          label: 'Account settings update issue',
          value: 'settings-issue',
        },
        {
          label: 'Notification preference delay',
          value: 'notification-delay',
        },
        {
          label: 'Two-factor authentication issue',
          value: '2fa-issue',
        },
        {
          label: 'General visual layout glitch',
          value: 'layout-glitch',
        },
      ],
    },
  ];

  get activeCategory(): SupportCategory | undefined {
    return this.categories.find((category) => category.id === this.selectedCategoryId);
  }

  get isFormValid(): boolean {
    return !!(
      this.selectedCategoryId &&
      this.selectedSubcategoryValue &&
      this.issueDescription.trim().length > 10
    );
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.selectedSubcategoryValue = '';
  }

  onAttachmentUploaded(event: UploadedFileEvent): void {
    this.uploadedAttachments.push({
      name: event.fileName,
      url: event.url,
    });
  }

  submitTicket(): void {
    if (!this.isFormValid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.generatedTicketId = this.generateTicketId();

    const ticketData: CreateSupportTicketDto = {
      ticketId: this.generatedTicketId,
      category: this.selectedCategoryId,
      subcategory: this.selectedSubcategoryValue,
      description: this.issueDescription,
      attachments: this.uploadedAttachments,
    };

    this.supportService.createTicket(ticketData).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.success) {
          this.isSuccessModalOpen = true;
        }
      },

      error: (error) => {
        this.isSubmitting = false;

        console.error('Failed to submit support ticket', error);
      },
    });
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.resetForm();
  }

  private generateTicketId(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const currentYear = new Date().getFullYear();

    return `TKT-${currentYear}-${randomNumber}`;
  }

private resetForm(): void {
  this.selectedCategoryId = '';
  this.selectedSubcategoryValue = '';
  this.issueDescription = '';
  this.uploadedAttachments = [];
  this.generatedTicketId = '';

  this.uploadResetTrigger++;
}


sendReply(): void {

  if (
    !this.selectedTicket ||
    !this.replyMessage.trim()
  ) {
    return;
  }

  console.log('Ticket ID:', this.selectedTicket.ticketId);

  console.log('Payload:', {
    message: this.replyMessage.trim()
  });

  this.supportService.replyToTicket(
    this.selectedTicket.ticketId,
    {
      message: this.replyMessage.trim()
    }
  ).subscribe({

    next: (response) => {

      console.log('Reply Success:', response);

      this.replyMessage = '';

      this.loadMyTickets();

    },

    error: (error) => {

      console.error('Reply Error:', error);

    }

  });

}


confirmResolution(): void {

  if (!this.selectedTicket) {
    return;
  }

  this.supportService
    .resolveTicket(
      this.selectedTicket.ticketId
    )
    .subscribe({

      next: () => {

        this.loadMyTickets();

      },

      error: (error) => {

        console.error(error);

      }

    });

}

reopenTicket(): void {

  if (!this.selectedTicket) {
    return;
  }

  this.replyMessage =
    'Issue still persists. Please continue investigation.';

  const textarea =
    document.querySelector(
      '.reply-box textarea'
    ) as HTMLTextAreaElement;

  textarea?.focus();

}

}
