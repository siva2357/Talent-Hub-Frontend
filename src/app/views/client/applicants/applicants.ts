import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { RecruitmentWorkflow } from '../recruitment-workflow/recruitment-workflow';

import { Button } from '../../../library/ui/components/button/button';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';

import { Applicant } from '../../../core/models/application.model';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [RouterLink, CommonModule, RecruitmentWorkflow, Button, Chip, Badge, InputField, StatCard, Table, Dropdown],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css'
})
export class Applicants implements OnInit, AfterViewInit, OnDestroy {
  applicants: Applicant[] = [];
  filteredApplicants: Applicant[] = [];
  isLoading = true;
  contractId: string | null = null;
  totalApplicants = 0;
  selectedApplicantId: string | null = null;

  columns: TableColumn[] = [];
  statCards: StatCardData[] = [];

  // Filter state
  searchQuery: string = '';
  selectedStatus: string = 'all';
  selectedGender: string = 'all';
  selectedOfferStatus: string = 'all';

  activeFilters: { label: string; type: string; value: string }[] = [];

  // RxJS Subjects
  applicantsSource$ = new BehaviorSubject<Applicant[]>([]);
  searchFilter$ = new BehaviorSubject<string>('');
  statusFilter$ = new BehaviorSubject<string>('all');
  genderFilter$ = new BehaviorSubject<string>('all');
  offerStatusFilter$ = new BehaviorSubject<string>('all');
  private subscription: Subscription = new Subscription();

  statusOptions: InputOption[] = [{ label: 'All Statuses', value: 'all' }];
  genderOptions: InputOption[] = [{ label: 'All Genders', value: 'all' }];
  offerStatusOptions: InputOption[] = [{ label: 'All Offers', value: 'all' }];

  @ViewChild('snoTpl') snoTpl!: TemplateRef<any>;
  @ViewChild('avatarTpl') avatarTpl!: TemplateRef<any>;
  @ViewChild('nameTpl') nameTpl!: TemplateRef<any>;
  @ViewChild('headlineTpl') headlineTpl!: TemplateRef<any>;
  @ViewChild('emailTpl') emailTpl!: TemplateRef<any>;
  @ViewChild('genderTpl') genderTpl!: TemplateRef<any>;
  @ViewChild('cityTpl') cityTpl!: TemplateRef<any>;
  @ViewChild('availabilityTpl') availabilityTpl!: TemplateRef<any>;
  @ViewChild('appStatusTpl') appStatusTpl!: TemplateRef<any>;
  @ViewChild('offerStatusTpl') offerStatusTpl!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTpl!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private applicationService: ApplicationService,
    private masterDataService: MasterDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchMasterData();
    this.setupRxJSFilters();
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      if (this.contractId) {
        this.fetchApplicants();
      } else {
        this.isLoading = false;
      }
    });
  }

  fetchMasterData(): void {
    this.masterDataService.getAllMasterData().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (res.data['ApplicationStatus']) {
            this.statusOptions = [{ label: 'All Statuses', value: 'all' }, ...res.data['ApplicationStatus'].map((o: any) => ({ label: o.value, value: o.key }))];
          }
          if (res.data['Gender']) {
            this.genderOptions = [{ label: 'All Genders', value: 'all' }, ...res.data['Gender'].map((o: any) => ({ label: o.value, value: o.key }))];
          }
          if (res.data['OfferStatus']) {
            this.offerStatusOptions = [{ label: 'All Offers', value: 'all' }, ...res.data['OfferStatus'].map((o: any) => ({ label: o.value, value: o.key }))];
          }
        }
      },
      error: (err) => console.error('Error fetching master data', err)
    });
  }

  fetchApplicants(): void {
    this.isLoading = true;
    this.contractService.getContractApplicants(this.contractId!).subscribe({
      next: (res) => {
        if (res.success) {
          this.applicants = res.applicants.map((app: any, idx: number) => ({
            ...app,
            avatarColor: this.getRandomColor(),
            index: idx
          }));
          this.totalApplicants = res.totalApplicants;
          this.updateStatCards();
          this.applicantsSource$.next(this.applicants);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching applicants:', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    const modalEl = document.getElementById('recruitmentWorkflowModal');
    if (modalEl) {
      modalEl.addEventListener('hidden.bs.modal', () => {
        this.selectedApplicantId = null;
      });
    }

    setTimeout(() => {
      this.columns = [
        { field: 'index', headerName: 'S.NO', cellTemplate: this.snoTpl, width: 70 },
        { field: 'freelancer.profilePhoto', headerName: 'Profile Image', cellTemplate: this.avatarTpl, width: 120 },
        { field: 'freelancer.fullName', headerName: 'Full Name', cellTemplate: this.nameTpl, width: 150 },
        { field: 'freelancer.professionalHeadline', headerName: 'Headline', cellTemplate: this.headlineTpl, width: 200, flexGrow: 1 },
        { field: 'freelancer.email', headerName: 'Email Address', cellTemplate: this.emailTpl, width: 220, flexGrow: 1 },
        { field: 'freelancer.gender', headerName: 'Gender', cellTemplate: this.genderTpl, width: 100 },
        { field: 'freelancer.city', headerName: 'City', cellTemplate: this.cityTpl, width: 120 },
        { field: 'freelancer.availability', headerName: 'Availability', cellTemplate: this.availabilityTpl, width: 120 },
        { field: 'applicationStatus', headerName: 'Application Status', cellTemplate: this.appStatusTpl, width: 180 },
        { field: 'offerStatus', headerName: 'Offer Status', cellTemplate: this.offerStatusTpl, width: 140 },
        { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl, width: 100 }
      ];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setupRxJSFilters(): void {
    this.subscription.add(
      combineLatest([
        this.applicantsSource$,
        this.searchFilter$,
        this.statusFilter$,
        this.genderFilter$,
        this.offerStatusFilter$
      ]).subscribe(([applicants, search, status, gender, offer]) => {
        let filtered = [...applicants];
        this.activeFilters = [];

        if (search && search.trim() !== '') {
          this.activeFilters.push({ label: `Search: ${search}`, type: 'search', value: search });
          const query = search.toLowerCase();
          filtered = filtered.filter(app => 
            app.freelancer?.fullName?.toLowerCase().includes(query) ||
            app.freelancer?.email?.toLowerCase().includes(query) ||
            app.freelancer?.professionalHeadline?.toLowerCase().includes(query)
          );
        }
        if (status !== 'all') {
          this.activeFilters.push({ label: `Status: ${status}`, type: 'status', value: status });
          filtered = filtered.filter(app => app.applicationStatus?.toLowerCase() === status.toLowerCase());
        }
        if (gender !== 'all') {
          this.activeFilters.push({ label: `Gender: ${gender}`, type: 'gender', value: gender });
          filtered = filtered.filter(app => app.freelancer?.gender?.toLowerCase() === gender.toLowerCase());
        }
        if (offer !== 'all') {
          this.activeFilters.push({ label: `Offer: ${offer}`, type: 'offer', value: offer });
          filtered = filtered.filter(app => app.offerStatus?.toLowerCase() === offer.toLowerCase());
        }

        this.filteredApplicants = filtered;
      })
    );
  }

  applyFilters(): void {
    this.searchFilter$.next(this.searchQuery);
    this.statusFilter$.next(this.selectedStatus);
    this.genderFilter$.next(this.selectedGender);
    this.offerStatusFilter$.next(this.selectedOfferStatus);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.selectedGender = 'all';
    this.selectedOfferStatus = 'all';
    this.applyFilters();
  }

  removeFilter(filterToRemove: { label: string; type: string; value: string }): void {
    if (filterToRemove.type === 'search') this.searchQuery = '';
    else if (filterToRemove.type === 'status') this.selectedStatus = 'all';
    else if (filterToRemove.type === 'gender') this.selectedGender = 'all';
    else if (filterToRemove.type === 'offer') this.selectedOfferStatus = 'all';
    this.applyFilters();
  }

  updateStatCards(): void {
    this.statCards = [
      { title: 'Total Applicants', value: this.totalApplicants, icon: 'bi-people' },
      { title: 'Interviews', value: '0', icon: 'bi-camera-video' },
      { title: 'Hired Applicants', value: '0', icon: 'bi-person-check' },
      { title: 'Rejected Applicants', value: '0', icon: 'bi-person-x' }
    ];
  }

  getStatusBadgeVariant(status: string): 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus === 'hired' || lowerStatus === 'accepted') return 'success';
    if (lowerStatus === 'application submitted' || lowerStatus === 'shortlisted' || lowerStatus === 'pending') return 'warning';
    if (lowerStatus.includes('interview') || lowerStatus === 'interviewing' || lowerStatus === 'sent') return 'primary';
    if (lowerStatus.includes('assessment')) return 'info';
    if (lowerStatus === 'rejected' || lowerStatus === 'declined') return 'danger';
    return 'secondary';
  }

  getRandomColor(): string {
    const colors = ['#5a5ce8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getAvailabilityString(availability: any): string {
    if (Array.isArray(availability)) {
      return availability.length > 0 ? availability[0] : 'Not specified';
    }
    return availability || 'Not specified';
  }

  getDropdownItems(row: any): DropdownItem[] {
    const items = [
      { label: 'View Profile', value: 'profile', icon: 'bi bi-eye' },
      { label: 'Recruitment Workflow', value: 'workflow', icon: 'bi bi-diagram-3' }
    ];

    if (row.applicationStatus && row.applicationStatus.toLowerCase() === 'hired') {
      items.push({ label: 'Send Offer', value: 'offer', icon: 'bi bi-check-circle' });
    }

    return items;
  }

  onDropdownAction(event: DropdownItem, row: any): void {
    if (event.value === 'profile') {
      this.router.navigate(['/profile']);
    } else if (event.value === 'workflow') {
      this.openRecruitmentWorkflow(row.applicationId);
      document.getElementById('hiddenWorkflowBtn')?.click();
    } else if (event.value === 'offer') {
      this.router.navigate(['/legal-contract-page', row.applicationId]);
    }
  }

  openRecruitmentWorkflow(applicantId: string): void {
    this.selectedApplicantId = applicantId;
  }
}
