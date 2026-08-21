import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupportService } from '../../../core/services/support.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css'
})
export class CreateTicket implements OnInit {
  ticketForm!: FormGroup;
  attachments: File[] = [];
  isSubmitting = false;

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

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: any) {
    event.preventDefault();
    const files: FileList = event.dataTransfer.files;
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      if (this.attachments.length < 5) { // max 5 files
        this.attachments.push(files[i]);
      }
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
      const uploadedAttachments: {name: string, url: string}[] = [];
      const userRole = this.tokenService.getRole();
      // Determine correct bucket based on user role
      const bucket = userRole === 'client' ? UploadBucket.ClientData : UploadBucket.FreelancerData;

      // Upload files
      for (const file of this.attachments) {
        const res = await this.fileService.uploadFile(file, bucket, UploadSection.SupportRequest).toPromise();
        if (res && res.success) {
          uploadedAttachments.push({ name: file.name, url: res.url });
        }
      }

      const formValue = this.ticketForm.value;
      const payload = {
        subject: formValue.subject,
        category: formValue.category,
        description: formValue.description,
        attachments: uploadedAttachments
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

