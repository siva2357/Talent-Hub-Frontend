import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { Attachment, Diary, Phase, Revision } from '../../../../../core/model/contract-diary.model';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';


@Component({
  selector: 'app-contract-diary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,RichTextEditorComponent, ButtonComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './contract-diary.component.html',
  styleUrl: './contract-diary.component.css'
})
export class ContractDiaryComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
diary: Diary | null = null;
contractId = '';
  // Submission state per phase
  phaseNotes: Record<string, string> = {};
  submitting: Record<string, boolean> = {};
  showSubmitModal = false;

selectedDiaryId: string | null = null;

selectedPhase: Phase | null = null;


  BucketKey = BucketKey;
  UploadSection = UploadSection;
  tempUploadUrls: Record<string, string | null> = {};
  uploadedFiles: Record<string, Attachment[]> = {};

getRevisionNumber(
  phase: Phase,
  revision: Revision
): number {

  return phase.revisions.findIndex(
    r => r._id === revision._id
  ) + 1;

}

  openSubmitModal(
  diaryId: string,
  phase: Phase
): void {

  this.selectedDiaryId = diaryId;

  this.selectedPhase = phase;

  this.phaseNotes[phase._id] ??= '';

  this.uploadedFiles[phase._id] ??= [];

  this.showSubmitModal = true;

  document.body.classList.add(
    'modal-open'
  );

  this.cdr.detectChanges();

}


closeSubmitModal(): void {

  this.showSubmitModal = false;

  this.selectedDiaryId = null;

  this.selectedPhase = null;

  document.body.classList.remove(
    'modal-open'
  );

  this.cdr.detectChanges();

}

onFileUploaded(
  phaseId: string,
  fileInfo: {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: string;
  }
): void {
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

  this.contractId =
    this.route.snapshot.queryParamMap.get(
      'contractId'
    ) || '';

  if (this.contractId) {
    this.fetchDiaries();
  }

}




fetchDiaries(callback?: () => void): void {

  if (!this.contractId) {
    this.diary = null;
    return;
  }

  this.isLoading = true;

  this.diaryService
    .getFreelancerDiaries(this.contractId)
    .subscribe({

      next: (res: any) => {

        this.diary = res.diary || null;

        this.isLoading = false;
        this.cdr.detectChanges();
        if (callback) callback();

      },

      error: (err) => {

        console.error(err);

        this.diary = null;

        this.isLoading = false;
        if (callback) callback();

      }

    });

}

  getLatestRevision(
  phase: Phase
): Revision | null {

  if (!phase.revisions?.length) {
    return null;
  }

  return phase.revisions[
    phase.revisions.length - 1
  ];

}

getLatestNote(
  phase: Phase
): string {

  return this.getLatestRevision(
    phase
  )?.freelancerNote || '';

}

getLatestFeedback(
  phase: Phase
): string {

  return this.getLatestRevision(
    phase
  )?.clientFeedback || '';

}


getLatestAttachments(
  phase: Phase
): Attachment[] {

  return this.getLatestRevision(
    phase
  )?.attachments || [];

}

hasRevision(
  phase: Phase
): boolean {

  return !!phase.revisions?.length;

}



  startPhase(diaryId: string, phaseId: string): void {
    this.submitting[phaseId] = true;
    this.diaryService.startPhase(diaryId, phaseId).subscribe({
      next: () => { 
        this.fetchDiaries(() => {
          this.submitting[phaseId] = false;
        }); 
      },
      error: () => { this.submitting[phaseId] = false; }
    });
  }



submitUpdate(
  diaryId: string,
  phaseId: string
): void {

  const note =
    this.phaseNotes[phaseId]?.trim() || '';

  const files =
    this.uploadedFiles[phaseId] || [];

  if (!note && files.length === 0) {
    return;
  }

  this.submitting[phaseId] = true;

  this.diaryService.submitPhaseUpdate(
    diaryId,
    phaseId,
    {
      freelancerNote: note,
      attachments: files
    }
  )
  .subscribe({

    next: () => {

      this.phaseNotes[phaseId] = '';
      this.uploadedFiles[phaseId] = [];
      this.tempUploadUrls[phaseId] = null;

      this.closeSubmitModal();

      this.fetchDiaries(() => {
        this.submitting[phaseId] = false;
      });

    },

    error: (err) => {
      console.error(err);
      this.submitting[phaseId] = false;
    }

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

canStart(
  phase: Phase
): boolean {

  return phase.status === 'pending';

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

  trackByPhase(
  index: number,
  phase: Phase
): string {

  return phase._id;

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
