import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats: any = {
    totalClients: 0,
    totalFreelancers: 0,
    activeContracts: 0,
    totalCommissions: 0
  };
  recentActivities: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
      }
    });

    this.adminService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
