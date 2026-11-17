import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';
import { Modal } from '../../../library/ui/components/modal/modal';
import { JobApplicationRecord } from '../../../core/models/job.model';

export const STATIC_JOB_APPLICATIONS: JobApplicationRecord[] = [
  {
    applicationId: 'APP-WS-901',
    jobId: 'ws-job-101',
    jobCode: 'WS-TN-1042',
    jobTitle: 'Principal Frontend Engineer (Angular)',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=4a3aff&color=fff&bold=true&size=128',
    department: 'Product Engineering',
    workMode: 'Hybrid',
    employmentType: 'Full-Time',
    salaryRange: '₹28 LPA - ₹36 LPA',
    appliedDate: '2026-11-12',
    portalSource: 'Worksphere Enterprise',
    jobStatus: 'Open',
    applicationStatus: 'Interview Scheduled'
  },
  {
    applicationId: 'APP-WS-902',
    jobId: 'ws-job-103',
    jobCode: 'WS-FE-1104',
    jobTitle: 'Full Stack Lead Engineer',
    companyName: 'FinEdge Corp',
    companyLogo: 'https://ui-avatars.com/api/?name=Fin+Edge&background=059669&color=fff&bold=true&size=128',
    department: 'Digital Banking',
    workMode: 'Hybrid',
    employmentType: 'Full-Time',
    salaryRange: '₹30 LPA - ₹40 LPA',
    appliedDate: '2026-11-05',
    portalSource: 'Worksphere FinTech Hub',
    jobStatus: 'Open',
    applicationStatus: 'Offer Released'
  },
  {
    applicationId: 'APP-WS-903',
    jobId: 'ws-job-102',
    jobCode: 'WS-CS-1088',
    jobTitle: 'Senior Cloud & Backend Architect',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://ui-avatars.com/api/?name=Cloud+Scale&background=0284c7&color=fff&bold=true&size=128',
    department: 'Cloud Infrastructure',
    workMode: 'Remote',
    employmentType: 'Full-Time',
    salaryRange: '₹24 LPA - ₹32 LPA',
    appliedDate: '2026-11-14',
    portalSource: 'Worksphere Enterprise',
    jobStatus: 'Open',
    applicationStatus: 'Assessment Assigned'
  },
  {
    applicationId: 'APP-WS-904',
    jobId: 'ws-job-104',
    jobCode: 'WS-AA-1129',
    jobTitle: 'AI Product Engineer (LLM & Web)',
    companyName: 'Aether AI Labs',
    companyLogo: 'https://ui-avatars.com/api/?name=Aether+AI&background=7c3aed&color=fff&bold=true&size=128',
    department: 'Applied AI',
    workMode: 'Remote',
    employmentType: 'Full-Time',
    salaryRange: '₹22 LPA - ₹30 LPA',
    appliedDate: '2026-11-15',
    portalSource: 'Worksphere AI Partner',
    jobStatus: 'Open',
    applicationStatus: 'Shortlisted'
  },
  {
    applicationId: 'APP-WS-905',
    jobId: 'ws-job-105',
    jobCode: 'WS-NX-1150',
    jobTitle: 'Staff UI/UX & Design Systems Engineer',
    companyName: 'NexaVerse Commerce',
    companyLogo: 'https://ui-avatars.com/api/?name=Nexa+Verse&background=ea580c&color=fff&bold=true&size=128',
    department: 'Design Engineering',
    workMode: 'On-site',
    employmentType: 'Full-Time',
    salaryRange: '₹20 LPA - ₹27 LPA',
    appliedDate: '2026-11-10',
    portalSource: 'Worksphere Retail Portal',
    jobStatus: 'Open',
    applicationStatus: 'Application Submitted'
  },
  {
    applicationId: 'APP-WS-906',
    jobId: 'ws-job-106',
    jobCode: 'WS-HL-1172',
    jobTitle: 'Full Stack Software Engineer',
    companyName: 'HealthPulse Diagnostics',
    companyLogo: 'https://ui-avatars.com/api/?name=Health+Pulse&background=dc2626&color=fff&bold=true&size=128',
    department: 'Connected Health',
    workMode: 'Hybrid',
    employmentType: 'Contract-to-Hire',
    salaryRange: '₹16 LPA - ₹22 LPA',
    appliedDate: '2026-11-02',
    portalSource: 'Worksphere Health Portal',
    jobStatus: 'Closed',
    applicationStatus: 'Rejected'
  }
];

@Component({
  selector: 'app-my-applications-page',
  standalone: true,
  imports: [CommonModule, Table, InputField, Chip, Button, Badge, Dropdown, Modal],
  templateUrl: './my-applications-page.html',
  styleUrl: './my-applications-page.css'
})
export class MyApplicationsPage implements OnInit, AfterViewInit {
  allApplications: JobApplicationRecord[] = [];
  filteredApplications: JobApplicationRecord[] = [];
  selectedApplication: JobApplicationRecord | null = null;
  pendingWithdrawApp: JobApplicationRecord | null = null;
  isWithdrawModalOpen: boolean = false;
  isLoading: boolean = false;
  actionMessage: string | null = null;

  searchQuery: string = '';
  selectedAppStatus: string = 'all';
  selectedJobStatus: string = 'all';

  activeFilters: string[] = ['Worksphere Direct', 'Active Applications'];

  appStatusOptions: InputOption[] = [
    { label: 'All Application Statuses', value: 'all' },
    { label: 'Application Submitted', value: 'Application Submitted' },
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Assessment Assigned', value: 'Assessment Assigned' },
    { label: 'Interview Scheduled', value: 'Interview Scheduled' },
    { label: 'Offer Released', value: 'Offer Released' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Withdrawn', value: 'Withdrawn' }
  ];

  jobStatusOptions: InputOption[] = [
    { label: 'All Job Statuses', value: 'all' },
    { label: 'Open', value: 'Open' },
    { label: 'Closed', value: 'Closed' }
  ];

  @ViewChild('snoTemplate', { static: true }) snoTemplate!: TemplateRef<any>;
  @ViewChild('companyLogoTemplate', { static: true }) companyLogoTemplate!: TemplateRef<any>;
  @ViewChild('appliedDateTemplate', { static: true }) appliedDateTemplate!: TemplateRef<any>;
  @ViewChild('appStatusTemplate', { static: true }) appStatusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [
    { field: 'sno', headerName: 'S.NO', width: 70 },
    { field: 'companyLogo', headerName: 'Company Logo', width: 120 },
    { field: 'companyName', headerName: 'Company Name' },
    { field: 'jobCode', headerName: 'Job ID' },
    { field: 'jobTitle', headerName: 'Job Title' },
    { field: 'employmentType', headerName: 'Job Type' },
    { field: 'appliedDate', headerName: 'Applied Date' },
    { field: 'applicationStatus', headerName: 'Application Status' },
    { field: 'actions', headerName: 'Actions', width: 100 }
  ];

  constructor() {}

  ngOnInit(): void {
    this.allApplications = STATIC_JOB_APPLICATIONS.map(app => ({ ...app }));
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns[0].cellTemplate = this.snoTemplate;
      this.columns[1].cellTemplate = this.companyLogoTemplate;
      this.columns[6].cellTemplate = this.appliedDateTemplate;
      this.columns[7].cellTemplate = this.appStatusTemplate;
      this.columns[8].cellTemplate = this.actionsTemplate;
    });
  }

  applyFilters(): void {
    this.filteredApplications = this.allApplications.filter(app => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        app.jobTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.jobCode.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesAppStatus =
        this.selectedAppStatus === 'all' || app.applicationStatus === this.selectedAppStatus;

      const matchesJobStatus =
        this.selectedJobStatus === 'all' || app.jobStatus === this.selectedJobStatus;

      return matchesSearch && matchesAppStatus && matchesJobStatus;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedAppStatus = 'all';
    this.selectedJobStatus = 'all';
    this.activeFilters = ['Worksphere Direct', 'Active Applications'];
    this.applyFilters();
  }

  removeFilter(filterToRemove: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filterToRemove);
  }

  getJobStatusVariant(status: string): 'success' | 'danger' | 'secondary' {
    if (status === 'Open') return 'success';
    if (status === 'Closed') return 'danger';
    return 'secondary';
  }

  getAppStatusVariant(
    status: string
  ): 'success' | 'primary' | 'secondary' | 'warning' | 'danger' | 'info' | 'purple' {
    switch (status) {
      case 'Offer Released':
        return 'success';
      case 'Interview Scheduled':
        return 'primary';
      case 'Assessment Assigned':
        return 'warning';
      case 'Shortlisted':
        return 'info';
      case 'Application Submitted':
        return 'purple';
      case 'Rejected':
      case 'Withdrawn':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getDropdownItems(row: JobApplicationRecord): DropdownItem[] {
    const items: DropdownItem[] = [
      { label: 'View Application', value: 'view', icon: 'bi bi-eye text-primary' }
    ];

    if (
      row.applicationStatus !== 'Withdrawn' &&
      row.applicationStatus !== 'Rejected' &&
      row.applicationStatus !== 'Offer Released'
    ) {
      items.push({
        label: 'Withdraw Application',
        value: 'withdraw',
        icon: 'bi bi-x-circle text-danger',
        className: 'dropdown-item-danger'
      });
    }

    return items;
  }

  onDropdownAction(item: DropdownItem, row: JobApplicationRecord): void {
    if (item.value === 'view') {
      this.viewApplication(row);
    } else if (item.value === 'withdraw') {
      this.openWithdrawModal(row);
    }
  }

  viewApplication(row: JobApplicationRecord): void {
    this.selectedApplication = row;
    document.getElementById('openApplicationOffcanvasBtn')?.click();
  }

  openWithdrawModal(row: JobApplicationRecord): void {
    this.pendingWithdrawApp = row;
    this.isWithdrawModalOpen = true;
  }

  closeWithdrawModal(): void {
    this.isWithdrawModalOpen = false;
    this.pendingWithdrawApp = null;
  }

  confirmWithdrawApplication(): void {
    if (!this.pendingWithdrawApp) return;
    this.pendingWithdrawApp.applicationStatus = 'Withdrawn';
    this.filteredApplications = [...this.filteredApplications];
    this.actionMessage = `Your application for "${this.pendingWithdrawApp.jobTitle}" at ${this.pendingWithdrawApp.companyName} has been withdrawn.`;
    this.closeWithdrawModal();
  }
}
