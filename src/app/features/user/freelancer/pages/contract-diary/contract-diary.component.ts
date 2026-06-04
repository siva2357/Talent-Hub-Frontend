import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';

interface Attachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
}

interface Phase {
  _id: string;
  name: string;
  description: string;
  deadline: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'changes-requested' | 'approved' | 'overdue';
  freelancerNote: string;
  clientFeedback: string;
  attachments: Attachment[];
  clientAttachments?: Attachment[];
  approvedAt: string;
  submittedAt: string;
}

interface Diary {
  _id: string;
  overallStatus: string;
  contractId: {
    contractTitle: string;
    estimatedBudget: number;
    budgetType: string;
    contractStartDate: string;
    contractEndDate: string;
    contractDescription: string;
    techStack: string[];
    spent?: number;
  };
  clientId: { registrationDetails: { fullName: string } };
  phases: Phase[];
}

@Component({
  selector: 'app-contract-diary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './contract-diary.component.html',
  styleUrl: './contract-diary.component.css'
})
export class ContractDiaryComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);

  diaries: Diary[] = [];
  isLoading = true;
  expandedDiaryId: string | null = null;

  // Submission state per phase
  phaseNotes: Record<string, string> = {};
  submitting: Record<string, boolean> = {};

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  tempUploadUrls: Record<string, string | null> = {};
  uploadedFiles: Record<string, any[]> = {};

  onFileUploaded(phaseId: string, fileInfo: any): void {
    if (!this.uploadedFiles[phaseId]) {
      this.uploadedFiles[phaseId] = [];
    }
    this.uploadedFiles[phaseId].push({
      fileName: fileInfo.fileName,
      fileUrl: fileInfo.url,
      fileType: fileInfo.fileType,
      fileSize: fileInfo.fileSize
    });
    this.tempUploadUrls[phaseId] = null;
  }

  removeAttachment(phaseId: string, index: number): void {
    if (this.uploadedFiles[phaseId]) {
      this.uploadedFiles[phaseId].splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.fetchDiaries();
  }

  fetchDiaries(): void {
    this.isLoading = true;
    this.diaryService.getFreelancerDiaries().subscribe({
      next: (res: any) => {
        this.diaries = res.diaries || [];
        if (this.diaries.length > 0) {
          this.expandedDiaryId = this.diaries[0]._id;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch diaries:', err);
        this.diaries = [];
        this.isLoading = false;
      }
    });
  }

  toggleDiary(id: string): void {
    this.expandedDiaryId = this.expandedDiaryId === id ? null : id;
  }

  startPhase(diaryId: string, phaseId: string): void {
    this.submitting[phaseId] = true;
    this.diaryService.startPhase(diaryId, phaseId).subscribe({
      next: () => { this.fetchDiaries(); this.submitting[phaseId] = false; },
      error: () => { this.submitting[phaseId] = false; }
    });
  }

  submitUpdate(diaryId: string, phaseId: string): void {
    const note = this.phaseNotes[phaseId] || '';
    this.submitting[phaseId] = true;
    this.diaryService.submitPhaseUpdate(diaryId, phaseId, {
      freelancerNote: note,
      attachments: this.uploadedFiles[phaseId] || []
    }).subscribe({
      next: () => {
        this.phaseNotes[phaseId] = '';
        if (this.uploadedFiles[phaseId]) {
          this.uploadedFiles[phaseId] = [];
        }
        this.tempUploadUrls[phaseId] = null;
        this.fetchDiaries();
        this.submitting[phaseId] = false;
      },
      error: () => { this.submitting[phaseId] = false; }
    });
  }

  getFileIcon(fileType: string): string {
    if (!fileType) return 'bi-file-earmark-fill';
    if (fileType.includes('pdf'))   return 'bi-file-earmark-pdf-fill text-danger';
    if (fileType.includes('image')) return 'bi-file-earmark-image-fill text-info';
    if (fileType.includes('video')) return 'bi-play-btn-fill text-primary';
    if (fileType.includes('zip'))   return 'bi-file-earmark-zip-fill text-success';
    return 'bi-file-earmark-fill text-secondary';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved':          return 'bi-check-lg';
      case 'changes-requested': return 'bi-exclamation-triangle-fill';
      case 'submitted':         return 'bi-send-fill';
      case 'in-progress':       return 'bi-hourglass-split';
      case 'overdue':           return 'bi-clock-history';
      default:                  return 'bi-circle';
    }
  }

  canStart(phase: Phase): boolean {
    return phase.status === 'pending' || phase.status === 'changes-requested';
  }

  canSubmit(phase: Phase): boolean {
    return phase.status === 'in-progress' || phase.status === 'changes-requested';
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getTotalBudget(diary: Diary): number {
    return diary.contractId.estimatedBudget || 0;
  }
}
