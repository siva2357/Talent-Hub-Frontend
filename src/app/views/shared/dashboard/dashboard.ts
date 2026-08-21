import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ContractService } from '../../../core/services/contract.service';
import { TransactionService } from '../../../core/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit, OnInit {
  role: string = '';
  charts: Chart[] = [];

  // Dynamic Data
  userName: string = 'User';
  activeContracts: number = 0;
  totalSpent: number = 0;
  vaultBalance: number = 0;
  pendingProposals: number = 0;
  totalEarnings: number = 0;

  @ViewChild('clientsChart') clientsChart!: ElementRef;
  @ViewChild('freelancersChart') freelancersChart!: ElementRef;
  @ViewChild('revenueChart') revenueChart!: ElementRef;
  @ViewChild('contractsChart') contractsChart!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private tokenService: TokenService,
    private profileService: ProfileService,
    private contractService: ContractService,
    private transactionService: TransactionService
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
    }
  }

  loadClientData() {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userName = `${res.data.firstName} ${res.data.lastName}`;
        }
      },
      error: (err) => console.error('Error fetching profile', err)
    });

    this.contractService.getMyContracts().subscribe({
      next: (res) => {
        if (res.success && res.contracts) {
          this.activeContracts = res.contracts.filter(c => c.status === 'open' || c.status === 'in progress').length;
        }
      },
      error: (err) => console.error('Error fetching contracts', err)
    });

    this.transactionService.getFinanceStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.totalSpent = res.data.totalSpent || 0;
          this.vaultBalance = res.data.vaultBalance || 0;
        }
      },
      error: (err) => console.error('Error fetching finance stats', err)
    });
  }

  loadFreelancerData() {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userName = `${res.data.firstName} ${res.data.lastName}`;
        }
      }
    });
    this.transactionService.getFinanceStats().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.totalEarnings = res.data.totalEarnings || 0;
          this.vaultBalance = res.data.vaultBalance || 0;
        }
      }
    });
    this.contractService.getFreelancerMyContracts().subscribe({
      next: (res) => {
        if (res.success && res.contracts) {
          this.activeContracts = res.contracts.filter(c => c.status === 'open' || c.status === 'in progress').length;
        }
      },
      error: (err) => console.error('Error fetching contracts', err)
    });
  }

  setRole(newRole: string) {
    this.role = newRole;
    if (this.role === 'admin') {
      setTimeout(() => this.initAdminCharts(), 100);
    } else {
      this.destroyCharts();
    }
  }

  ngAfterViewInit() {
    if (this.role === 'admin') {
      setTimeout(() => this.initAdminCharts(), 100);
    }
  }

  initAdminCharts() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.destroyCharts();

    if (this.clientsChart) {
      this.charts.push(new Chart(this.clientsChart.nativeElement, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Clients',
            data: [12, 19, 3, 5, 2, 3],
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
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Freelancers',
            data: [25, 30, 20, 45, 60, 55],
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
          labels: ['Subscriptions', 'Fees', 'Premium', 'Other'],
          datasets: [{
            data: [300, 50, 100, 40],
            backgroundColor: ['#4a3aff', '#2563eb', '#60a5fa', '#93c5fd']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      }));
    }

    if (this.contractsChart) {
      this.charts.push(new Chart(this.contractsChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Completed', 'Pending', 'Cancelled'],
          datasets: [{
            data: [150, 200, 45, 10],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
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
