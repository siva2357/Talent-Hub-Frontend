import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-client-management',
  imports: [CommonModule],
  templateUrl: './client-management.html',
  styleUrl: './client-management.css'
})
export class ClientManagement implements OnInit {
  clients: any[] = [];
  totalContracts: number = 0;
  
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.adminService.getAllClients().subscribe({
      next: (res) => {
        this.clients = res || [];
        this.totalContracts = this.clients.reduce((acc, client) => acc + (client.projectsCount || 0), 0);
      },
      error: (err) => console.error('Error fetching clients', err)
    });
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
}
