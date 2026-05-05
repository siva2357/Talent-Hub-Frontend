import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Table } from "../../../components/table/table";
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [CommonModule, Table, FormsModule],
  templateUrl: './recruiter-dashboard.html',
  styleUrl: './recruiter-dashboard.css',
})
export class RecruiterDashboard implements AfterViewInit {
  @ViewChild('statsChart') statsChartRef!: ElementRef;
  @ViewChild('pipelineChart') pipelineChartRef!: ElementRef;
  
  // Table Templates
  @ViewChild('userTpl', { static: false }) userTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: false }) statusTpl!: TemplateRef<any>;

  stats = [
    { title: 'Total Job Posts', value: '24', icon: 'bi-briefcase', trend: '+12%', color: '#3b82f6' },
    { title: 'Total Applicants', value: '1,284', icon: 'bi-people', trend: '+18%', color: '#8b5cf6' },
    { title: 'Interviews', value: '86', icon: 'bi-chat-dots', trend: '+5%', color: '#f59e0b' },
    { title: 'Hired', value: '12', icon: 'bi-check2-circle', trend: '+2%', color: '#10b981' },
    { title: 'Rejected', value: '45', icon: 'bi-x-circle', trend: '-3%', color: '#ef4444' },
    { title: 'Assessments', value: '156', icon: 'bi-journal-check', trend: '+25%', color: '#06b6d4' }
  ];

  timeframe = 'Monthly';
  chart: any;
  pipelineChart: any;

  applicantColumns: any[] = [];
  applicantData = [
    { _id: '1', name: 'Amit Patel', email: 'amit@example.com', job: 'Frontend Developer', date: '2 hours ago', status: 'Assessment Completed', avatar: 'https://i.pravatar.cc/150?u=amit' },
    { _id: '2', name: 'Sneha Rao', email: 'sneha@example.com', job: 'UI/UX Designer', date: '5 hours ago', status: 'Interview Scheduled', avatar: 'https://i.pravatar.cc/150?u=sneha' },
    { _id: '3', name: 'Vikram Singh', email: 'vikram@example.com', job: 'Backend Engineer', date: '1 day ago', status: 'Shortlisted', avatar: 'https://i.pravatar.cc/150?u=vikram' },
    { _id: '4', name: 'Priya Sharma', email: 'priya@example.com', job: 'Project Manager', date: '2 days ago', status: 'Rejected', avatar: 'https://i.pravatar.cc/150?u=priya' },
    { _id: '5', name: 'Rohan Mehta', email: 'rohan@example.com', job: 'DevOps Engineer', date: '3 days ago', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=rohan' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngAfterViewInit() {
    this.initTableColumns();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.createMainChart();
        this.createPipelineChart();
      }, 100);
    }
  }

  initTableColumns() {
    this.applicantColumns = [
      { name: 'S.No', type: 'index', width: '80px', center: true },
      { name: 'Applicant', template: this.userTpl, width: '250px' },
      { name: 'Applied For', prop: 'job', width: '200px' },
      { name: 'Date', prop: 'date', width: '150px' },
      { name: 'Status', template: this.statusTpl, width: '180px', center: true }
    ];
  }

  onTimeframeChange() {
    this.createMainChart();
  }

  createMainChart() {
    if (this.chart) this.chart.destroy();
    
    let labels = [];
    let data = [];
    
    switch(this.timeframe) {
      case 'Weekly':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [12, 19, 15, 22, 30, 10, 8];
        break;
      case 'Monthly':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [45, 62, 58, 75];
        break;
      case 'Quarterly':
        labels = ['Month 1', 'Month 2', 'Month 3'];
        data = [150, 210, 190];
        break;
      case 'Half Yearly':
        labels = ['Q1', 'Q2'];
        data = [450, 580];
        break;
      case 'Yearly':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = [120, 150, 180, 240, 210, 190, 230, 250, 280, 310, 290, 340];
        break;
      default:
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        data = [120, 150, 180, 240, 210, 190];
    }

    const ctx = this.statsChartRef.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Applications',
          data: data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  createPipelineChart() {
    if (this.pipelineChart) this.pipelineChart.destroy();
    const ctx = this.pipelineChartRef.nativeElement.getContext('2d');
    this.pipelineChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'],
        datasets: [{
          data: [400, 250, 150, 50, 80],
          backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15 } }
        }
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Shortlisted': return 'bg-success-subtle text-success border border-success-subtle';
      case 'Rejected': return 'bg-danger-subtle text-danger border border-danger-subtle';
      case 'Interview Scheduled':
      case 'Interview Completed': return 'bg-warning-subtle text-warning border border-warning-subtle';
      case 'Assessment Assigned':
      case 'Assessment Completed': return 'bg-info-subtle text-info border border-info-subtle';
      case 'In Process': return 'bg-primary-subtle text-primary border border-primary-subtle';
      default: return 'bg-secondary-subtle text-secondary border border-secondary-subtle';
    }
  }
}
