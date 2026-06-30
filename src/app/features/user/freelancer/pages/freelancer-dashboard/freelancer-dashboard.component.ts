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
          this.stats.set(res.stats || []);
          this.activities.set(res.activities || []);
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
