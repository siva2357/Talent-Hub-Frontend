import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    spent?: number;
  };
  freelancerId: { registrationDetails: { fullName: string } };
  phases: Phase[];
}

@Component({
  selector: 'app-contract-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './contract-progress.component.html',
  styleUrl: './contract-progress.component.css'
})
export class ContractProgressComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);

  diaries: Diary[] = [];
  isLoading = true;
  expandedDiaryId: string | null = null;

  // Review state per phase
  feedbackText: Record<string, string> = {};
  reviewing: Record<string, boolean> = {};

  // Add Phase modal state
  addingPhase: Record<string, boolean> = {};
  newPhase: { name: string; description: string; deadline: string; amount: number | null } = {
    name: '', description: '', deadline: '', amount: null
  };
  showAddPhaseFor: string | null = null;

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  tempUploadUrl: string | null = null;
  newPhaseAttachments: any[] = [];

  onFileUploaded(fileInfo: any): void {
    this.newPhaseAttachments.push(fileInfo);
    this.tempUploadUrl = null;
  }

  removeAttachment(index: number): void {
    this.newPhaseAttachments.splice(index, 1);
  }

  ngOnInit(): void {
    this.fetchDiaries();
  }

  fetchDiaries(): void {
    this.isLoading = true;
    this.diaryService.getClientDiaries().subscribe({
      next: (res: any) => {
        this.diaries = (res.diaries || []).filter((d: any) => d.contractId && (d.contractId.funded || 0) > 0);
        if (this.diaries.length > 0) {
          this.expandedDiaryId = this.diaries[0]._id;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch client diaries:', err);
        this.diaries = [];
        this.isLoading = false;
      }
    });
  }

  toggleDiary(id: string): void {
    this.expandedDiaryId = this.expandedDiaryId === id ? null : id;
  }

  approvePhase(diaryId: string, phaseId: string): void {
    this.reviewing[phaseId] = true;
    this.diaryService.reviewPhase(diaryId, phaseId, 'approve').subscribe({
      next: (res: any) => {
        alert(res.message || 'Phase approved and payment released successfully!');
        this.fetchDiaries();
        this.reviewing[phaseId] = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to approve phase.');
        this.reviewing[phaseId] = false;
      }
    });
  }

  requestChanges(diaryId: string, phaseId: string): void {
    const feedback = this.feedbackText[phaseId] || '';
    this.reviewing[phaseId] = true;
    this.diaryService.reviewPhase(diaryId, phaseId, 'request-changes', feedback).subscribe({
      next: (res: any) => {
        alert(res.message || 'Changes requested successfully.');
        this.feedbackText[phaseId] = '';
        this.fetchDiaries();
        this.reviewing[phaseId] = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to request changes.');
        this.reviewing[phaseId] = false;
      }
    });
  }

  addPhase(diaryId: string): void {
    if (!this.newPhase.name.trim()) return;
    this.addingPhase[diaryId] = true;
    this.diaryService.addPhase(diaryId, {
      name: this.newPhase.name,
      description: this.newPhase.description,
      deadline: this.newPhase.deadline || undefined,
      amount: this.newPhase.amount || 0,
      clientAttachments: this.newPhaseAttachments
    }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Phase added successfully.');
        this.newPhase = { name: '', description: '', deadline: '', amount: null };
        this.newPhaseAttachments = [];
        this.tempUploadUrl = null;
        this.showAddPhaseFor = null;
        this.fetchDiaries();
        this.addingPhase[diaryId] = false;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to add phase.');
        this.addingPhase[diaryId] = false;
      }
    });
  }

  formatDate(date: string | undefined | null): string {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getTotalBudget(diary: Diary): number {
    return diary.contractId.estimatedBudget || 0;
  }

  getRemainingBudget(diary: Diary): number {
    const totalAllocated = diary.phases.reduce((sum, p) => sum + (p.amount || 0), 0);
    return Math.max(0, (diary.contractId.estimatedBudget || 0) - totalAllocated);
  }

  getSpent(diary: Diary): number {
    return diary.contractId.spent || 0;
  }

  getCompletedCount(diary: Diary): number {
    return diary.phases.filter(p => p.status === 'approved').length;
  }

  getFileIcon(fileType: string): string {
    if (!fileType) return 'bi-file-earmark-fill text-secondary';
    if (fileType.includes('pdf'))   return 'bi-file-earmark-pdf-fill text-danger';
    if (fileType.includes('image')) return 'bi-file-earmark-image-fill text-info';
    if (fileType.includes('video')) return 'bi-play-btn-fill text-primary';
    if (fileType.includes('zip'))   return 'bi-file-earmark-zip-fill text-success';
    return 'bi-file-earmark-fill text-secondary';
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'approved':          return 'bg-success';
      case 'in-progress':       return 'bg-primary';
      case 'submitted':         return 'bg-warning';
      case 'changes-requested': return 'bg-danger';
      case 'overdue':           return 'bg-danger';
      default:                  return 'bg-secondary';
    }
  }

  isContractActive(diary: Diary): boolean {
    if (!diary.contractId?.contractStartDate) return true;
    const start = new Date(diary.contractId.contractStartDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() >= start.getTime();
  }
}
