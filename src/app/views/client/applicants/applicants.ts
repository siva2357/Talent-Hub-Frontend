import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { ApplicationService } from '../../../core/services/application.service';
import { RecruitmentWorkflow } from '../recruitment-workflow/recruitment-workflow';

import { Button } from '../../../library/ui/components/button/button';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Badge } from '../../../library/ui/components/badge/badge';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';

interface Applicant {
  applicationId: string;
  applicationStatus: string;
  offerStatus: string;
  freelancer: {
    _id: string;
    fullName: string;
    email: string;
    gender: string;
    availability: string[] | string;
    profilePhoto?: string;
    city?: string;
    professionalHeadline?: string;
  };
  avatarColor?: string;
  index?: number;
}

@Component({
  selector: 'app-applicants',
  imports: [RouterLink, CommonModule, RecruitmentWorkflow, Button, Chip, Badge, InputField, StatCard, Table, Dropdown],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css'
})
export class Applicants implements OnInit, AfterViewInit {
  applicants: Applicant[] = [];
  isLoading = true;
  contractId: string | null = null;
  totalApplicants = 0;
  selectedApplicantId: string | null = null;

  columns: TableColumn[] = [];
  statCards: StatCardData[] = [];

  activeFilters: { label: string; value: string }[] = [
    { label: 'Role: Frontend Developer', value: 'frontend' }
  ];

  tagOptions = [
    { label: 'Select All', value: 'all' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' }
  ];

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      if (this.contractId) {
        this.fetchApplicants();
      } else {
        this.isLoading = false;
      }
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

  updateStatCards(): void {
    this.statCards = [
      { title: 'Total Applicants', value: this.totalApplicants, icon: 'bi-people' },
      { title: 'Interviews', value: '0', icon: 'bi-camera-video' },
      { title: 'Hired Applicants', value: '0', icon: 'bi-person-check' },
      { title: 'Rejected Applicants', value: '0', icon: 'bi-person-x' }
    ];
  }

  removeFilter(filterToRemove: { label: string; value: string }) {
    this.activeFilters = this.activeFilters.filter(f => f.value !== filterToRemove.value);
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
