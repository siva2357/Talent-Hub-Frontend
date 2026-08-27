import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Dropdown, DropdownItem } from '../../../library/ui/components/dropdown/dropdown';

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [CommonModule, Table, Badge, Dropdown],
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
