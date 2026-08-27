import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';

import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';

@Component({
  selector: 'app-create-phase',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, InputField, Button, FileUpload, FilePreview],
  templateUrl: './create-phase.html',
  styleUrl: './create-phase.css'
})
export class CreatePhase implements OnInit {
  contractId: string = '';
  contract: any = null;
  diaryId: string = '';
  phaseId: string | null = null;
  isEditMode: boolean = false;

  phaseForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diaryService: ContractDiaryService,
    private fileService: FileService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id') || '';

      // Check query params for phaseId
      this.route.queryParamMap.subscribe(queryParams => {
        this.phaseId = queryParams.get('phaseId');
        this.isEditMode = !!this.phaseId;

        if (this.contractId) {
          this.fetchContractDetails();
        }
      });
    });
  }

  initForm(): void {
    this.phaseForm = this.fb.group({
      phaseName: ['', [Validators.required, Validators.maxLength(100)]],
      deadline: ['', Validators.required],
      budget: [null, [Validators.required, Validators.min(1)]],
      deliverables: this.fb.array([]),
      acceptanceCriteria: this.fb.array([]),
      clientAttachments: this.fb.array([])
    });
    this.addDeliverable();
    this.addCriteria();
  }

  get deliverables(): FormArray {
    return this.phaseForm.get('deliverables') as FormArray;
  }

  get acceptanceCriteria(): FormArray {
    return this.phaseForm.get('acceptanceCriteria') as FormArray;
  }

  get clientAttachments(): FormArray {
    return this.phaseForm.get('clientAttachments') as FormArray;
  }

  addDeliverable(): void {
    this.deliverables.push(this.fb.control('', Validators.required));
  }

  removeDeliverable(index: number): void {
    this.deliverables.removeAt(index);
    if (this.deliverables.length === 0) {
      this.addDeliverable();
    }
  }

  addCriteria(): void {
    this.acceptanceCriteria.push(this.fb.control('', Validators.required));
  }

  removeCriteria(index: number): void {
    this.acceptanceCriteria.removeAt(index);
    if (this.acceptanceCriteria.length === 0) {
      this.addCriteria();
    }
  }

  resetForm(): void {
    this.phaseForm.reset();
    this.deliverables.clear();
    this.acceptanceCriteria.clear();
    this.clientAttachments.clear();
    this.addDeliverable();
    this.addCriteria();
  }

  currentFile: File | null = null;
  UploadBucket = UploadBucket;
  UploadSection = UploadSection;

  onFileSelected(file: File): void {
    this.currentFile = file;
  }

  onUploadSuccess(url: string): void {
    if (this.currentFile) {
      this.clientAttachments.push(this.fb.group({
        fileName: [this.currentFile.name],
        fileUrl: [url],
        fileType: [this.currentFile.type],
        fileSize: [(this.currentFile.size / 1024 / 1024).toFixed(2) + ' MB']
      }));
      this.currentFile = null;
    }
  }

  onUploadError(err: string): void {
    console.error('File upload failed', err);
    alert('Failed to upload file: ' + err);
    this.currentFile = null;
  }



  removeAttachment(index: number): void {
    this.clientAttachments.removeAt(index);
  }

  fetchContractDetails(): void {
    this.diaryService.getDiaryByContractId(this.contractId).subscribe({
      next: (res) => {
        if (res.success && res.diary) {
          this.diaryId = res.diary._id;
          this.contract = res.diary.contractId;

          if (this.isEditMode && this.phaseId) {
            const phase = res.diary.phases.find((p: any) => p._id === this.phaseId);
            if (phase) {
              this.patchForm(phase);
            }
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  patchForm(phase: any): void {
    const deadline = phase.deadline ? new Date(phase.deadline).toISOString().split('T')[0] : '';
    this.phaseForm.patchValue({
      phaseName: phase.name,
      deadline: deadline,
      budget: phase.amount
    });

    // Clear initial arrays
    this.deliverables.clear();
    this.acceptanceCriteria.clear();
    this.clientAttachments.clear();

    if (phase.clientAttachments && phase.clientAttachments.length > 0) {
      phase.clientAttachments.forEach((att: any) => {
        this.clientAttachments.push(this.fb.group({
          fileName: [att.fileName],
          fileUrl: [att.fileUrl],
          fileType: [att.fileType],
          fileSize: [att.fileSize]
        }));
      });
    }

    // In a real implementation we would patch the deliverables/criteria, 
    // but the backend only stores description right now for phase updates.
    // However, if the backend stored arrays, we'd loop and push controls here.
    // We'll just put placeholder if empty or just 1 item since we modified backend 
    // to just take name, deadline, amount.
    this.addDeliverable();
    this.addCriteria();
  }

  createPhase(): void {
    if (this.phaseForm.invalid) {
      this.phaseForm.markAllAsTouched();
      alert("Please fill in all required fields (Name, Deadline, Budget).");
      return;
    }

    const formVal = this.phaseForm.value;
    const payload = {
      name: formVal.phaseName,
      description: "Phase details setup by client",
      amount: formVal.budget,
      deadline: formVal.deadline,
      deliverables: formVal.deliverables.filter((d: string) => d?.trim() !== ''),
      acceptanceCriteria: formVal.acceptanceCriteria.filter((c: string) => c?.trim() !== ''),
      clientAttachments: formVal.clientAttachments
    };

    if (this.isEditMode && this.phaseId) {
      this.diaryService.updatePhase(this.diaryId, this.phaseId, payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/contract-progress', this.contractId]);
          } else {
            alert('Failed to update phase.');
          }
        },
        error: (err) => console.error(err)
      });
    } else {
      this.diaryService.addPhase(this.diaryId, payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/contract-progress', this.contractId]);
          } else {
            alert('Failed to create phase.');
          }
        },
        error: (err) => console.error(err)
      });
    }
  }
}

