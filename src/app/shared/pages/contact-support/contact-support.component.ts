import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { SupportService } from '../../../core/services/support.service';

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

interface ScreenshotFile {
  name: string;
  size: string;
  url: string;
  file: File;
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
    ButtonComponent
  ],
  templateUrl: './contact-support.component.html',
  styleUrl: './contact-support.component.css'
})
export class ContactSupportComponent implements OnInit {
  private authService = inject(AuthService);
  private supportService = inject(SupportService);

  // ROLE MODE (Embedded Dual-Mode Form)
  userMode: 'freelancer' | 'client' = 'freelancer';

  ngOnInit(): void {
    const role = this.authService.currentUser()?.role?.toLowerCase();
    if (role === 'client') {
      this.userMode = 'client';
    } else {
      this.userMode = 'freelancer';
    }
  }

  getDashboardLink(): string {
    const role = this.authService.currentUser()?.role?.toLowerCase();
    if (role === 'client') {
      return '/user/client-dashboard';
    } else if (role === 'freelancer') {
      return '/user/my-dashboard';
    } else if (role === 'admin') {
      return '/user/admin/dashboard';
    }
    return '/';
  }

  // SELECTED TICKET STATE
  selectedCategoryId: string = '';
  selectedSubcategoryValue: string = '';
  issueDescription: string = '';
  uploadedScreenshots: ScreenshotFile[] = [];

  // MODAL SUCCESS TRIGGER
  isSuccessModalOpen: boolean = false;
  generatedTicketId: string = '';

  // LIST OF SYSTEM MODULE CATEGORIES & RELATED SUBCATEGORIES
  categories: SupportCategory[] = [
    {
      id: 'interview',
      label: 'Interview Phase',
      icon: 'bi-people-fill',
      description: 'Issues with schedule sync, expired meeting rooms, or chat linkages.',
      subcategories: [
        { label: 'Virtual interview room connection issue', value: 'room-connection' },
        { label: 'Schedule synchronization mismatch', value: 'schedule-mismatch' },
        { label: 'Client/Freelancer failed to attend', value: 'no-show' },
        { label: 'Interview chat link expired', value: 'chat-expired' }
      ]
    },
    {
      id: 'application',
      label: 'Application Phase',
      icon: 'bi-file-earmark-post',
      description: 'Trouble posting proposals, bid credit issues, or offer letter visibility.',
      subcategories: [
        { label: 'Proposal editing error', value: 'proposal-error' },
        { label: 'Bid token consumption error', value: 'token-error' },
        { label: 'Offer letter not visible', value: 'offer-hidden' },
        { label: 'Portfolio asset attachment issue', value: 'portfolio-attachment' }
      ]
    },
    {
      id: 'contract',
      label: 'Contract Management',
      icon: 'bi-file-earmark-lock2-fill',
      description: 'Errors during digital signature uploads, scope edits, or timesheets.',
      subcategories: [
        { label: 'Digital signature upload failure', value: 'signature-upload' },
        { label: 'Scope modification approval stuck', value: 'scope-stuck' },
        { label: 'Contract closure request dispute', value: 'closure-dispute' },
        { label: 'Attendance diary tracking mismatch', value: 'diary-mismatch' }
      ]
    },
    {
      id: 'payment',
      label: 'Payment & Escrow',
      icon: 'bi-credit-card-2-front-fill',
      description: 'Invoicing transaction failures, escrow holding delay, or refunds.',
      subcategories: [
        { label: 'Invoice processing failure', value: 'invoice-failure' },
        { label: 'Escrow release dispute', value: 'escrow-dispute' },
        { label: 'Refund transaction delay', value: 'refund-delay' },
        { label: 'Milestone funding error', value: 'milestone-error' }
      ]
    },
    {
      id: 'general',
      label: 'General & Account',
      icon: 'bi-gear-wide-connected',
      description: 'Login difficulties, 2FA authorization lockout, or settings delay.',
      subcategories: [
        { label: 'Account settings update issue', value: 'settings-issue' },
        { label: 'Notification preference delay', value: 'notification-delay' },
        { label: 'Two-factor authentication issue', value: '2fa-issue' },
        { label: 'General visual layout glitch', value: 'layout-glitch' }
      ]
    }
  ];

  // GET ACTIVE CATEGORY DETAILS
  get activeCategory(): SupportCategory | undefined {
    return this.categories.find(c => c.id === this.selectedCategoryId);
  }

  // SELECT CORE CATEGORY METHOD
  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.selectedSubcategoryValue = ''; // Reset subcategory on core phase switch
  }

  // TRIGGER HIDDEN FILE INPUT CLICK
  triggerFileInput(): void {
    const fileInput = document.getElementById('screenshotUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // HANDLE SELECTED SCREENSHOT FILES
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedScreenshots.push({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            url: e.target.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      }
    }
    // Clear value so the same file can be re-selected if removed
    event.target.value = '';
  }

  // REMOVE SCREENSHOT FROM DECK
  removeScreenshot(index: number): void {
    this.uploadedScreenshots.splice(index, 1);
  }

  // FORM SUBMISSION VALIDATION GATES
  get isFormValid(): boolean {
    return !!(
      this.selectedCategoryId &&
      this.selectedSubcategoryValue &&
      this.issueDescription.trim().length > 10
    );
  }

  // DISPATCH TICKET TO ADMIN (PERSISTENT ESCALATION)
  submitTicket(): void {
    if (!this.isFormValid) return;

    // Generate random Ticket ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const currentYear = new Date().getFullYear();
    this.generatedTicketId = `TKT-${currentYear}-${randomNum}`;

    const ticketData = {
      ticketId: this.generatedTicketId,
      category: this.selectedCategoryId,
      subcategory: this.selectedSubcategoryValue,
      description: this.issueDescription,
      attachments: this.uploadedScreenshots.map(s => ({ name: s.name, url: s.url }))
    };

    this.supportService.createTicket(ticketData).subscribe({
      next: (res) => {
        if (res.success) {
          // Open success popup
          this.isSuccessModalOpen = true;
        }
      },
      error: (err) => {
        console.error('Failed to submit ticket:', err);
      }
    });
  }

  // RESET TICKET FORM & CLOSE SUCCESS DIALOG
  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.selectedCategoryId = '';
    this.selectedSubcategoryValue = '';
    this.issueDescription = '';
    this.uploadedScreenshots = [];
    this.generatedTicketId = '';
  }
}
