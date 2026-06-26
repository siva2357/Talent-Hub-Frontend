import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { DashboardService } from '../../../../../core/services/dashboard.service';

import { DashboardStat, RecentActivity } from '../../../../../core/model/freelancer.model';

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './freelancer-dashboard.component.html',
  styleUrl: './freelancer-dashboard.component.css'
})
export class FreelancerDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  freelancerName = 'Freelancer';
  profilePhoto = '';
  activeContractsCount = 0;
  isLoading = true;

  stats: DashboardStat[] = [];
  activities: RecentActivity[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.freelancerName = res.fullName || 'Freelancer';
          this.profilePhoto = res.profilePhoto || '';
          this.activeContractsCount = res.activeContractsCount || 0;
          this.stats = res.stats || [];
          this.activities = res.activities || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load freelancer dashboard stats:', err);
        this.isLoading = false;
      }
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
