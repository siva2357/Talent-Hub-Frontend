import { Component, HostListener, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ClientData } from '../../../../../core/services/admin.service';
import { Table } from "../../../../../shared/components/table/table.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, Table, InputComponent, FormsModule, ButtonComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  private adminService = inject(AdminService);

  clients: ClientData[] = [];
  filteredClients: ClientData[] = [];
  searchTerm = '';
  statusFilter: 'All' | 'Active' | 'Suspended' | 'Blocked' | 'Deactivated' = 'All';

  // Modal display variables
  selectedClient: ClientData | null = null;

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.adminService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.applyFilters();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onFilterStatus(status: 'All' | 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            c.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All' || c.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  changeClientStatus(id: string, status: 'Active' | 'Suspended' | 'Blocked' | 'Deactivated'): void {
    this.adminService.updateClientStatus(id, status).subscribe({
      next: () => {
        this.loadClients();
        if (this.selectedClient && this.selectedClient.id === id) {
          this.selectedClient.status = status;
        }
      }
    });
  }

  viewProfile(client: ClientData): void {
    this.selectedClient = client;
  }

  closeProfileModal(): void {
    this.selectedClient = null;
  }



  @ViewChild('clientTemplate', { static: true })
clientTemplate!: TemplateRef<any>;

@ViewChild('statusTemplate', { static: true })
statusTemplate!: TemplateRef<any>;

@ViewChild('actionTemplate', { static: true })
actionTemplate!: TemplateRef<any>;

columns: any[] = [];

ngAfterViewInit(): void {

  this.columns = [
    {
      name: 'Client',
      prop: 'clientName',
      width: 280,
      cellTemplate: this.clientTemplate
    },
    {
      name: 'Email',
      prop: 'email',
      width: 280
    },
    {
      name: 'Phone',
      prop: 'phoneNumber',
      width: 180
    },
    {
      name: 'Industry',
      prop: 'industry',
      width: 180
    },
    {
      name: 'Spent',
      prop: 'spent',
      width: 120
    },
    {
      name: 'Status',
      prop: 'status',
      width: 140,
      cellTemplate: this.statusTemplate
    }
  ];

}
statusOptions = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Suspended', value: 'Suspended' },
  { label: 'Blocked', value: 'Blocked' },
  { label: 'Deactivated', value: 'Deactivated' }
];

openMenuId: number | string | null = null;

toggleMenu(id: number | string, event: Event): void {
  event.stopPropagation();

  this.openMenuId =
    this.openMenuId === id
      ? null
      : id;
}

@HostListener('document:click')
closeMenu(): void {
  this.openMenuId = null;
}


}
