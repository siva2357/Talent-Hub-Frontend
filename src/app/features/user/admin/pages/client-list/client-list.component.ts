import { Component, HostListener, OnInit, TemplateRef, ViewChild, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ClientData } from '../../../../../core/services/admin.service';
import { Table } from "../../../../../shared/components/table/table.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, Table, InputComponent, FormsModule, ButtonComponent, BadgeComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private adminService = inject(AdminService);

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
      { name: 'Client', prop: 'clientName', width: 280, cellTemplate: this.clientTemplate },
      { name: 'Email', prop: 'email', width: 280 },
      { name: 'Phone', prop: 'phoneNumber', width: 180 },
      { name: 'Industry', prop: 'industry', width: 180 },
      { name: 'Spent', prop: 'spent', width: 120 },
      { name: 'Status', prop: 'status', width: 140, cellTemplate: this.statusTemplate },
      { name: 'Actions', prop: 'actions', sortable: false, cellTemplate: this.actionTemplate }
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
    this.selectedClient.set(client);
  }

  closeProfileModal(): void {
    this.selectedClient.set(null);
  }

  @ViewChild('clientTemplate', { static: true })
  clientTemplate!: TemplateRef<any>;

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

  openMenuId = signal<number | string | null>(null);

  toggleMenu(id: number | string, event: Event): void {
    event.stopPropagation();
    this.openMenuId.update(current => current === id ? null : id);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId.set(null);
  }
}
