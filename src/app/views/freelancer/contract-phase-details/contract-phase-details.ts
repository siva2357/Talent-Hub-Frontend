import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';

import { FormsModule } from '@angular/forms';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { StatCardData } from '../../../core/models/ui.model';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';

@Component({
  selector: 'app-contract-phase-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Button, Badge, InputField, FilePreview, FileUpload, StatCard],
  templateUrl: './contract-phase-details.html',
  styleUrl: './contract-phase-details.css'
})
export class ContractPhaseDetails implements OnInit {
  phaseId: string = '';
  contractId: string = '';
  diaryId: string = '';
  diary: any = null;
  phase: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  // Freelancer specific properties
  freelancerNote: string = '';
  submissionAttachments: any[] = [];
  isSubmitting: boolean = false;
  UploadBucket = UploadBucket;
  UploadSection = UploadSection;

  constructor(
    private route: ActivatedRoute,
    private diaryService: ContractDiaryService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.phaseId = params.get('id') || '';
      this.route.queryParamMap.subscribe(queryParams => {
        this.contractId = queryParams.get('contractId') || '';
        if (this.phaseId && this.contractId) {
          this.loadPhaseDetails();
        }
      });
    });
  }

  loadPhaseDetails(): void {
    this.isLoading = true;
    this.diaryService.getFreelancerDiary(this.contractId).subscribe({
      next: (res) => {
        if (res.success) {
          this.diary = res.diary;
          this.diaryId = this.diary._id;
          this.phase = this.diary.phases.find((p: any) => p._id === this.phaseId);
          if (!this.phase) {
            this.error = 'Phase not found.';
          }
        } else {
          this.error = res.message || 'Failed to load details.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Failed to load details.';
        this.isLoading = false;
      }
    });
  }

  get latestRevision() {
    if (!this.phase || !this.phase.revisions || this.phase.revisions.length === 0) return null;
    return this.phase.revisions[this.phase.revisions.length - 1];
  }

  get amountReleased() {
    return this.phase?.status === 'approved' ? (this.phase.amount || 0) : 0;
  }

  get remainingAmount() {
    return (this.phase?.amount || 0) - this.amountReleased;
  }

  get phaseStats(): StatCardData[] {
    const budget = this.phase?.amount || 0;
    const released = this.amountReleased;
    const remaining = this.remainingAmount;
    const dueDateStr = this.phase?.deadline ? new Date(this.phase.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date';

    return [
      { title: 'PHASE BUDGET', value: `₹${budget.toLocaleString('en-IN')}`, icon: 'bi bi-wallet2' },
      { title: 'AMOUNT RELEASED', value: `₹${released.toLocaleString('en-IN')}`, icon: 'bi bi-cash-stack' },
      { title: 'REMAINING AMOUNT', value: `₹${remaining.toLocaleString('en-IN')}`, icon: 'bi bi-house-door' },
      { title: 'DUE DATE', value: dueDateStr, icon: 'bi bi-calendar-event' }
    ];
  }

  onFileUpload(url: string) {
    this.submissionAttachments.push({ fileUrl: url, fileName: url.split('/').pop() || 'attachment' });
  }

  removeAttachment(index: number) {
    this.submissionAttachments.splice(index, 1);
  }

  getFileName(file: any) {
    return file.fileName || file.name || file.fileUrl?.split('/').pop() || file.url?.split('/').pop() || 'attachment';
  }

  downloadFile(file: any) {
    const url = file.fileUrl || file.url;
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = this.getFileName(file);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  submitPhaseWork(): void {
    if (!this.diaryId || !this.phase?._id) return;
    this.isSubmitting = true;
    const payload = {
      freelancerNote: this.freelancerNote,
      attachments: this.submissionAttachments
    };

    this.diaryService.submitPhase(this.diaryId, this.phase._id, payload).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isSubmitting = false;
          if (res.success) {
            this.phase = res.phase;
            this.freelancerNote = '';
            this.submissionAttachments = []; // Clear UI state
          }
        }, 500); // Add a small delay for smoother UX
      },
      error: (err) => {
        setTimeout(() => {
          this.isSubmitting = false;
          console.error('Error submitting phase:', err);
        }, 500);
      }
    });
  }
}

