import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportService } from '../../../core/services/support.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FileUpload, FilePreview, Button, InputField],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css'
})
export class CreateTicket implements OnInit {
  ticketForm!: FormGroup;
  attachments: {name: string, url: string}[] = [];
  isSubmitting = false;

  uploadBucket = UploadBucket;
  uploadSection = UploadSection;

  categoryOptions = [
    { label: 'General Support', value: 'General Support' },
    { label: 'Technical Issue', value: 'Technical Issue' },
    { label: 'Billing & Payments', value: 'Billing & Payments' },
    { label: 'Contract & Proposals', value: 'Contract & Proposals' },
    { label: 'Account & Profile', value: 'Account & Profile' },
    { label: 'Project & Delivery', value: 'Project & Delivery' },
    { label: 'Disputes & Resolution', value: 'Disputes & Resolution' },
    { label: 'Feature Request', value: 'Feature Request' }
  ];

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService,
    private fileService: FileService,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ticketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.maxLength(150)]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  setCategory(category: string) {
    this.ticketForm.patchValue({ category });
  }

  onUploadComplete(url: string) {
    if (this.attachments.length < 5) { // max 5 files
      const filename = url.split('/').pop() || 'attachment';
      this.attachments.push({ name: filename, url: url });
    }
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  async onSubmit() {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    try {
      const formValue = this.ticketForm.value;
      const payload = {
        subject: formValue.subject,
        category: formValue.category,
        description: formValue.description,
        attachments: this.attachments
      };

      await this.supportService.createTicket(payload).toPromise();
      this.router.navigate(['/contact-support']);
      
    } catch (error) {
      console.error('Error creating ticket', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}

