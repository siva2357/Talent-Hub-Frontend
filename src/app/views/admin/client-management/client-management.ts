import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ModalService } from '../../../core/services/ui/modal.service';
import { Table } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { TableColumn } from '../../../core/models/ui.model';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, Table, Badge, Button, FormsModule, InputField, Chip, Dropdown, Pagination],
  templateUrl: './client-management.html',
  styleUrl: './client-management.css'
})
export class ClientManagement implements OnInit, AfterViewInit, OnDestroy {
  totalContracts: number = 0;
  columns: TableColumn[] = [];

  @ViewChild('indexTpl') indexTpl!: TemplateRef<any>;
  @ViewChild('profileTpl') profileTpl!: TemplateRef<any>;
  @ViewChild('fullNameTpl') fullNameTpl!: TemplateRef<any>;
  @ViewChild('emailTpl') emailTpl!: TemplateRef<any>;
  @ViewChild('industryTpl') industryTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl') actionsTpl!: TemplateRef<any>;

  rawClients$ = new BehaviorSubject<any[]>([]);
  searchQuery$ = new BehaviorSubject<string>('');
  selectedStatus$ = new BehaviorSubject<string>('All Statuses');

  tempSearchQuery = '';
  tempSelectedStatus = 'All Statuses';

  currentPage$ = new BehaviorSubject<number>(1);
  pageSize$ = new BehaviorSubject<number>(10);

  clients$!: Observable<any[]>;
  paginatedClients$!: Observable<any[]>;
  activeFilters: { key: string, label: string, value: any }[] = [];

  statusOptions: any[] = [];

  constructor(
    private adminService: AdminService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.clients$ = combineLatest([
      this.rawClients$,
      this.searchQuery$.pipe(debounceTime(300)),
      this.selectedStatus$
    ]).pipe(
      map(([rawClients, search, status]) => {
        let filtered = [...rawClients];

        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(c =>
            (c.name && c.name.toLowerCase().includes(q)) ||
            (c.email && c.email.toLowerCase().includes(q)) ||
            (c.id && String(c.id).toLowerCase().includes(q))
          );
        }

        if (status && status !== 'All Statuses') {
          filtered = filtered.filter(c => c.status === status);
        }

        this.updateActiveFilters(search, status);
        return filtered;
      })
    );

    this.paginatedClients$ = combineLatest([
      this.clients$,
      this.currentPage$,
      this.pageSize$
    ]).pipe(
      map(([filtered, page, size]) => {
        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
      })
    );

    this.fetchStatusOptions();
    this.loadClients();
  }

  fetchStatusOptions() {
    this.adminService.getUserStatusOptions().subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.statusOptions = res.filter(o => o.value !== 'Pending Approval'); // Clients don't have Pending Approval
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
        { field: 'industry', headerName: 'Industry', cellTemplate: this.industryTpl },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl },
        { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl }
      ];
    });
  }

  ngOnDestroy() { }

  loadClients() {
    this.adminService.getAllClients().subscribe({
      next: (res) => {
        const raw = res || [];
        this.rawClients$.next(raw);
        this.totalContracts = raw.reduce((acc: number, client: any) => acc + (client.projectsCount || 0), 0);
      },
      error: (err) => console.error('Error fetching clients', err)
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

  async updateStatus(clientId: string, newStatus: string) {
    let message = `Are you sure you want to change the status to ${newStatus}?`;
    let confirmLabel = 'Update Status';
    let confirmVariant: any = 'primary';
    let icon = 'bi bi-info-circle';
    let iconVariant: any = 'primary';

    if (newStatus === 'Suspended') {
      message = 'Are you sure you want to suspend this client? Their contracts and posting ability may be paused.';
      confirmLabel = 'Suspend';
      confirmVariant = 'warning';
      icon = 'bi bi-pause-circle';
      iconVariant = 'warning';
    } else if (newStatus === 'Blocked') {
      message = 'Are you sure you want to block this client? They will not be able to log in or create contracts.';
      confirmLabel = 'Block Client';
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
      message = 'Are you sure you want to activate this client? They will be granted full platform access.';
      confirmLabel = 'Activate';
      confirmVariant = 'success';
      icon = 'bi bi-check-circle';
      iconVariant = 'success';
    }

    const confirmed = await this.modalService.confirm({
      title: `${newStatus} Client`,
      message,
      confirmLabel,
      confirmVariant,
      icon,
      iconVariant
    });

    if (confirmed) {
      this.adminService.updateClientStatus(clientId, newStatus).subscribe({
        next: (res) => {
          if (res.success) this.loadClients();
        },
        error: (err) => console.error('Error updating status', err)
      });
    }
  }

  getActionItems(client: any): DropdownItem[] {
    const items: DropdownItem[] = [
      { label: 'View', value: 'view', icon: 'bi-eye text-primary' }
    ];
    if (client.status !== 'Active') {
      items.push({ label: 'Activate', value: 'Active', icon: 'bi-check-circle text-success' });
    }
    if (client.status === 'Active') {
      items.push({ label: 'Suspend', value: 'Suspended', icon: 'bi-pause-circle text-warning' });
    }
    if (client.status !== 'Blocked' && client.status !== 'Deactivated') {
      items.push({ label: 'Block', value: 'Blocked', icon: 'bi-slash-circle text-danger' });
    }
    if (client.status !== 'Deactivated') {
      items.push({ label: 'Deactivate', value: 'Deactivated', icon: 'bi-trash text-danger' });
    }
    return items;
  }

  onActionSelected(event: DropdownItem, client: any) {
    if (event.value === 'view') {
      // Logic for view if any
    } else {
      this.updateStatus(client.id, event.value);
    }
  }

  getBadgeVariant(status: string): any {
    if (status === 'Active') return 'success';
    if (status === 'Suspended') return 'danger';
    return 'warning';
  }


  viewClient(client: any): void {
    const viewItem: DropdownItem = {
      label: 'View',
      value: 'view',
      icon: 'bi-eye text-primary'
    };

    this.onActionSelected(viewItem, client);
  }
}
