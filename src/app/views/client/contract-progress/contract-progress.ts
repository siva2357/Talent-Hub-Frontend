import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-contract-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contract-progress.html',
  styleUrl: './contract-progress.css'
})
export class ContractProgress implements OnInit {
  contractId: string = '';
  diary: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  userRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private diaryService: ContractDiaryService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.userRole = this.tokenService.getRole()?.toLowerCase() || '';

    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id') || '';
      if (this.contractId) {
        this.loadDiary();
      }
    });
  }

  loadDiary(): void {
    this.isLoading = true;
    this.error = null;

    // In real app, might want to check role before choosing endpoint
    this.diaryService.getDiaryByContractId(this.contractId).subscribe({
      next: (res) => {
        if (res.success) {
          this.diary = res.diary;
        } else {
          this.error = res.message || 'Failed to load contract diary';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching diary:', err);
        this.error = 'Failed to load contract diary. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Calculate percentage based on approved phases
  getOverallProgress(): number {
    if (!this.diary || !this.diary.phases || this.diary.phases.length === 0) return 0;
    const completed = this.diary.phases.filter((p: any) => p.status === 'approved').length;
    return Math.round((completed / this.diary.phases.length) * 100);
  }

  // Add Phase Navigation
  navigateToAddPhase(): void {
    this.router.navigate(['/create-phase', this.contractId]);
  }

  // Phase Actions
  submitPhase(phaseId: string): void {
    if (confirm('Are you sure you want to submit this phase for review?')) {
      this.diaryService.submitPhase(this.diary._id, phaseId, { submissionDetails: 'Submitted via UI' }).subscribe({
        next: (res) => {
          if (res.success) this.loadDiary();
        },
        error: (err) => console.error(err)
      });
    }
  }

  reviewPhase(phaseId: string, action: 'approve' | 'request_changes'): void {
    const status = action === 'approve' ? 'approved' : 'in-progress'; // Using simple fallback if requesting changes
    const feedback = action === 'approve' ? 'Looks good!' : prompt('Please enter your feedback for requesting changes:');

    if (action === 'request_changes' && !feedback) return; // cancelled prompt

    this.diaryService.reviewPhase(this.diary._id, phaseId, { status, clientFeedback: feedback }).subscribe({
      next: (res) => {
        if (res.success) this.loadDiary();
      },
      error: (err) => console.error(err)
    });
  }
}
