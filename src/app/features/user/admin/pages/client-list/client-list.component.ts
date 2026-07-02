import { Component, HostListener, OnInit, TemplateRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService, ClientData } from '../../../../../core/services/admin.service';
import { Table } from "../../../../../shared/components/table/table.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { DropdownComponent, DropdownAction } from '../../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, Table, InputComponent, FormsModule, ButtonComponent, BadgeComponent, DropdownComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private adminService = inject(AdminService);
  private router = inject(Router);

  clients = signal<ClientData[]>([]);
  searchTerm = signal<string>('');
  statusFilter = signal<'All' | 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'>('All');

  filteredClients = computed(() => {
    return this.clients().filter(c => {
      const term = this.searchTerm().toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term);

      const status = this.statusFilter();
      const matchesStatus = status === 'All' || c.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  // Modal display variables
  selectedClient = signal<ClientData | null>(null);

  ngOnInit(): void {
    this.columns = [
      { name: 'Profile Image', prop: 'profileImage', width: 120, cellTemplate: this.profileImageTemplate, sortable: false },
      { name: 'Full Name', prop: 'clientName', width: 180 },
      { name: 'Email', prop: 'email', width: 280 },
      { name: 'Phone', prop: 'phoneNumber', width: 180 },
      { name: 'Industry', prop: 'industry', width: 180 },
      { name: 'Status', prop: 'status', width: 140, cellTemplate: this.statusTemplate },
      { name: 'Actions', prop: 'actions', width: 100, sortable: false, cellTemplate: this.actionTemplate }
    ];
    this.loadClients();
  }

  loadClients(): void {
    this.adminService.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
      }
    });
  }


  onFilterStatus(status: 'All' | 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'): void {
    this.statusFilter.set(status);
  }

  changeClientStatus(id: string, status: 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'): void {
    this.adminService.updateClientStatus(id, status).subscribe({
      next: () => {
        this.loadClients();
        const selected = this.selectedClient();
        if (selected && selected.id === id) {
          this.selectedClient.update(c => c ? { ...c, status } : null);
        }
      }
    });
  }

  viewProfile(client: ClientData): void {
    this.router.navigate(['/user/profile', client.id]);
  }

  closeProfileModal(): void {
    this.selectedClient.set(null);
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
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Deactivated', value: 'Deactivated' }
  ];

  getActions(client: ClientData): DropdownAction[] {
    const actions: DropdownAction[] = [
      { label: 'View Profile', value: 'view', icon: 'bi bi-eye text-primary' }
    ];

    if (client.status === 'Blocked') {
      actions.push({ label: 'Unblock Account', value: 'Active', icon: 'bi bi-shield-check text-success' });
    } else {
      actions.push({ label: 'Block Account', value: 'Blocked', icon: 'bi bi-shield-slash text-warning' });
    }

    if (client.status === 'Active') {
      actions.push({ label: 'Deactivate', value: 'Deactivated', icon: 'bi bi-pause-circle text-danger' });
    } else if (client.status === 'Deactivated' || client.status === 'Suspended') {
      actions.push({ label: 'Activate', value: 'Active', icon: 'bi bi-play-circle text-success' });
    }
    return actions;
  }

  handleAction(actionValue: string, client: ClientData) {
    if (actionValue === 'view') {
      this.viewProfile(client);
    } else {
      this.changeClientStatus(client.id, actionValue as any);
    }
  }
}
