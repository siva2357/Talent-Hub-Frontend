import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contract-phase-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
  isSubmitting: boolean = false;

  // Form
  freelancerNote: string = '';
  attachments: { fileUrl: string; fileName: string; fileSize: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private diaryService: ContractDiaryService,
    private fileService: FileService
  ) {}

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

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.isSubmitting = true; // Use submitting flag to show activity
      let uploadedCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        this.fileService.uploadFile(
          file, 
          UploadBucket.FreelancerData, 
          UploadSection.ContractFiles
        ).subscribe({
          next: (res) => {
            if (res.success) {
              const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
              this.attachments.push({
                fileUrl: res.url,
                fileName: file.name,
                fileSize: `${sizeInMb} MB`
              });
            }
            uploadedCount++;
            if (uploadedCount === files.length) {
               this.isSubmitting = false;
               event.target.value = ''; // Reset input
            }
          },
          error: (err) => {
            console.error('File upload error:', err);
            uploadedCount++;
            if (uploadedCount === files.length) {
               this.isSubmitting = false;
               event.target.value = '';
            }
          }
        });
      }
    }
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  startPhase() {
    if (!this.diaryId || !this.phaseId) return;
    this.isSubmitting = true;
    this.diaryService.startPhase(this.diaryId, this.phaseId).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.phase = res.phase;
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error starting phase', err);
      }
    });
  }

  submitPhase() {
    if (!this.diaryId || !this.phaseId) return;
    this.isSubmitting = true;
    const payload = {
      freelancerNote: this.freelancerNote,
      attachments: this.attachments
    };
    this.diaryService.submitPhase(this.diaryId, this.phaseId, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.phase = res.phase;
          this.freelancerNote = '';
          this.attachments = [];
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting phase', err);
      }
    });
  }

  get latestRevision() {
    if (!this.phase || !this.phase.revisions || this.phase.revisions.length === 0) return null;
    return this.phase.revisions[this.phase.revisions.length - 1];
  }

  get phaseProgress() {
    if (!this.phase) return 0;
    const statusMap: Record<string, number> = {
      'created': 10,
      'pending': 10,
      'in-progress': 40,
      'submitted': 70,
      'under-review': 75,
      'revision-requested': 60,
      'changes-requested': 60,
      'approved': 100,
      'completed': 100
    };
    return statusMap[this.phase.status?.toLowerCase()] || 0;
  }

  get timelineEvents() {
    if (!this.phase) return [];
    
    const events = [];
    
    events.push({
      title: 'Phase Created',
      date: this.phase.createdAt || new Date(),
      status: 'completed',
      by: 'System'
    });

    const statusMap: Record<string, number> = {
      'created': 0,
      'pending': 0,
      'in-progress': 1,
      'submitted': 2,
      'under-review': 3,
      'revision-requested': 4,
      'changes-requested': 4,
      'approved': 5,
      'completed': 5
    };
    
    const currentStatusLevel = statusMap[this.phase.status?.toLowerCase()] || 0;

    if (currentStatusLevel >= 1) {
      events.push({
        title: 'Work Started',
        date: this.phase.updatedAt || new Date(),
        status: currentStatusLevel > 1 ? 'completed' : 'current',
        by: 'You'
      });
    }

    if (currentStatusLevel >= 2) {
      events.push({
        title: 'Work Submitted',
        date: this.phase.updatedAt || new Date(),
        status: currentStatusLevel > 2 ? 'completed' : 'current',
        by: 'You'
      });
    }

    if (currentStatusLevel >= 3 && currentStatusLevel !== 4) {
      events.push({
        title: 'Under Review',
        date: this.phase.updatedAt || new Date(),
        status: currentStatusLevel > 3 ? 'completed' : 'current',
        by: 'Client'
      });
    }
    
    if (currentStatusLevel === 4) {
      events.push({
        title: 'Revision Requested',
        date: this.phase.updatedAt || new Date(),
        status: 'current',
        by: 'Client'
      });
    }

    if (currentStatusLevel >= 5) {
      events.push({
        title: 'Approved',
        date: this.phase.updatedAt || new Date(),
        status: 'completed',
        by: 'Client'
      });
    } else {
       events.push({
        title: 'Approved',
        date: null,
        status: 'pending',
        by: 'Client'
      });
    }

    return events;
  }
}
