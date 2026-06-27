import { Component, OnInit, signal, computed, inject, DestroyRef, ViewChild, TemplateRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ContractService } from '../../../../../core/services/contract.service';
import { ApplicationService } from '../../../../../core/services/application.service';

import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';
import { Table } from '../../../../../shared/components/table/table.component';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';

import { Availability } from '../../../../../core/enums/availability.enum';
import { BudgetTypeEnum } from '../../../../../core/enums/contract.enum';
import { Gender } from '../../../../../core/enums/gender.enum';
import { Language } from '../../../../../core/enums/language.enum';

@Component({
  selector: 'app-contract-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, InputComponent, ButtonComponent, ChipComponent, Table, BadgeComponent],
  templateUrl: './contract-proposals.component.html',
  styleUrl: './contract-proposals.component.css'
})
export class ContractProposalsComponent implements OnInit, AfterViewInit {
  // Dependencies
  private contractService = inject(ContractService);
  private applicationService = inject(ApplicationService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  // Core State
  contractId = signal<string | null>(null);
  applicants = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  // Modal State
  showRecruitmentModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  selectedProposal = signal<any>(null);
  nextAction = signal<string>('');

  assessmentFormGroup!: FormGroup;
  interviewFormGroup!: FormGroup;

  // Filter Options
  availabilityOptions = [
    { label: 'All Availability', value: '' },
    ...Object.values(Availability).map(value => ({ label: value.replace('-', ' '), value }))
  ];

  budgetTypeOptions = [
    { label: 'All Budget Types', value: '' },
    ...Object.values(BudgetTypeEnum).map(value => ({ label: value, value }))
  ];

  genderOptions = [
    { label: 'All Genders', value: '' },
    ...Object.values(Gender).map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))
  ];

  languageOptions = Object.values(Language).map(value => ({ label: value, value }));

  // Pending Filter State (Bound to UI Inputs)
  pendingSearchQuery = '';
  pendingSelectedAvailability = '';
  pendingSelectedBudgetType = '';
  pendingSelectedGender = '';
  pendingSelectedLanguages: string[] = [];

  // Active Filter State (Signals)
  searchQuery = signal<string>('');
  selectedAvailability = signal<string>('');
  selectedBudgetType = signal<string>('');
  selectedGender = signal<string>('');
  selectedLanguages = signal<string[]>([]);

  // Computed Properties
  activeFilters = computed(() => {
    const filters: { key: string; label: string }[] = [];
    if (this.searchQuery()) filters.push({ key: 'search', label: `Search: ${this.searchQuery()}` });
    if (this.selectedAvailability()) filters.push({ key: 'availability', label: `Availability: ${this.selectedAvailability()}` });
    if (this.selectedBudgetType()) filters.push({ key: 'budgetType', label: `Budget: ${this.selectedBudgetType()}` });
    if (this.selectedGender()) filters.push({ key: 'gender', label: `Gender: ${this.selectedGender()}` });
    this.selectedLanguages().forEach(lang => {
      filters.push({ key: `language-${lang}`, label: lang });
    });
    return filters;
  });

  filteredProposals = computed(() => {
    return this.applicants().filter((proposal: any) => {
      const f = proposal.freelancer;
      const search = this.searchQuery().toLowerCase();

      const searchMatch = !search ||
        f?.fullName?.toLowerCase().includes(search) ||
        f?.professionalHeadline?.toLowerCase().includes(search) ||
        f?.skills?.some((s: string) => s.toLowerCase().includes(search));

      const availabilityMatch = !this.selectedAvailability() || f?.availability?.includes(this.selectedAvailability());
      const budgetTypeMatch = !this.selectedBudgetType() || f?.budgetType === this.selectedBudgetType();
      const genderMatch = !this.selectedGender() || f?.gender === this.selectedGender();
      const languageMatch = this.selectedLanguages().length === 0 ||
        this.selectedLanguages().every((lang: string) => f?.languages?.includes(lang));

      return searchMatch && availabilityMatch && budgetTypeMatch && genderMatch && languageMatch;
    });
  });

  // Table Configuration
  @ViewChild('freelancerTemplate', { static: true }) freelancerTemplate!: TemplateRef<any>;
  @ViewChild('rateTemplate', { static: true }) rateTemplate!: TemplateRef<any>;
  @ViewChild('completedJobsTemplate', { static: true }) completedJobsTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true }) actionTemplate!: TemplateRef<any>;

  proposalColumns: any[] = [];


  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.contractId.set(params.get('contractId'));
      this.getApplicants();
    });

    this.assessmentFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.interviewFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.proposalColumns = [
        { name: 'Freelancer', prop: 'freelancer', cellTemplate: this.freelancerTemplate, width: 250 },
        { name: 'Rate', prop: 'hourlyRate', cellTemplate: this.rateTemplate, width: 120 },
        { name: 'Completed Jobs', prop: 'completed', cellTemplate: this.completedJobsTemplate, width: 150 },
        { name: 'Application Status', prop: 'applicationStatus', cellTemplate: this.statusTemplate, width: 200 },
        { name: 'Actions', prop: 'actions', cellTemplate: this.actionTemplate, sortable: false, width: 250 }
      ];
    });
  }

  getApplicants(): void {
    this.isLoading.set(true);
    this.contractService.getContractApplicants(this.contractId() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.applicants.set(res.applicants || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.isLoading.set(false);
        }
      });
  }

  // ========================================
  // ACTION MENU (3 DOTS)
  // ========================================

  activeActionRow = signal<any | null>(null);
  menuTop = signal<number>(0);
  menuLeft = signal<number>(0);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.activeActionRow()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-dropdown') && !target.closest('.action-menu')) {
        this.closeActionMenu();
      }
    }
  }

  toggleActionMenu(event: MouseEvent, row: any): void {
    event.stopPropagation();
    if (this.activeActionRow() && this.activeActionRow()?.applicationId === row.applicationId) {
      this.closeActionMenu();
    } else {
      this.activeActionRow.set(row);
      const target = (event.currentTarget as HTMLElement).closest('app-button') || event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.menuTop.set(rect.bottom + 8);
      this.menuLeft.set(rect.right - 220);
    }
  }

  closeActionMenu(): void {
    this.activeActionRow.set(null);
  }

  // ========================================
  // FILTER ACTIONS
  // ========================================

  applyFilters(): void {
    this.searchQuery.set(this.pendingSearchQuery);
    this.selectedAvailability.set(this.pendingSelectedAvailability);
    this.selectedBudgetType.set(this.pendingSelectedBudgetType);
    this.selectedGender.set(this.pendingSelectedGender);
    this.selectedLanguages.set(this.pendingSelectedLanguages);
  }

  clearFilters(): void {
    this.pendingSearchQuery = '';
    this.pendingSelectedAvailability = '';
    this.pendingSelectedBudgetType = '';
    this.pendingSelectedGender = '';
    this.pendingSelectedLanguages = [];
    this.applyFilters();
  }

  removeFilter(key: string): void {
    switch (key) {
      case 'search':
        this.pendingSearchQuery = '';
        this.searchQuery.set('');
        break;
      case 'availability':
        this.pendingSelectedAvailability = '';
        this.selectedAvailability.set('');
        break;
      case 'budgetType':
        this.pendingSelectedBudgetType = '';
        this.selectedBudgetType.set('');
        break;
      case 'gender':
        this.pendingSelectedGender = '';
        this.selectedGender.set('');
        break;
      default:
        if (key.startsWith('language-')) {
          const lang = key.replace('language-', '');
          this.pendingSelectedLanguages = this.pendingSelectedLanguages.filter(x => x !== lang);
          this.selectedLanguages.set(this.pendingSelectedLanguages);
        }
        break;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'application received': return 'Applied';
      case 'application shortlisted': return 'Shortlisted';
      case 'assessment scheduled': return 'Assessment Pending';
      case 'assessment completed': return 'Assessment Completed';
      case 'interview scheduled': return 'Interview Pending';
      case 'interview completed': return 'Interview Completed';
      case 'shortlisted': return 'Hired';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }

  getStatusBadgeVariant(status: string): string {
    switch (status) {
      case 'application received': return 'secondary';
      case 'application shortlisted': return 'primary';
      case 'assessment scheduled': return 'warning';
      case 'assessment completed': return 'info';
      case 'interview scheduled': return 'warning';
      case 'interview completed': return 'info';
      case 'shortlisted': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'application received': return 'bi-envelope';
      case 'application shortlisted': return 'bi-bookmark-check';
      case 'assessment scheduled': return 'bi-journal-text';
      case 'assessment completed': return 'bi-journal-check';
      case 'interview scheduled': return 'bi-calendar-event';
      case 'interview completed': return 'bi-calendar-check';
      case 'shortlisted': return 'bi-check-circle-fill';
      case 'rejected': return 'bi-x-circle-fill';
      default: return 'bi-info-circle';
    }
  }

  viewProfile(freelancerId: string): void {
    console.log('View profile:', freelancerId);
    // TODO: this.router.navigate(['/freelancer', freelancerId]);
  }

  getAvailableActions(): { label: string; value: string }[] {
    const proposal = this.selectedProposal();
    if (!proposal) return [];

    const status = proposal.applicationStatus;
    switch (status) {
      case 'application received':
        return [
          { label: 'Shortlist Application', value: 'shortlist' },
          { label: 'Reject Application', value: 'reject' }
        ];
      case 'application shortlisted':
        return [
          { label: 'Schedule Assessment', value: 'schedule-assessment' },
          { label: 'Reject Application', value: 'reject' }
        ];
      case 'assessment scheduled':
        return [
          { label: 'Assessment Passed', value: 'assessment-pass' },
          { label: 'Assessment Failed', value: 'assessment-fail' }
        ];
      case 'assessment completed':
        if (proposal?.assessment?.status === 'completed') {
          return [{ label: 'Schedule Interview', value: 'schedule-interview' }];
        }
        return [{ label: 'Reject Application', value: 'reject' }];
      case 'interview scheduled':
        return [{ label: 'Mark Interview Completed', value: 'complete-interview' }];
      case 'interview completed':
        return [
          { label: 'Hire Candidate', value: 'hire' },
          { label: 'Reject Application', value: 'reject' }
        ];
      default:
        return [];
    }
  }

  openRecruitmentModal(proposal: any): void {
    this.selectedProposal.set(proposal);
    this.nextAction.set('');
    this.assessmentFormGroup.reset();
    this.interviewFormGroup.reset();

    const actions = this.getAvailableActions();
    if (actions.length > 0) {
      this.nextAction.set(actions[0].value);
    }

    this.showRecruitmentModal.set(true);
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    if (this.isSubmitting()) return;
    this.showRecruitmentModal.set(false);
    this.selectedProposal.set(null);
    this.nextAction.set('');
    this.isSubmitting.set(false);
    document.body.classList.remove('modal-open');
  }

  closeModalIfTarget(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.id === 'recruitmentModal') {
      if (event.clientX >= target.clientWidth) return;
      this.closeModal();
    }
  }

  submitRecruitmentAction(): void {
    const proposal = this.selectedProposal();
    const action = this.nextAction();

    if (!proposal || !action) return;

    const id = proposal.applicationId;
    let apiCall;

    switch (action) {
      case 'shortlist':
        apiCall = this.applicationService.shortlistApplication(id);
        break;
      case 'reject':
        apiCall = this.applicationService.rejectApplication(id, {});
        break;
      case 'schedule-assessment':
        if (this.assessmentFormGroup.invalid) {
          this.assessmentFormGroup.markAllAsTouched();
          return;
        }
        apiCall = this.applicationService.scheduleAssessment(id, this.assessmentFormGroup.value);
        break;
      case 'assessment-pass':
        apiCall = this.applicationService.assessmentResult(id, { result: 'passed' });
        break;
      case 'assessment-fail':
        apiCall = this.applicationService.assessmentResult(id, { result: 'failed' });
        break;
      case 'schedule-interview':
        if (this.interviewFormGroup.invalid) {
          this.interviewFormGroup.markAllAsTouched();
          return;
        }
        apiCall = this.applicationService.scheduleInterview(id, this.interviewFormGroup.value);
        break;
      case 'complete-interview':
        apiCall = this.applicationService.interviewResult(id, { result: 'passed' });
        break;
      case 'hire':
        apiCall = this.applicationService.finalizeApplication(id, { result: 'shortlisted' });
        break;
      default:
        return;
    }

    if (apiCall) {
      this.isSubmitting.set(true);
      apiCall.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(): void {
    this.isSubmitting.set(false);
    this.closeModal();
    this.getApplicants();
  }

  private handleError(error: any): void {
    console.error(error);
    this.isSubmitting.set(false);
  }

  sendOffer(proposal: any): void {
    const payload = { scopeOfWork: '', additionalTerms: '' };
    this.applicationService.sendOffer(proposal.applicationId, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.getApplicants(),
        error: (err) => console.error(err)
      });
  }
}