import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../../../core/services/dashboard.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css',
})
export class ClientDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  clientName = 'Client';
  stats: any[] = [];
  recentActivities: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.clientName = res.fullName || 'Client';
          this.stats = res.stats || [];
          this.recentActivities = res.activities || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load client dashboard stats:', err);
        this.isLoading = false;
      }
    });
  }
}
