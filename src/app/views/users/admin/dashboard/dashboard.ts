import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsDataService } from '../../../../core/services/stats-data-service';
import { AdminStatsResponse } from '../../../../core/models/analytics.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  loading = false;
  errorMessage = '';
  adminStats!: AdminStatsResponse;

  constructor(private statsService: StatsDataService) {}

  ngOnInit(): void {
    this.loadAdminStats();
  }

  loadAdminStats(): void {
    this.loading = true;

    this.statsService.getAdminStats().subscribe({
      next: (res) => {
        this.adminStats = res;
        this.loading = false;

        // Render charts ONLY when data exists
        setTimeout(() => this.renderCharts());
      },
      error: (err) => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
  }

  renderCharts(): void {

    // Destroy if already exists (important)
    Chart.getChart('jobsByCategoryChart')?.destroy();
    Chart.getChart('applicationsByCategoryChart')?.destroy();

    new Chart('jobsByCategoryChart', {
      type: 'pie',
      data: {
        labels: this.adminStats.analytics.jobsByCategory.map(j => j._id),
        datasets: [{
          data: this.adminStats.analytics.jobsByCategory.map(j => j.count)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    new Chart('applicationsByCategoryChart', {
      type: 'bar',
      data: {
        labels: this.adminStats.analytics.applicationsByCategory.map(a => a._id),
        datasets: [{
          label: 'Applications',
          data: this.adminStats.analytics.applicationsByCategory.map(a => a.count)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
