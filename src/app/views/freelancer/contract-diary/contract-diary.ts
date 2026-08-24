import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';

@Component({
  selector: 'app-contract-diary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contract-diary.html',
  styleUrl: './contract-diary.css'
})
export class ContractDiary implements OnInit {
  contractId: string = '';
  diary: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private diaryService: ContractDiaryService
  ) {}

  ngOnInit(): void {
    // Check path parameter (e.g. /contract-diary/:id)
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      // Check query parameter (e.g. /contract-diary?contractId=...)
      this.route.queryParamMap.subscribe(queryParams => {
        const queryId = queryParams.get('contractId');
        
        this.contractId = idParam || queryId || '';
        
        if (this.contractId) {
          this.loadDiary();
        } else {
          this.error = 'No contract ID provided in route.';
          this.isLoading = false;
        }
      });
    });
  }

  loadDiary(): void {
    this.isLoading = true;
    this.diaryService.getFreelancerDiary(this.contractId).subscribe({
      next: (res) => {
        if (res.success) {
          this.diary = res.diary;
        } else {
          this.error = res.message || 'Failed to load diary.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching diary:', err);
        this.error = 'Failed to load diary details.';
        this.isLoading = false;
      }
    });
  }

  get totalPhases() {
    return this.diary?.phases?.length || 0;
  }

  get completedPhases() {
    return this.diary?.phases?.filter((p: any) => p.status === 'completed' || p.status === 'approved').length || 0;
  }

  get inProgressPhases() {
    return this.diary?.phases?.filter((p: any) => p.status === 'in-progress' || p.status === 'under-review' || p.status === 'submitted' || p.status === 'revision-requested' || p.status === 'changes-requested').length || 0;
  }

  get notStartedPhases() {
    return this.diary?.phases?.filter((p: any) => p.status === 'created' || p.status === 'pending').length || 0;
  }

  get pendingSubmissions() {
    return this.diary?.phases?.filter((p: any) => p.status === 'revision-requested' || p.status === 'changes-requested' || p.status === 'in-progress').length || 0;
  }

  getPhaseProgress(status: string): number {
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
    return statusMap[status?.toLowerCase()] || 0;
  }
}
