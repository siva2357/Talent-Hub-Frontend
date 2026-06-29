import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';

import { AuthService } from '../../../core/services/auth.service';
import { SupportService } from '../../../core/services/support.service';

import { BucketKey, UploadSection } from '../../../core/enums/upload.enum';

import { CreateSupportTicketDto } from '../../../core/DTOs/support-ticket.dto';
import { SupportAttachment, SupportRequest, UploadedFileEvent, SupportCategory } from '../../../core/model/support-request.model';
import { FilePreviewComponent } from "../../components/file-preview/file-preview.component";
import { DateTimeHelper } from '../../../core/helpers/date-time.helper';


@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
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
  private fb = inject(FormBuilder);
  private supportService = inject(SupportService);

  bucketKey: BucketKey = BucketKey.FreelancerData;
  readonly uploadSection = UploadSection.SupportRequest;

  supportForm: FormGroup = this.fb.group({
    categoryId: ['', Validators.required],
    subcategoryValue: ['', Validators.required],
    issueDescription: ['', [Validators.required, Validators.minLength(10)]]
  });

  replyForm: FormGroup = this.fb.group({
    replyMessage: ['', Validators.required]
  });

  uploadedAttachments = signal<SupportAttachment[]>([]);
  generatedTicketId = signal('');
  uploadResetTrigger = signal(0);
  isSuccessModalOpen = signal(false);
  isSubmitting = signal(false);

  tickets = signal<SupportRequest[]>([]);
  activeTab = signal<'create' | 'tickets'>('create');
  selectedTicket = signal<SupportRequest | null>(null);

  selectTicket(ticket: SupportRequest): void {
    this.selectedTicket.set(ticket);
    this.replyForm.reset();
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
  const currentTicketId = this.selectedTicket()?.ticketId;

  this.supportService.getMyTickets().subscribe({
    next: (res: any) => {
      this.tickets.set(res.tickets);

      if (!this.tickets().length) {
        this.selectedTicket.set(null);
        return;
      }

      if (currentTicketId) {
        const updatedTicket = this.tickets().find(
          ticket => ticket.ticketId === currentTicketId
        );

        if (updatedTicket) {
          this.selectedTicket.set(updatedTicket);
          return;
        }
      }

      this.selectedTicket.set(this.tickets()[0]);
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

  activeCategory = computed(() => {
    const catId = this.supportForm.get('categoryId')?.value;
    return this.categories.find((category) => category.id === catId);
  });

  selectCategory(categoryId: string): void {
    this.supportForm.patchValue({
      categoryId: categoryId,
      subcategoryValue: ''
    });
  }

  onAttachmentUploaded(event: UploadedFileEvent): void {
    this.uploadedAttachments.update(attachments => [...attachments, {
      name: event.fileName,
      url: event.url,
    }]);
  }

  submitTicket(): void {
    if (this.supportForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.generatedTicketId.set(this.generateTicketId());
    const formValue = this.supportForm.getRawValue();

    const ticketData: CreateSupportTicketDto = {
      ticketId: this.generatedTicketId(),
      category: formValue.categoryId,
      subcategory: formValue.subcategoryValue,
      description: formValue.issueDescription,
      attachments: this.uploadedAttachments(),
    };

    this.supportService.createTicket(ticketData).subscribe({
      next: (response: any) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.isSuccessModalOpen.set(true);
        }
      },
      error: (error: any) => {
        this.isSubmitting.set(false);
        console.error('Failed to submit support ticket', error);
      },
    });
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen.set(false);
    this.resetForm();
  }

  private generateTicketId(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const currentYear = new Date().getFullYear();
    return `TKT-${currentYear}-${randomNumber}`;
  }

  private resetForm(): void {
    this.supportForm.reset();
    this.uploadedAttachments.set([]);
    this.generatedTicketId.set('');
    this.uploadResetTrigger.update(val => val + 1);
  }


sendReply(): void {
  const message = this.replyForm.get('replyMessage')?.value?.trim();
  const ticket = this.selectedTicket();

  if (!ticket || !message) {
    return;
  }

  console.log('Ticket ID:', ticket.ticketId);
  console.log('Payload:', { message });

  this.supportService.replyToTicket(ticket.ticketId, { message }).subscribe({
    next: (response: any) => {
      console.log('Reply Success:', response);
      this.replyForm.reset();
      this.loadMyTickets();
    },
    error: (error: any) => {
      console.error('Reply Error:', error);
    }
  });
}

confirmResolution(): void {
  const ticket = this.selectedTicket();
  if (!ticket) {
    return;
  }

  this.supportService.resolveTicket(ticket.ticketId).subscribe({
    next: () => {
      this.loadMyTickets();
    },
    error: (error: any) => {
      console.error(error);
    }
  });
}

reopenTicket(): void {
  const ticket = this.selectedTicket();
  if (!ticket) {
    return;
  }

  this.replyForm.patchValue({
    replyMessage: 'Issue still persists. Please continue investigation.'
  });

  const textarea = document.querySelector('.reply-box textarea') as HTMLTextAreaElement;
  textarea?.focus();
}

}
