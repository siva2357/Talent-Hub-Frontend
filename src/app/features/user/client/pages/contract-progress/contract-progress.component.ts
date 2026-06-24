import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { AddPhaseFormDto } from '../../../../../core/DTOs/contract-diary.dto';
import { Attachment, Diary } from '../../../../../core/model/contract-diary.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';


@Component({
  selector: 'app-contract-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent,InputComponent,RichTextEditorComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './contract-progress.component.html',
  styleUrl: './contract-progress.component.css'
})
export class ContractProgressComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  contractId: string = '';


newPhase!: AddPhaseFormDto
  isLoading = true;
   userRole: 'freelancer' | 'client' = 'freelancer';
  feedbackText: Record<string, string> = {};
  reviewing: Record<string, boolean> = {};
  addingPhase: Record<string, boolean> = {};
  showAddPhaseModal = false;
selectedDiaryId: string | null = null;
  bucketKey: BucketKey = BucketKey.ClientData;
  readonly uploadSection = UploadSection.ContractFiles;
  tempUploadUrl: string | null = null;

  diary: Diary | null = null;

contract: any = null;


getLatestRevision(phase: any) {
  return phase.revisions?.length
    ? phase.revisions[phase.revisions.length - 1]
    : null;
}

getLatestNote(phase: any) {
  return this.getLatestRevision(phase)?.freelancerNote || '';
}

getLatestAttachments(phase: any) {
  return this.getLatestRevision(phase)?.attachments || [];
}

getLatestSubmissionDate(phase: any) {
  return this.getLatestRevision(phase)?.submittedAt;
}



ngOnInit(): void {

  const role = this.authService
    .currentUser()
    ?.role
    ?.toLowerCase();

  if (role !== 'client') {
    throw new Error(
      'Only clients can access contract progress'
    );
  }

  this.newPhase = {
    name: '',
    description: '',
    deadline: '',
    amount: null,
    clientAttachments: []
  };

  this.route.queryParamMap.subscribe(params => {

    this.contractId =
      params.get('contractId') || '';

    if (!this.contractId) {

      this.isLoading = false;

      this.contract = null;

      this.diary = null;

      return;

    }

    this.fetchContractDiary();

  });

}


fetchContractDiary(
  phaseId?: string
): void {

  if (!this.contractId) {
    return;
  }

  this.isLoading = true;

  this.diaryService
    .getDiaryByContractId(
      this.contractId
    )
    .subscribe({

      next: (res: any) => {

        console.log(
          'Statuses:',
          res.diary?.phases?.map(
            (p: any) => ({
              id: p._id,
              status: p.status
            })
          )
        );

        this.contract =
          res.contract || null;

        this.diary =
          res.diary || null;

        this.isLoading = false;

        if (phaseId) {
          this.reviewing[phaseId] = false;
        }

      },

      error: (err) => {

        console.error(
          'Failed to load contract diary',
          err
        );

        this.contract = null;

        this.diary = null;

        this.isLoading = false;

        if (phaseId) {
          this.reviewing[phaseId] = false;
        }

      }

    });

}


onFileUploaded(
  fileInfo: {
    url: string;
    fileName: string;
    fileSize: string;
    fileType: string;
  }
): void {

  const attachment: Attachment = {

    fileName: fileInfo.fileName,

    fileUrl: fileInfo.url,

    fileType: fileInfo.fileType,

    fileSize: fileInfo.fileSize

  };

  this.newPhase.clientAttachments.push(
    attachment
  );

  this.tempUploadUrl = null;

}

removeAttachment(
  index: number
): void {

  this.newPhase.clientAttachments.splice(
    index,
    1
  );

}




  openAddPhaseModal(
  diaryId: string
): void {

  this.selectedDiaryId = diaryId;

  this.showAddPhaseModal = true;

  document.body.classList.add(
    'modal-open'
  );

}

closeAddPhaseModal(): void {

  this.showAddPhaseModal = false;

  this.selectedDiaryId = null;

  this.tempUploadUrl = null;

  this.newPhase = {
    name: '',
    description: '',
    deadline: '',
    amount: null,
    clientAttachments: []
  };

  document.body.classList.remove(
    'modal-open'
  );

}


approvePhase(
  diaryId: string,
  phaseId: string
): void {

  this.reviewing[phaseId] = true;

  this.diaryService
    .reviewPhase(
      diaryId,
      phaseId,
      'approve'
    )
    .subscribe({

      next: () => {

        this.fetchContractDiary(
          phaseId
        );

      },

      error: () => {

        this.reviewing[phaseId] = false;

      }

    });

}

requestChanges(
  diaryId: string,
  phaseId: string
): void {

  const feedback =
    this.feedbackText[phaseId] || '';

  this.reviewing[phaseId] = true;

  this.diaryService
    .reviewPhase(
      diaryId,
      phaseId,
      'request-changes',
      feedback
    )
    .subscribe({

      next: () => {

        this.feedbackText[phaseId] = '';

        this.fetchContractDiary(
          phaseId
        );

      },

      error: () => {

        this.reviewing[phaseId] = false;

      }

    });

}

addPhase(
  diaryId: string
): void {

  if (!this.newPhase.name.trim()) {
    return;
  }

  this.addingPhase[diaryId] = true;

  this.diaryService
    .addPhase(
      diaryId,
      {
        name: this.newPhase.name,
        description: this.newPhase.description,
        deadline:
          this.newPhase.deadline || undefined,
        amount:
          this.newPhase.amount || 0,
        clientAttachments:
          this.newPhase.clientAttachments
      }
    )
    .subscribe({

      next: (res: any) => {

        alert(
          res.message ||
          'Phase added successfully.'
        );

        this.newPhase = {
          name: '',
          description: '',
          deadline: '',
          amount: null,
          clientAttachments: []
        };

        this.tempUploadUrl = null;

        this.closeAddPhaseModal();

        this.fetchContractDiary();

      },

      error: (err) => {

        alert(
          err.error?.message ||
          'Failed to add phase.'
        );

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
