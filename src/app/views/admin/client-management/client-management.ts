import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Table } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Button } from '../../../library/ui/components/button/button';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';
import { TableColumn } from '../../../core/models/ui.model';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, Table, Badge, Button, FormsModule, InputField, Chip, Dropdown],
  templateUrl: './client-management.html',
  styleUrl: './client-management.css'
})
export class ClientManagement implements OnInit, AfterViewInit {
  clients: any[] = [];
  totalContracts: number = 0;

  columns: TableColumn[] = [];

  @ViewChild('indexTpl') indexTpl!: TemplateRef<any>;
  @ViewChild('profileTpl') profileTpl!: TemplateRef<any>;
  @ViewChild('fullNameTpl') fullNameTpl!: TemplateRef<any>;
  @ViewChild('emailTpl') emailTpl!: TemplateRef<any>;
  @ViewChild('phoneTpl') phoneTpl!: TemplateRef<any>;
  @ViewChild('industryTpl') industryTpl!: TemplateRef<any>;
  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;
  @ViewChild('actionsTpl') actionsTpl!: TemplateRef<any>;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { field: 'id', headerName: 'S.No', cellTemplate: this.indexTpl }, // We'll just map the index column normally, wait, index is dynamic in ngFor. We can use a template
        { field: 'profile', headerName: 'Profile', cellTemplate: this.profileTpl },
        { field: 'name', headerName: 'Full Name', cellTemplate: this.fullNameTpl },
        { field: 'email', headerName: 'Email', cellTemplate: this.emailTpl },
        { field: 'phone', headerName: 'Phone', cellTemplate: this.phoneTpl },
        { field: 'industry', headerName: 'Industry', cellTemplate: this.industryTpl },
        { field: 'status', headerName: 'Status', cellTemplate: this.statusTpl },
        { field: 'actions', headerName: 'Actions', cellTemplate: this.actionsTpl }
      ];
    });
  }

  rawClients: any[] = [];
  searchQuery: string = '';
  selectedStatus: string = 'All Statuses';
  statusOptions: { label: string, value: string }[] = [
    { label: 'All Statuses', value: 'All Statuses' },
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Deactivated', value: 'Deactivated' }
  ];
  activeFilters: { key: string, label: string, value: any }[] = [];

  loadClients() {
    this.adminService.getAllClients().subscribe({
      next: (res) => {
        this.rawClients = res || [];
        this.totalContracts = this.rawClients.reduce((acc, client) => acc + (client.projectsCount || 0), 0);
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching clients', err)
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

    let filtered = [...this.rawClients];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.id && String(c.id).toLowerCase().includes(q))
      );
    }

    if (this.selectedStatus && this.selectedStatus !== 'All Statuses') {
      filtered = filtered.filter(c => c.status === this.selectedStatus);
    }

    this.clients = filtered;
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

  updateStatus(clientId: string, newStatus: string) {
    this.adminService.updateClientStatus(clientId, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadClients();
        }
      },
      error: (err) => console.error('Error updating status', err)
    });
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
