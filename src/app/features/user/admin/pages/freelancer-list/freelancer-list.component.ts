import { Component, HostListener, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, FreelancerData } from '../../../../../core/services/admin.service';
import { Table } from "../../../../../shared/components/table/table.component";
import { ButtonComponent } from "../../../../../shared/components/button/button.component";
import { InputComponent } from "../../../../../shared/components/input/input.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [CommonModule, Table, ButtonComponent, InputComponent,FormsModule],
  templateUrl: './freelancer-list.component.html',
  styleUrl: './freelancer-list.component.css'
})
export class FreelancerListComponent implements OnInit {
  private adminService = inject(AdminService);

  freelancers: FreelancerData[] = [];
  filteredFreelancers: FreelancerData[] = [];
  searchTerm = '';
  statusFilter: 'All' | 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated' = 'All';

  // Modal overlay variable
  selectedFreelancer: FreelancerData | null = null;

  ngOnInit(): void {
    this.loadFreelancers();
  }

  loadFreelancers(): void {
    this.adminService.getFreelancers().subscribe({
      next: (data) => {
        this.freelancers = data;
        this.applyFilters();
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  onFilterStatus(status: 'All' | 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredFreelancers = this.freelancers.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            f.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            f.skills.some(skill => skill.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.statusFilter === 'All' || f.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  changeFreelancerStatus(id: string, status: 'Active' | 'Suspended' | 'Pending Approval' | 'Blocked' | 'Deactivated'): void {
    this.adminService.updateFreelancerStatus(id, status).subscribe({
      next: () => {
        this.loadFreelancers();
        if (this.selectedFreelancer && this.selectedFreelancer.id === id) {
          this.selectedFreelancer.status = status;
        }
      }
    });
  }

  approveFreelancer(id: string): void {
    this.adminService.approveFreelancer(id).subscribe({
      next: () => {
        this.loadFreelancers();
        if (this.selectedFreelancer && this.selectedFreelancer.id === id) {
          this.selectedFreelancer.status = 'Active';
        }
      }
    });
  }

  viewProfile(freelancer: FreelancerData): void {
    this.selectedFreelancer = freelancer;
  }

  closeProfileModal(): void {
    this.selectedFreelancer = null;
  }



    @ViewChild('freelancerTemplate', { static: true })
freelancerTemplate!: TemplateRef<any>;

@ViewChild('statusTemplate', { static: true })
statusTemplate!: TemplateRef<any>;

@ViewChild('actionTemplate', { static: true })
actionTemplate!: TemplateRef<any>;

columns: any[] = [];

ngAfterViewInit(): void {

this.columns = [
  {
    name: 'Freelancer',
    prop: 'name',
    width: 280,
    cellTemplate: this.freelancerTemplate
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
    name: 'Title',
    prop: 'title',
    width: 220
  },
  {
    name: 'Hourly Rate',
    prop: 'hourlyRate',
    width: 150
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
