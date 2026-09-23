import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Table } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';
import { Pagination } from '../../../library/ui/components/pagination/pagination';
import { Modal } from '../../../library/ui/components/modal/modal';
import { TableColumn } from '../../../core/models/ui.model';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, Table, Badge, Button, FormsModule, InputField, Chip, Dropdown, Pagination, Modal],
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

  isConfirmModalOpen = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalConfirmLabel = 'Confirm';
  confirmModalConfirmVariant: 'primary' | 'danger' | 'warning' | 'success' | 'secondary' = 'primary';
  pendingAction: { type: 'status', id: string, newStatus?: string } | null = null;

  constructor(private adminService: AdminService) { }

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

  ngOnDestroy() {}

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

  updateStatus(clientId: string, newStatus: string) {
    this.pendingAction = { type: 'status', id: clientId, newStatus };
    this.confirmModalTitle = 'Confirm Status Change';
    this.confirmModalMessage = `Are you sure you want to change the status to ${newStatus}?`;
    this.confirmModalConfirmLabel = 'Update Status';
    this.confirmModalConfirmVariant = (newStatus === 'Suspended' || newStatus === 'Blocked' || newStatus === 'Deactivated') ? 'danger' : 'primary';
    this.isConfirmModalOpen = true;
  }

  onConfirmAction() {
    if (!this.pendingAction) return;

    if (this.pendingAction.type === 'status' && this.pendingAction.newStatus) {
      this.adminService.updateClientStatus(this.pendingAction.id, this.pendingAction.newStatus).subscribe({
        next: (res) => {
          if (res.success) this.loadClients();
          this.closeConfirmModal();
        },
        error: (err) => {
          console.error('Error updating status', err);
          this.closeConfirmModal();
        }
      });
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.pendingAction = null;
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
}
