import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, ClientData } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
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
}
