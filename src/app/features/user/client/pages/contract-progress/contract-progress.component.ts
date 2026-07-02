import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { AddPhaseFormDto, SubmitFeedbackDto } from '../../../../../core/DTOs/contract-diary.dto';
import { Attachment, Diary } from '../../../../../core/model/contract-diary.model';
import { AuthService } from '../../../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { ToastrService } from 'ngx-toastr';


import { AccordionComponent } from '../../../../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-contract-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, InputComponent, RichTextEditorComponent, FileUploadComponent, FilePreviewComponent, BadgeComponent, ReactiveFormsModule, AccordionComponent],
  templateUrl: './contract-progress.component.html',
  styleUrl: './contract-progress.component.css'
})
export class ContractProgressComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private toastr = inject(ToastrService);

  contractId = signal<string>('');


  phaseForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    deadline: new FormControl('', Validators.required),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    clientAttachments: new FormControl<Attachment[]>([])
  });
  isLoading = signal(true);
  userRole: 'freelancer' | 'client' = 'freelancer';
  feedbackText: Record<string, string> = {};
  reviewing: Record<string, boolean> = {};
  addingPhase: Record<string, boolean> = {};
  showAddPhaseModal = signal(false);
  selectedDiaryId = signal<string | null>(null);
  bucketKey: BucketKey = BucketKey.ClientData;
  readonly uploadSection = UploadSection.ContractFiles;
  tempUploadUrl = signal<string | null>(null);

  diary = signal<Diary | null>(null);
  contract = signal<any>(null);

  get accordionItems(): any[] {
    const d = this.diary();
    if (!d || !d.phases) return [];
    return d.phases.map((phase: any) => ({
      ...phase,
      id: phase._id,
      title: phase.name
    }));
  }


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

    this.phaseForm.reset({ clientAttachments: [] });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {

      this.contractId.set(params.get('contractId') || '');

      if (!this.contractId()) {

        this.isLoading.set(false);

        this.contract.set(null);

        this.diary.set(null);

        return;

      }

      this.fetchContractDiary();

    });

  }


  fetchContractDiary(
    phaseId?: string
  ): void {

    if (!this.contractId()) {
      return;
    }

    this.isLoading = signal(true);

    this.diaryService
      .getDiaryByContractId(
        this.contractId()
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
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

          this.contract.set(res.contract || null);

          this.diary.set(res.diary || null);

          this.isLoading.set(false);

          if (phaseId) {
            this.reviewing[phaseId] = false;
          }


        },

        error: (err) => {

          console.error(
            'Failed to load contract diary',
            err
          );

          this.contract.set(null);

          this.diary.set(null);

          this.isLoading.set(false);

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

    const attachments = this.phaseForm.value.clientAttachments || [];
    this.phaseForm.patchValue({ clientAttachments: [...attachments, attachment] });

    this.tempUploadUrl.set(null);

  }

  removeAttachment(
    index: number
  ): void {

    const attachments = [...(this.phaseForm.value.clientAttachments || [])];
    attachments.splice(index, 1);
    this.phaseForm.patchValue({ clientAttachments: attachments });

  }




  openAddPhaseModal(
    diaryId: string
  ): void {

    this.selectedDiaryId.set(diaryId);

    this.showAddPhaseModal.set(true);

    document.body.classList.add(
      'modal-open'
    );



  }

  closeAddPhaseModal(): void {
    this.showAddPhaseModal.set(false);
    this.selectedDiaryId.set(null);
    this.tempUploadUrl.set(null);
    this.phaseForm.reset({
      name: '',
      description: '',
      deadline: '',
      amount: null,
      clientAttachments: []
    });

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

    const payload: SubmitFeedbackDto = {
      clientFeedback: feedback
    };

    this.diaryService
      .reviewPhase(
        diaryId,
        phaseId,
        'request-changes',
        payload.clientFeedback
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

  addPhase(diaryId: string): void {
    if (this.phaseForm.invalid) {
      return;
    }
    
    const formValue = this.phaseForm.value;
    const payload: AddPhaseFormDto = {
      name: formValue.name || '',
      description: formValue.description || '',
      deadline: formValue.deadline || '',
      amount: formValue.amount ?? null,
      clientAttachments: formValue.clientAttachments || []
    };

    this.addingPhase[diaryId] = true;

    this.diaryService
      .addPhase(diaryId, payload)
      .subscribe({

        next: (res: any) => {

          this.toastr.success(
            res.message ||
            'Phase added successfully.',
            'Contract Progress'
          );

          this.phaseForm.reset({ clientAttachments: [] });

          this.tempUploadUrl.set(null);

          this.closeAddPhaseModal();

          this.fetchContractDiary();
          this.addingPhase[diaryId] = false;


        },

        error: (err) => {

          this.toastr.error(
            err.error?.message ||
            'Failed to add phase.',
            'Contract Progress'
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
    if (fileType.includes('pdf')) return 'bi-file-earmark-pdf-fill text-danger';
    if (fileType.includes('image')) return 'bi-file-earmark-image-fill text-info';
    if (fileType.includes('video')) return 'bi-play-btn-fill text-primary';
    if (fileType.includes('zip')) return 'bi-file-earmark-zip-fill text-success';
    return 'bi-file-earmark-fill text-secondary';
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'in-progress': return 'bg-primary';
      case 'submitted': return 'bg-warning';
      case 'changes-requested': return 'bg-danger';
      case 'overdue': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getOverallStatusBadgeVariant(status: string): string {
    return status === 'completed' ? 'success' : 'primary';
  }

  getPhaseStatusBadgeVariant(status: string): string {
    switch (status) {
      case 'approved': return 'success';
      case 'in-progress': return 'primary';
      case 'submitted': return 'warning';
      case 'changes-requested': return 'danger';
      case 'overdue': return 'danger';
      default: return 'secondary';
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
