import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';

import { FormsModule } from '@angular/forms';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { Timeline } from '../../../library/shared/components/timeline/timeline';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { TimelineStep } from '../../../core/models/ui.model';

@Component({
  selector: 'app-contract-phase-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Button, Badge, InputField, FilePreview, Timeline, FileUpload],
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

  onFileUpload(url: string) {
    this.submissionAttachments.push({ fileUrl: url, fileName: url.split('/').pop() || 'attachment' });
  }

  removeAttachment(index: number) {
    this.submissionAttachments.splice(index, 1);
  }

  getFileName(file: any) {
    return file.fileName || file.name || file.fileUrl?.split('/').pop() || file.url?.split('/').pop() || 'attachment';
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
        this.isSubmitting = false;
        if (res.success) {
          this.phase = res.phase;
          this.freelancerNote = '';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting phase:', err);
      }
    });
  }

  get mappedTimelineSteps(): TimelineStep[] {
    if (!this.phase) return [];

    const events: TimelineStep[] = [];

    const statusMap: Record<string, number> = {
      'pending': 0,
      'created': 0,
      'in-progress': 1,
      'overdue': 1,
      'submitted': 2,
      'changes-requested': 3,
      'revision-requested': 3,
      'approved': 4,
      'completed': 4
    };

    const currentStatusLevel = statusMap[this.phase.status?.toLowerCase()] || 0;

    // 1. Created
    events.push({
      title: 'Phase Created',
      description: 'by System',
      status: 'completed'
    });

    // 2. Started (In Progress)
    events.push({
      title: 'Phase Started',
      description: 'by Freelancer',
      status: currentStatusLevel > 1 ? 'completed' : (currentStatusLevel === 1 ? 'active' : 'upcoming')
    });

    // 3. Submitted
    events.push({
      title: 'Phase Submitted',
      description: 'by Freelancer',
      status: currentStatusLevel > 2 ? 'completed' : (currentStatusLevel === 2 ? 'completed' : 'upcoming')
    });

    // 4. Under Review / Changes Requested
    if (currentStatusLevel === 3) {
      events.push({
        title: 'Changes Requested',
        description: 'by Client',
        status: 'active'
      });
    } else {
      events.push({
        title: 'Under Review',
        description: 'by Client',
        status: currentStatusLevel >= 4 ? 'completed' : (currentStatusLevel === 2 ? 'active' : 'upcoming')
      });
    }

    // 5. Approved
    events.push({
      title: 'Approved',
      description: currentStatusLevel >= 4 ? 'by Client' : 'Pending',
      status: currentStatusLevel >= 4 ? 'completed' : 'upcoming'
    });

    return events;
  }
}
