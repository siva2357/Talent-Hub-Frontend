import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Dropdown, DropdownItem } from "../../../library/ui/components/dropdown/dropdown";

@Component({
  selector: 'app-freelancer-management',
  standalone: true,
  imports: [CommonModule, Table, Badge, Button, FormsModule, InputField, Chip, Dropdown],
  templateUrl: './freelancer-management.html',
  styleUrl: './freelancer-management.css'
})
export class FreelancerManagement implements OnInit, AfterViewInit {
  freelancers: any[] = [];
  totalContracts: number = 0;

  columns: TableColumn[] = [];

  @ViewChild('indexTpl') indexTpl!: TemplateRef<any>;
  @ViewChild('profileTpl') profileTpl!: TemplateRef<any>;
  @ViewChild('fullNameTpl') fullNameTpl!: TemplateRef<any>;
  @ViewChild('emailTpl') emailTpl!: TemplateRef<any>;
  @ViewChild('phoneTpl') phoneTpl!: TemplateRef<any>;
  @ViewChild('jobTitleTpl') jobTitleTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl') actionsTpl!: TemplateRef<any>;
  
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadFreelancers();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: 'id', headerName: 'S.No', cellTemplate: this.indexTpl },
        { field: 'profile', headerName: 'Profile', cellTemplate: this.profileTpl },
        { field: 'name', headerName: 'Full Name', cellTemplate: this.fullNameTpl },
        { field: 'email', headerName: 'Email', cellTemplate: this.emailTpl },
        { field: 'phone', headerName: 'Phone', cellTemplate: this.phoneTpl },
        { field: 'title', headerName: 'Job Title', cellTemplate: this.jobTitleTpl },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl },
        { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl }
      ];
    });
  }

  rawFreelancers: any[] = [];
  searchQuery: string = '';
  selectedStatus: string = 'All Statuses';
  statusOptions: { label: string, value: string }[] = [
    { label: 'All Statuses', value: 'All Statuses' },
    { label: 'Active', value: 'Active' },
    { label: 'Pending Approval', value: 'Pending Approval' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Deactivated', value: 'Deactivated' }
  ];
  activeFilters: { key: string, label: string, value: any }[] = [];

  loadFreelancers() {
    this.adminService.getAllFreelancers().subscribe({
      next: (res) => {
        this.rawFreelancers = res || [];
        this.totalContracts = this.rawFreelancers.reduce((acc, freelancer) => acc + (freelancer.completedProjects || 0), 0);
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching freelancers', err)
    });
  }

  applyFilters(): void {
    this.activeFilters = [];
    if (this.searchQuery) {
      this.activeFilters.push({ key: 'search', label: `Search: ${this.searchQuery}`, value: this.searchQuery });
    }
    if (this.selectedStatus && this.selectedStatus !== 'All Statuses') {
      this.activeFilters.push({ key: 'status', label: `Status: ${this.selectedStatus}`, value: this.selectedStatus });
    }

    let filtered = [...this.rawFreelancers];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q)) ||
        (f.id && String(f.id).toLowerCase().includes(q))
      );
    }

    if (this.selectedStatus && this.selectedStatus !== 'All Statuses') {
      filtered = filtered.filter(f => f.status === this.selectedStatus);
    }

    this.freelancers = filtered;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All Statuses';
    this.applyFilters();
  }

  removeFilter(filter: any): void {
    if (filter.key === 'search') this.searchQuery = '';
    if (filter.key === 'status') this.selectedStatus = 'All Statuses';
    this.applyFilters();
  }

  updateStatus(freelancerId: string, newStatus: string) {
    this.adminService.updateFreelancerStatus(freelancerId, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadFreelancers();
        }
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  approveFreelancer(freelancerId: string) {
    this.adminService.approveFreelancer(freelancerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadFreelancers();
        }
      },
      error: (err) => console.error('Error approving freelancer', err)
    });
  }

  getActionItems(freelancer: any): DropdownItem[] {
    const items: DropdownItem[] = [
      { label: 'View', value: 'view', icon: 'bi-eye text-primary' }
    ];

    if (freelancer.status === 'Pending Approval') {
      items.push({ label: 'Approve', value: 'Approve', icon: 'bi-person-check text-primary' });
    }
    if (freelancer.status !== 'Active' && freelancer.status !== 'Pending Approval') {
      items.push({ label: 'Activate', value: 'Active', icon: 'bi-check-circle text-success' });
    }
    if (freelancer.status === 'Active') {
      items.push({ label: 'Suspend', value: 'Suspended', icon: 'bi-pause-circle text-warning' });
    }
    if (freelancer.status !== 'Blocked' && freelancer.status !== 'Deactivated') {
      items.push({ label: 'Block', value: 'Blocked', icon: 'bi-slash-circle text-danger' });
    }
    if (freelancer.status !== 'Deactivated') {
      items.push({ label: 'Deactivate', value: 'Deactivated', icon: 'bi-trash text-danger' });
    }

    return items;
  }

  onActionSelected(event: DropdownItem, freelancer: any) {
    if (event.value === 'view') {
      // Logic for view if any
    } else if (event.value === 'Approve') {
      this.approveFreelancer(freelancer.id);
    } else {
      this.updateStatus(freelancer.id, event.value);
    }
  }

  getBadgeVariant(status: string): any {
    if (status === 'Active') return 'success';
    if (status === 'Suspended') return 'danger';
    return 'warning';
  }
}
