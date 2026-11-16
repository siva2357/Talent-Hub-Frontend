import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { TokenService } from '../../../core/services/token.service';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { StatCard, StatCardData } from '../../../library/shared/components/stat-card/stat-card';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit, OnInit {
  role: string = '';
  charts: Chart[] = [];

  // Dynamic Data
  userName: string = 'User';
  activeContracts: string | number = 0;
  totalSpent: string | number = 0;
  vaultBalance: string | number = 0;
  pendingProposals: string | number = 0;
  totalEarnings: string | number = 0;
  activities: any[] = [];

  // Job Seeker Static Data (Worksphere Gateway)
  totalApplications: number = 12;
  pendingAssessments: number = 3;
  upcomingInterviews: number = 2;
  jobOffersReceived: number = 1;
  jobSeekerActivities: any[] = [
    {
      id: 1,
      title: 'Technical Assessment Assigned',
      company: 'TechNova Solutions (via Worksphere)',
      description: 'Senior Full Stack Engineer — Complete coding challenge before Nov 22',
      status: 'assessment',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Interview Scheduled',
      company: 'CloudScale Systems (via Worksphere)',
      description: 'System Design Round with Engineering Lead on Nov 19 at 3:00 PM',
      status: 'interview',
      time: 'Yesterday'
    },
    {
      id: 3,
      title: 'Offer Letter Received',
      company: 'FinEdge Corp (via Worksphere)',
      description: 'Frontend Architect — Review and accept offer in My Offers',
      status: 'offer',
      time: '2 days ago'
    },
    {
      id: 4,
      title: 'Application Shortlisted',
      company: 'Aether AI Labs (via Worksphere)',
      description: 'Your profile matched 94% with Product Engineer requirements',
      status: 'shortlisted',
      time: '4 days ago'
    }
  ];

  // Admin Stats
  totalClients: number = 0;
  totalFreelancers: number = 0;
  totalCommissions: number = 0;

  get adminStats(): StatCardData[] {
    return [
      { title: 'Total Clients', value: this.totalClients, icon: 'bi-people-fill' },
      { title: 'Total Freelancers', value: this.totalFreelancers, icon: 'bi-person-workspace' },
      { title: 'Total Contracts', value: this.activeContracts, icon: 'bi-file-earmark-check-fill' },
      { title: 'Total Payouts', value: '₹' + this.totalCommissions, icon: 'bi-wallet-fill' },
      { title: 'Platform Revenue', value: '₹' + this.totalCommissions, icon: 'bi-graph-up-arrow' }
    ];
  }

  get clientStats(): StatCardData[] {
    return [
      { title: 'Active Contracts', value: this.activeContracts, icon: 'bi-briefcase-fill' },
      { title: 'Total Spent', value: this.totalSpent, icon: 'bi-currency-dollar' },
      { title: 'Escrow Balance', value: this.vaultBalance, icon: 'bi-wallet2' },
      { title: 'Pending Proposals', value: this.pendingProposals, icon: 'bi-file-earmark-text-fill' }
    ];
  }

  get freelancerStats(): StatCardData[] {
    return [
      { title: 'Active Contracts', value: this.activeContracts, icon: 'bi-briefcase' },
      { title: 'Total Earnings', value: this.totalEarnings, icon: 'bi-cash-stack' },
      { title: 'Available Balance', value: this.vaultBalance, icon: 'bi-wallet2' },
      { title: 'Pending Proposals', value: this.pendingProposals, icon: 'bi-file-earmark-check' }
    ];
  }

  get jobSeekerStats(): StatCardData[] {
    return [
      { title: 'Applications Sent', value: this.totalApplications, icon: 'bi-file-earmark-text' },
      { title: 'Pending Assessments', value: this.pendingAssessments, icon: 'bi-clipboard-check' },
      { title: 'Upcoming Interviews', value: this.upcomingInterviews, icon: 'bi-camera-video' },
      { title: 'Job Offers', value: this.jobOffersReceived, icon: 'bi-award' }
    ];
  }

  @ViewChild('clientsChart') clientsChart!: ElementRef;
  @ViewChild('freelancersChart') freelancersChart!: ElementRef;
  @ViewChild('revenueChart') revenueChart!: ElementRef;
  @ViewChild('contractsChart') contractsChart!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private tokenService: TokenService,
    private adminService: AdminService,
    private dashboardService: DashboardService
  ) {
    const userRole = this.tokenService.getRole();
    if (userRole) {
      this.role = userRole.toLowerCase();
    }
  }

  ngOnInit() {
    if (this.role === 'client') {
      this.loadClientData();
    } else if (this.role === 'freelancer') {
      this.loadFreelancerData();
    } else if (this.role === 'admin') {
      this.loadAdminData();
    }
  }






  loadAdminData() {
    this.adminService.getAdminStats().subscribe({
      next: (res) => {
        if (res) {
          this.totalClients = res.totalClients || 0;
          this.totalFreelancers = res.totalFreelancers || 0;
          this.activeContracts = res.activeContracts || 0;
          this.totalCommissions = res.totalCommissions || 0;

          if (res.chartData) {
            setTimeout(() => this.initAdminCharts(res.chartData), 100);
          }
        }
      },
      error: (err) => console.error('Error fetching admin stats', err)
    });
  }

  loadClientData() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.userName = res.fullName || 'User';

          res.stats?.forEach((stat: any) => {
            if (stat.label === 'Active Contracts') this.activeContracts = stat.value;
            if (stat.label === 'Total Spent') this.totalSpent = stat.value;
            if (stat.label === 'Escrow Balance') this.vaultBalance = stat.value;
            if (stat.label === 'Pending Proposals') this.pendingProposals = stat.value;
          });

          this.activities = res.activities || [];
        }
      },
      error: (err) => console.error('Error fetching client stats', err)
    });
  }

  loadFreelancerData() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.userName = res.fullName || 'User';

          res.stats?.forEach((stat: any) => {
            if (stat.label === 'Active Contracts') this.activeContracts = stat.value;
            if (stat.label === 'Total Earnings') this.totalEarnings = stat.value;
            if (stat.label === 'Available Balance') this.vaultBalance = stat.value;
            if (stat.label === 'Pending Proposals') this.pendingProposals = stat.value;
          });

          this.activities = res.activities || [];
        }
      },
      error: (err) => console.error('Error fetching freelancer stats', err)
    });
  }

  setRole(newRole: string) {
    this.role = newRole;
    if (this.role === 'admin') {
      this.loadAdminData();
    } else {
      this.destroyCharts();
    }
  }

  ngAfterViewInit() {
    // Admin charts initialized from loadAdminData
  }

  initAdminCharts(chartData: any = null) {
    if (!isPlatformBrowser(this.platformId) || !chartData) return;
    this.destroyCharts();

    if (this.clientsChart) {
      this.charts.push(new Chart(this.clientsChart.nativeElement, {
        type: 'line',
        data: {
          labels: chartData.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Clients',
            data: chartData.clients || [0, 0, 0, 0, 0, 0],
            borderColor: '#4a3aff',
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    if (this.freelancersChart) {
      this.charts.push(new Chart(this.freelancersChart.nativeElement, {
        type: 'line',
        data: {
          labels: chartData.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Freelancers',
            data: chartData.freelancers || [0, 0, 0, 0, 0, 0],
            borderColor: '#2563eb',
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    if (this.revenueChart) {
      this.charts.push(new Chart(this.revenueChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            data: chartData.revenue || [0, 0, 0, 0],
            backgroundColor: ['#4a3aff', '#2563eb', '#60a5fa', '#93c5fd']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    if (this.contractsChart) {
      const contractData = chartData.contracts || [0, 0, 0, 0];
      const hasContractData = contractData.some((val: number) => val > 0);

      this.charts.push(new Chart(this.contractsChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: hasContractData ? ['In Progress', 'Completed', 'Open', 'Closed'] : ['No Data'],
          datasets: [{
            data: hasContractData ? contractData : [1],
            backgroundColor: hasContractData ? ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'] : ['#e5e7eb']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }
  }

  destroyCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }
}
