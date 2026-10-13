import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContractDiaryService } from '../../../core/services/contract-diary.service';
import { TokenService } from '../../../core/services/token.service';

import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';

@Component({
  selector: 'app-contract-progress',
  standalone: true,
  imports: [CommonModule, RouterModule, Table, Button, Badge, Dropdown, StatCard],
  templateUrl: './contract-progress.html',
  styleUrl: './contract-progress.css'
})
export class ContractProgress implements OnInit, AfterViewInit {
  contractId: string = '';
  diary: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  userRole: string = '';

  @ViewChild('noTemplate', { static: true }) noTemplate!: TemplateRef<any>;
  @ViewChild('phaseDetailsTemplate', { static: true }) phaseDetailsTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('budgetTemplate', { static: true }) budgetTemplate!: TemplateRef<any>;
  @ViewChild('dueDateTemplate', { static: true }) dueDateTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [
    { field: 'no', headerName: 'No.' },
    { field: 'phaseDetails', headerName: 'Phase Details' },
    { field: 'status', headerName: 'Status' },
    { field: 'budget', headerName: 'Budget' },
    { field: 'dueDate', headerName: 'Due Date' },
    { field: 'action', headerName: 'Action' }
  ];

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
          // IMPORTANT: the funded amount comes from res.contract for clients
          if (res.contract && this.diary && this.diary.contractId) {
            this.diary.contractId.funded = res.contract.funded || 0;
          }
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns[0].cellTemplate = this.noTemplate;
      this.columns[1].cellTemplate = this.phaseDetailsTemplate;
      this.columns[2].cellTemplate = this.statusTemplate;
      this.columns[3].cellTemplate = this.budgetTemplate;
      this.columns[4].cellTemplate = this.dueDateTemplate;
      this.columns[5].cellTemplate = this.actionTemplate;
      this.columns = [...this.columns];
    });
  }

  getDropdownItems(phase: any): DropdownItem[] {
    const items: DropdownItem[] = [
      { label: 'Phase Details', value: 'details', icon: 'bi bi-info-circle' }
    ];
    if (this.userRole === 'client' && phase.status === 'pending') {
      items.push({ label: 'Edit Phase', value: 'edit', icon: 'bi bi-pencil' });
    }
    return items;
  }

  onDropdownAction(item: DropdownItem, phase: any): void {
    if (item.value === 'details') {
      this.router.navigate(['/phase-details', phase._id], { queryParams: { contractId: this.contractId } });
    } else if (item.value === 'edit') {
      this.router.navigate(['/create-phase', this.contractId], { queryParams: { phaseId: phase._id } });
    }
  }

  getBadgeVariant(status: string): 'success' | 'primary' | 'secondary' | 'warning' | 'danger' | 'info' | 'purple' {
    const s = status?.toLowerCase() || '';
    if (s === 'completed' || s === 'approved') return 'success';
    if (s === 'in-progress' || s === 'active') return 'primary';
    if (s === 'changes-requested' || s === 'revision-requested') return 'warning';
    if (s === 'submitted' || s === 'under-review') return 'info';
    return 'secondary';
  }

  get stats(): StatCardData[] {
    const budget = this.diary?.contractId?.estimatedBudget || 0;
    const spent = this.diary?.contractId?.spent || 0;
    const remaining = Math.max(0, budget - spent);
    const totalPhases = this.diary?.phases?.length || 0;

    return [
      { title: 'TOTAL BUDGET', value: `₹${budget.toLocaleString('en-IN')}`, icon: 'bi bi-wallet2' },
      { title: 'RELEASED AMOUNT', value: `₹${spent.toLocaleString('en-IN')}`, icon: 'bi bi-cash-stack' },
      { title: 'REMAINING AMOUNT', value: `₹${remaining.toLocaleString('en-IN')}`, icon: 'bi bi-house-door' },
      { title: 'TOTAL PHASES', value: totalPhases, icon: 'bi bi-diagram-3' }
    ];
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

  isFunded(): boolean {
    return !!(this.diary?.contractId?.funded && this.diary?.contractId?.funded > 0);
  }

  goToManageContracts(): void {
    this.router.navigate(['/manage-contract']);
  }
}
