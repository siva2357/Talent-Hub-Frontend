import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Table } from '../../../components/table/table';
import { AdminService } from '../../../../core/services/admin-service';
import { StatsDataService } from '../../../../core/services/stats-data-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Table],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalApplications = 0;
  totalHired = 0;
  totalRejected = 0;
  totalJobs = 0;
  dashboardCards: any[] = [];
  trendColumns: any[] = [];
  trendData: any[] = [];


  constructor(
    private statService: StatsDataService,
  ) {}

  ngOnInit() {
    this.trendColumns = [
      { name: 'S.No', prop: 'sno' },
      { name: 'Month', prop: 'month' },
      { name: 'Jobs Posted', prop: 'jobs' },
      { name: 'Applications', prop: 'applications' },
      { name: 'Hired', prop: 'hired' },
      { name: 'Rejected', prop: 'rejected' },
    ];
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.statService.getAdminStats().subscribe({
      next: (stats) => {
        this.dashboardCards = [
          {
            title: 'Total Recruiters',
            total: stats.totals.recruiters,
          },
          {
            title: 'Total Job Seekers',
            total: stats.totals.jobSeekers,
          },
          {
            title: 'Total Applications',
            total: stats.totals.applications,
          },
          {
            title: 'Total Hired',
            total: stats.totals.hired,
          },
          {
            title: 'Total Rejected',
            total: stats.totals.rejected,
          },
        ];
      },
    });

    this.statService.getAdminTrends().subscribe({
      next: (res) => {
        // ✅ table
        this.trendData = res.months.map((item: any, index: number) => ({
          sno: index + 1,
          ...item,
        }));

        // ✅ totals (no calculation needed)
        this.totalJobs = res.totals.jobs;
        this.totalApplications = res.totals.applications;
        this.totalHired = res.totals.hired;
        this.totalRejected = res.totals.rejected;
      },
    });
  }
}
