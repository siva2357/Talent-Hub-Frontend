import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';

import { FormsModule } from '@angular/forms';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';
import { StatCardData } from '../../../core/models/ui.model';

@Component({
  selector: 'app-phase-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Button, Badge, InputField, FilePreview, StatCard],
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

  get phaseStats(): StatCardData[] {
    const budget = this.phase?.amount || 0;
    const released = this.amountReleased;
    const remaining = this.remainingAmount;
    const dueDateStr = this.phase?.deadline ? new Date(this.phase.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date';

    return [
      { title: 'PHASE BUDGET', value: `₹${budget.toLocaleString('en-IN')}`, icon: 'bi bi-wallet2' },
      { title: 'AMOUNT RELEASED', value: `₹${released.toLocaleString('en-IN')}`, icon: 'bi bi-cash-stack' },
      { title: 'REMAINING AMOUNT', value: `₹${remaining.toLocaleString('en-IN')}`, icon: 'bi bi-house-door' },
      { title: 'DUE DATE', value: dueDateStr, icon: 'bi bi-calendar-event' }
    ];
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
}

