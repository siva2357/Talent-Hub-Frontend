import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/ui/modal.service';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Dropdown, DropdownItem } from "../../../library/ui/components/dropdown/dropdown";
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-freelancer-management',
  standalone: true,
  imports: [CommonModule, Table, Badge, Button, FormsModule, InputField, Chip, Dropdown, Pagination],
  templateUrl: './freelancer-management.html',
  styleUrl: './freelancer-management.css'
})
export class FreelancerManagement implements OnInit, AfterViewInit, OnDestroy {
  totalContracts: number = 0;
  columns: TableColumn[] = [];

  @ViewChild('indexTpl') indexTpl!: TemplateRef<any>;
  @ViewChild('profileTpl') profileTpl!: TemplateRef<any>;
  @ViewChild('fullNameTpl') fullNameTpl!: TemplateRef<any>;
  @ViewChild('emailTpl') emailTpl!: TemplateRef<any>;
  @ViewChild('jobTitleTpl') jobTitleTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl') actionsTpl!: TemplateRef<any>;

  rawFreelancers$ = new BehaviorSubject<any[]>([]);
  searchQuery$ = new BehaviorSubject<string>('');
  selectedStatus$ = new BehaviorSubject<string>('All Statuses');

  tempSearchQuery = '';
  tempSelectedStatus = 'All Statuses';

  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);

  freelancers$!: Observable<any[]>;
  paginatedFreelancers$!: Observable<any[]>;
  activeFilters: { key: string, label: string, value: any }[] = [];

  statusOptions: any[] = [];

  constructor(
    private adminService: AdminService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.freelancers$ = combineLatest([
      this.rawFreelancers$,
      this.searchQuery$.pipe(debounceTime(300)),
      this.selectedStatus$
    ]).pipe(
      map(([rawFreelancers, search, status]) => {
        let filtered = [...rawFreelancers];

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(f =>
            (f.name && f.name.toLowerCase().includes(q)) ||
            (f.email && f.email.toLowerCase().includes(q)) ||
            (f.id && String(f.id).toLowerCase().includes(q))
          );
        }

        if (status && status !== 'All Statuses') {
          filtered = filtered.filter(f => f.status === status);
        }

        this.updateActiveFilters(search, status);
        return filtered;
      })
    );

    this.paginatedFreelancers$ = combineLatest([
      this.freelancers$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([filtered, page, size]) => {
        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
      })
    );

    this.fetchStatusOptions();
    this.loadFreelancers();
  }

  fetchStatusOptions() {
    this.adminService.getUserStatusOptions().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.statusOptions = res;
        }
      },
      error: (err) => console.error('Error fetching user status options', err)
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: 'id', headerName: 'S.No', cellTemplate: this.indexTpl },
        { field: 'profile', headerName: 'Profile', cellTemplate: this.profileTpl },
        { field: 'name', headerName: 'Full Name', cellTemplate: this.fullNameTpl },
        { field: 'email', headerName: 'Email', cellTemplate: this.emailTpl },
        { field: 'title', headerName: 'Job Title', cellTemplate: this.jobTitleTpl },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl },
        { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl }
      ];
    });
  }

  ngOnDestroy() { }

  loadFreelancers() {
    this.adminService.getAllFreelancers().subscribe({
      next: (res) => {
        const raw = res || [];
        this.rawFreelancers$.next(raw);
        this.totalContracts = raw.reduce((acc: number, freelancer: any) => acc + (freelancer.completedProjects || 0), 0);
      },
      error: (err) => console.error('Error fetching freelancers', err)
    });
  }

  updateActiveFilters(search: string, status: string) {
    this.activeFilters = [];
    if (search) this.activeFilters.push({ key: 'search', label: `Search: ${search}`, value: search });
    if (status && status !== 'All Statuses') this.activeFilters.push({ key: 'status', label: `Status: ${status}`, value: status });
  }

  onSearchChange(val: string) { this.tempSearchQuery = val; }
  onStatusChange(val: string) { this.tempSelectedStatus = val; }

  applyFilters() {
    this.searchQuery$.next(this.tempSearchQuery);
    this.selectedStatus$.next(this.tempSelectedStatus);
    this.currentPage$.next(1);
  }

  resetFilters(): void {
    this.tempSearchQuery = '';
    this.tempSelectedStatus = 'All Statuses';
    this.searchQuery$.next('');
    this.selectedStatus$.next('All Statuses');
    this.currentPage$.next(1);
  }

  removeFilter(filter: any): void {
    if (filter.key === 'search') {
      this.tempSearchQuery = '';
      this.searchQuery$.next('');
      this.currentPage$.next(1);
    }
    if (filter.key === 'status') {
      this.tempSelectedStatus = 'All Statuses';
      this.selectedStatus$.next('All Statuses');
      this.currentPage$.next(1);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize$.next(size);
    this.currentPage$.next(1);
  }

  async updateStatus(freelancerId: string, newStatus: string) {
    let message = `Are you sure you want to change the status to ${newStatus}?`;
    let confirmLabel = 'Update Status';
    let confirmVariant: any = 'primary';
    let icon = 'bi bi-info-circle';
    let iconVariant: any = 'primary';

    if (newStatus === 'Suspended') {
      message = 'Are you sure you want to suspend this freelancer? Their active applications and projects may be paused.';
      confirmLabel = 'Suspend';
      confirmVariant = 'warning';
      icon = 'bi bi-pause-circle';
      iconVariant = 'warning';
    } else if (newStatus === 'Blocked') {
      message = 'Are you sure you want to block this freelancer? They will not be able to log in or apply to any contracts.';
      confirmLabel = 'Block Freelancer';
      confirmVariant = 'danger';
      icon = 'bi bi-slash-circle';
      iconVariant = 'danger';
    } else if (newStatus === 'Deactivated') {
      message = 'Are you sure you want to deactivate this account? This action disables their profile on the platform.';
      confirmLabel = 'Deactivate';
      confirmVariant = 'danger';
      icon = 'bi bi-trash';
      iconVariant = 'danger';
    } else if (newStatus === 'Active') {
      message = 'Are you sure you want to activate this freelancer? They will be granted full platform access.';
      confirmLabel = 'Activate';
      confirmVariant = 'success';
      icon = 'bi bi-check-circle';
      iconVariant = 'success';
    }

    const confirmed = await this.modalService.confirm({
      title: `${newStatus} Freelancer`,
      message,
      confirmLabel,
      confirmVariant,
      icon,
      iconVariant
    });

    if (confirmed) {
      this.adminService.updateFreelancerStatus(freelancerId, newStatus).subscribe({
        next: (res) => {
          if (res.success) this.loadFreelancers();
        },
        error: (err) => console.error('Error updating status', err)
      });
    }
  }

  async approveFreelancer(freelancerId: string) {
    const confirmed = await this.modalService.confirm({
      title: 'Approve Freelancer',
      message: 'Are you sure you want to approve this freelancer? Their account will become Active immediately.',
      confirmLabel: 'Approve Account',
      confirmVariant: 'success',
      icon: 'bi bi-person-check',
      iconVariant: 'success'
    });

    if (confirmed) {
      this.adminService.approveFreelancer(freelancerId).subscribe({
        next: (res) => {
          if (res.success) this.loadFreelancers();
        },
        error: (err) => console.error('Error approving freelancer', err)
      });
    }
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

  viewFreelancer(freelancer: any): void {
    const viewItem = this.getActionItems(freelancer)
      .find(item => item.value === 'view');

    if (viewItem) {
      this.onActionSelected(viewItem, freelancer);
    }
  }

}
