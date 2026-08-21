import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-freelancer-management',
  imports: [CommonModule],
  templateUrl: './freelancer-management.html',
  styleUrl: './freelancer-management.css'
})
export class FreelancerManagement implements OnInit {
  freelancers: any[] = [];
  totalContracts: number = 0;
  
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadFreelancers();
  }

  loadFreelancers() {
    this.adminService.getAllFreelancers().subscribe({
      next: (res) => {
        this.freelancers = res || [];
        this.totalContracts = this.freelancers.reduce((acc, freelancer) => acc + (freelancer.completedProjects || 0), 0);
      },
      error: (err) => console.error('Error fetching freelancers', err)
    });
  }

  updateStatus(freelancerId: string, newStatus: string) {
    this.adminService.updateFreelancerStatus(freelancerId, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadFreelancers();
        }
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  approveFreelancer(freelancerId: string) {
    this.adminService.approveFreelancer(freelancerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadFreelancers();
        }
      },
      error: (err) => console.error('Error approving freelancer', err)
    });
  }
}
