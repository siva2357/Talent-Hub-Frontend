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

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [CommonModule, Table, ButtonComponent, InputComponent, FormsModule, BadgeComponent],
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

  activeActionRow: FreelancerData | null = null;
  menuTop: number = 0;
  menuLeft: number = 0;

  toggleActionMenu(event: MouseEvent, row: FreelancerData): void {
    event.stopPropagation();
    if (this.activeActionRow && this.activeActionRow.id === row.id) {
      this.closeActionMenu();
    } else {
      this.activeActionRow = row;
      const target = (event.currentTarget as HTMLElement).closest('.action-trigger') || event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      this.menuTop = rect.bottom + window.scrollY + 8;
      this.menuLeft = rect.right + window.scrollX - 220;
    }
  }

  closeActionMenu(): void {
    this.activeActionRow = null;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.activeActionRow) {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-menu') && !target.closest('.action-trigger')) {
        this.closeActionMenu();
      }
    }
  }
}
