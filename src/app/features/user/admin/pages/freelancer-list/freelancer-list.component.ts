import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, FreelancerData } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-freelancer-list',
  standalone: true,
  imports: [CommonModule],
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
}
