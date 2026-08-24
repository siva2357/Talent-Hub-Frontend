import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phase-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './phase-details.html',
  styleUrl: './phase-details.css'
})
export class PhaseDetails implements OnInit {
  phaseId: string = '';
  contractId: string = '';
  diaryId: string = '';
  diary: any = null;
  phase: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  // Review form
  clientFeedback: string = '';
  isReviewing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private diaryService: ContractDiaryService
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
    this.diaryService.getDiaryByContractId(this.contractId).subscribe({
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

  get phaseProgress() {
    if (!this.phase) return 0;
    const statusMap: Record<string, number> = {
      'created': 10,
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

  onReviewPhase(action: 'approve' | 'request-changes') {
    if (!this.diaryId || !this.phase?._id) return;
    
    this.isReviewing = true;
    const payload = {
      action: action,
      clientFeedback: this.clientFeedback
    };

    this.diaryService.reviewPhase(this.diaryId, this.phase._id, payload).subscribe({
      next: (res) => {
        this.isReviewing = false;
        if (res.success) {
          // Update the local phase data with the response
          this.phase = res.phase;
          this.clientFeedback = '';
        }
      },
      error: (err) => {
        this.isReviewing = false;
        console.error('Error reviewing phase:', err);
        // Maybe show a toast notification here
      }
    });
  }

  get timelineEvents() {
    if (!this.phase) return [];
    
    // We construct a dynamic timeline based on the phase status
    // The typical flow: created -> in-progress -> submitted -> under-review -> approved
    const events = [];
    
    // Created
    events.push({
      title: 'Phase Created',
      date: this.phase.createdAt || new Date(),
      status: 'completed',
      by: 'System'
    });

    const statusMap: Record<string, number> = {
      'created': 0,
      'in-progress': 1,
      'submitted': 2,
      'under-review': 3,
      'revision-requested': 4,
      'approved': 5,
      'completed': 5
    };
    
    const currentStatusLevel = statusMap[this.phase.status?.toLowerCase()] || 0;

    // Started
    if (currentStatusLevel >= 1) {
      events.push({
        title: 'Phase Started',
        date: this.phase.updatedAt || new Date(),
        status: currentStatusLevel > 1 ? 'completed' : 'current',
        by: 'Freelancer'
      });
    }

    // Submitted
    if (currentStatusLevel >= 2) {
      events.push({
        title: 'Phase Submitted',
        date: this.phase.updatedAt || new Date(),
        status: currentStatusLevel > 2 ? 'completed' : 'current',
        by: 'Freelancer'
      });
    }

    // Under Review
    if (currentStatusLevel >= 3 && currentStatusLevel !== 4) {
      events.push({
        title: 'Under Review',
        date: this.phase.updatedAt || new Date(),
        status: currentStatusLevel > 3 ? 'completed' : 'current',
        by: 'Client'
      });
    }
    
    // Revision
    if (currentStatusLevel === 4) {
      events.push({
        title: 'Revision Requested',
        date: this.phase.updatedAt || new Date(),
        status: 'current',
        by: 'Client'
      });
    }

    // Approved
    if (currentStatusLevel >= 5) {
      events.push({
        title: 'Approved',
        date: this.phase.updatedAt || new Date(),
        status: 'completed',
        by: 'Client'
      });
    } else {
       // Add pending approved
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
