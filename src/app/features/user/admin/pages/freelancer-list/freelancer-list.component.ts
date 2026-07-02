import { Component, HostListener, OnInit, TemplateRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, FreelancerData } from '../../../../../core/services/admin.service';
import { Table } from "../../../../../shared/components/table/table.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { FormsModule } from '@angular/forms';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DropdownComponent, DropdownAction } from '../../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [CommonModule, Table, ButtonComponent, InputComponent, FormsModule, BadgeComponent, DropdownComponent],
  templateUrl: './freelancer-list.component.html',
  styleUrl: './freelancer-list.component.css'
})
export class FreelancerListComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  DateTimeHelper = DateTimeHelper;

  freelancers = signal<FreelancerData[]>([]);
  searchTerm = signal<string>('');
  statusFilter = signal<'All' | 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'>('All');

  filteredFreelancers = computed(() => {
    return this.freelancers().filter(f => {
      const term = this.searchTerm().toLowerCase();
      const matchesSearch = f.name.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term);

      const status = this.statusFilter();
      const matchesStatus = status === 'All' || f.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  // Modal overlay variable
  selectedFreelancer = signal<FreelancerData | null>(null);

  ngOnInit(): void {
    this.columns = [
      { name: 'Profile Image', prop: 'profileImage', width: 120, cellTemplate: this.profileImageTemplate, sortable: false },
      { name: 'Full Name', prop: 'name', width: 200 },
      { name: 'Email', prop: 'email', width: 280 },
      { name: 'Phone', prop: 'phoneNumber', width: 180 },
      { name: 'Title', prop: 'title', width: 220 },
      { name: 'Status', prop: 'status', width: 140, cellTemplate: this.statusTemplate },
      { name: 'Actions', prop: 'actions', width: 100, sortable: false, cellTemplate: this.actionTemplate }
    ];
    this.loadFreelancers();
  }

  loadFreelancers(): void {
    this.adminService.getFreelancers().subscribe({
      next: (data) => {
        this.freelancers.set(data);
      }
    });
  }

  onFilterStatus(status: 'All' | 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'): void {
    this.statusFilter.set(status);
  }

  changeFreelancerStatus(id: string, status: 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'): void {
    this.adminService.updateFreelancerStatus(id, status).subscribe({
      next: () => {
        this.loadFreelancers();
        const selected = this.selectedFreelancer();
        if (selected && selected.id === id) {
          this.selectedFreelancer.update(f => f ? { ...f, status } : null);
        }
      }
    });
  }

  approveFreelancer(id: string): void {
    this.adminService.approveFreelancer(id).subscribe({
      next: () => {
        this.loadFreelancers();
        const selected = this.selectedFreelancer();
        if (selected && selected.id === id) {
          this.selectedFreelancer.update(f => f ? { ...f, status: 'Active' } : null);
        }
      }
    });
  }

  viewProfile(freelancer: FreelancerData): void {
    this.router.navigate(['/user/profile', freelancer.id]);
  }

  closeProfileModal(): void {
    this.selectedFreelancer.set(null);
  }

  @ViewChild('profileImageTemplate', { static: true })
  profileImageTemplate!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  columns: any[] = [];

  ngAfterViewInit(): void {
  }

  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Pending Approval', value: 'Pending Approval' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Deactivated', value: 'Deactivated' }
  ];

  getActions(freelancer: FreelancerData): DropdownAction[] {
    const actions: DropdownAction[] = [
      { label: 'View Profile', value: 'view', icon: 'bi bi-eye text-primary' }
    ];

    if (freelancer.status === 'Pending Approval') {
      actions.push({ label: 'Approve Profile', value: 'Approve', icon: 'bi bi-check-lg text-success' });
      actions.push({ label: 'Block / Reject', value: 'Blocked', icon: 'bi bi-slash-circle text-danger' });
    } else {
      if (freelancer.status === 'Blocked') {
        actions.push({ label: 'Unblock Account', value: 'Active', icon: 'bi bi-shield-check text-success' });
      } else {
        actions.push({ label: 'Block Account', value: 'Blocked', icon: 'bi bi-shield-slash text-warning' });
      }

      if (freelancer.status === 'Active') {
        actions.push({ label: 'Deactivate', value: 'Deactivated', icon: 'bi bi-pause-circle text-danger' });
      } else if (freelancer.status === 'Deactivated' || freelancer.status === 'Suspended') {
        actions.push({ label: 'Activate', value: 'Active', icon: 'bi bi-play-circle text-success' });
      }
    }
    return actions;
  }

  handleAction(actionValue: string, freelancer: FreelancerData) {
    if (actionValue === 'view') {
      this.viewProfile(freelancer);
    } else if (actionValue === 'Approve') {
      this.approveFreelancer(freelancer.id);
    } else {
      this.changeFreelancerStatus(freelancer.id, actionValue as any);
    }
  }
}
