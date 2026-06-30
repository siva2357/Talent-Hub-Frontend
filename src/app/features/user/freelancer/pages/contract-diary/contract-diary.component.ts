import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ContractDiaryService } from '../../../../../core/services/contract-diary.service';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { Attachment, Diary, Phase, Revision } from '../../../../../core/model/contract-diary.model';
import { ActivatedRoute } from '@angular/router';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-contract-diary',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,RichTextEditorComponent, ButtonComponent, FileUploadComponent, FilePreviewComponent],
  templateUrl: './contract-diary.component.html',
  styleUrl: './contract-diary.component.css'
})
export class ContractDiaryComponent implements OnInit {
  private diaryService = inject(ContractDiaryService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  isLoading = signal(true);
  
  contractId = this.route.snapshot.queryParamMap.get('contractId') || '';
  private refresh$ = new Subject<void>();

  diary = toSignal(
    this.refresh$.pipe(
      startWith(null),
      tap(() => this.isLoading.set(true)),
      switchMap(() => {
        if (!this.contractId) {
          this.isLoading.set(false);
          return of(null);
        }
        return this.diaryService.getFreelancerDiaries(this.contractId).pipe(
          map((res: any) => res.diary || null),
          tap(() => this.isLoading.set(false)),
          catchError((err) => {
            console.error(err);
            this.isLoading.set(false);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  submitPhaseForm!: FormGroup;
  submitting = signal<Record<string, boolean>>({});
  showSubmitModal = signal(false);
  selectedDiaryId = signal<string | null>(null);
  selectedPhase = signal<Phase | null>(null);

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  tempUploadUrls = signal<Record<string, string | null>>({});
  uploadedFiles = signal<Record<string, Attachment[]>>({});

  ngOnInit(): void {
    this.submitPhaseForm = this.fb.group({
      freelancerNote: ['', Validators.required]
    });
  }

  getRevisionNumber(phase: Phase, revision: Revision): number {
    return phase.revisions.findIndex(r => r._id === revision._id) + 1;
  }

  openSubmitModal(diaryId: string, phase: Phase): void {
    this.selectedDiaryId.set(diaryId);
    this.selectedPhase.set(phase);
    this.submitPhaseForm.reset({ freelancerNote: '' });
    
    this.uploadedFiles.update(files => ({
      ...files,
      [phase._id]: files[phase._id] ?? []
    }));

    this.showSubmitModal.set(true);
    document.body.classList.add('modal-open');
  }

  closeSubmitModal(): void {
    this.showSubmitModal.set(false);
    this.selectedDiaryId.set(null);
    this.selectedPhase.set(null);
    document.body.classList.remove('modal-open');
  }

  onFileUploaded(
    phaseId: string,
    fileInfo: { url: string; fileName: string; fileType: string; fileSize: string; }
  ): void {
    this.uploadedFiles.update(files => {
      const current = files[phaseId] || [];
      return {
        ...files,
        [phaseId]: [...current, {
          fileName: fileInfo.fileName,
          fileUrl: fileInfo.url,
          fileType: fileInfo.fileType,
          fileSize: fileInfo.fileSize
        }]
      };
    });
    this.tempUploadUrls.update(urls => ({ ...urls, [phaseId]: null }));
  }

  removeAttachment(phaseId: string, index: number): void {
    this.uploadedFiles.update(files => {
      const current = files[phaseId];
      if (current) {
        const newArr = [...current];
        newArr.splice(index, 1);
        return { ...files, [phaseId]: newArr };
      }
      return files;
    });
  }

  getLatestRevision(phase: Phase): Revision | null {
    if (!phase.revisions?.length) return null;
    return phase.revisions[phase.revisions.length - 1];
  }

  getLatestNote(phase: Phase): string {
    return this.getLatestRevision(phase)?.freelancerNote || '';
  }

  getLatestFeedback(phase: Phase): string {
    return this.getLatestRevision(phase)?.clientFeedback || '';
  }

  getLatestAttachments(phase: Phase): Attachment[] {
    return this.getLatestRevision(phase)?.attachments || [];
  }

  hasRevision(phase: Phase): boolean {
    return !!phase.revisions?.length;
  }

  startPhase(diaryId: string, phaseId: string): void {
    this.submitting.update(s => ({ ...s, [phaseId]: true }));
    this.diaryService.startPhase(diaryId, phaseId).subscribe({
      next: () => { 
        this.refresh$.next();
        this.submitting.update(s => ({ ...s, [phaseId]: false }));
      },
      error: () => { 
        this.submitting.update(s => ({ ...s, [phaseId]: false })); 
      }
    });
  }

  submitUpdate(diaryId: string, phaseId: string): void {
    const note = this.submitPhaseForm.value.freelancerNote?.trim() || '';
    const files = this.uploadedFiles()[phaseId] || [];

    if (this.submitPhaseForm.invalid && files.length === 0) {
      this.submitPhaseForm.markAllAsTouched();
      return;
    }

    this.submitting.update(s => ({ ...s, [phaseId]: true }));

    this.diaryService.submitPhaseUpdate(diaryId, phaseId, {
      freelancerNote: note,
      attachments: files
    }).subscribe({
      next: () => {
        this.submitPhaseForm.reset({ freelancerNote: '' });
        this.uploadedFiles.update(f => ({ ...f, [phaseId]: [] }));
        this.tempUploadUrls.update(u => ({ ...u, [phaseId]: null }));
        this.closeSubmitModal();
        this.refresh$.next();
        this.submitting.update(s => ({ ...s, [phaseId]: false }));
      },
      error: (err) => {
        console.error(err);
        this.submitting.update(s => ({ ...s, [phaseId]: false }));
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

  canStart(phase: Phase): boolean {
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

  trackByPhase(index: number, phase: Phase): string {
    return phase._id;
  }

  isContractActive(d: Diary): boolean {
    if (!d.contractId?.contractStartDate) return true;
    const start = new Date(d.contractId.contractStartDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() >= start.getTime();
  }
}
