import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../../core/services/admin.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<any>({
    totalClients: 0,
    totalFreelancers: 0,
    activeContracts: 0,
    totalCommissions: 0
  });
  recentActivities = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res);
      }
    });

    this.adminService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities.set(activities);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
