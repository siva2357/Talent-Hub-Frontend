import { Component, OnInit, inject, signal, computed } from '@angular/core';
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

  freelancerName = signal<string>('Freelancer');
  profilePhoto = signal<string>('');
  activeContractsCount = signal<number>(0);
  isLoading = signal<boolean>(true);

  stats = signal<DashboardStat[]>([]);
  activities = signal<RecentActivity[]>([]);

  greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.dashboardService.getDashboardStats().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.freelancerName.set(res.fullName || 'Freelancer');
          this.profilePhoto.set(res.profilePhoto || '');
          this.activeContractsCount.set(res.activeContractsCount || 0);
          
          // Map icons and colors for stats on the frontend
          const mappedStats = (res.stats || []).map((stat: any) => {
            if (stat.label === 'Total Earnings') {
              stat.icon = 'bi-currency-rupee';
              stat.color = 'blue';
            } else if (stat.label === 'Active Contracts') {
              stat.icon = 'bi-check2-circle';
              stat.color = 'green';
            } else if (stat.label === 'Completed Contracts') {
              stat.icon = 'bi-check-all';
              stat.color = 'gold';
            } else if (stat.label === 'Submitted Proposals') {
              stat.icon = 'bi-cash-stack';
              stat.color = 'purple';
            } else {
              stat.icon = 'bi-info-circle';
              stat.color = 'blue';
            }
            return stat as DashboardStat;
          });
          this.stats.set(mappedStats);

          // Map icons for activities on the frontend
          const mappedActivities = (res.activities || []).map((act: any) => {
            if (act.title === 'Contract Started') {
              act.icon = 'bi-briefcase-fill';
            } else if (act.title === 'Application Submitted') {
              act.icon = 'bi-file-earmark-text-fill';
            } else {
              act.icon = 'bi-info-circle-fill';
            }
            return act as RecentActivity;
          });
          this.activities.set(mappedActivities);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load freelancer dashboard stats:', err);
        this.isLoading.set(false);
      }
    });
  }
}
