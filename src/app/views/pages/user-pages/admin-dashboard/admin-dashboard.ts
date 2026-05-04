import { Component, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from "../../../components/table/table";



Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  imports: [CommonModule, Table]
})
export class AdminDashboard implements AfterViewInit {

  @ViewChild('myChart') myChartRef!: ElementRef;
  @ViewChild('categoryPieChart') pieRef!: ElementRef;
  @ViewChild('categoryBarChart') barRef!: ElementRef;

  // Table Templates
  @ViewChild('userTpl', { static: true }) userTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;

  recruiterColumns: any[] = [];
  seekerColumns: any[] = [];
  recruiterActions: any[] = [];
  seekerActions: any[] = [];

  recruiterData: any[] = [
    { _id: '1', name: 'Rahul Sharma', email: 'rahul@tcs.com', mobile: '+91 98765 43210', position: 'HR Manager', company: 'TCS', status: 'verified', avatar: 'https://i.pravatar.cc/40?img=1' },
    { _id: '2', name: 'Anita Verma', email: 'anita@infosys.com', mobile: '+91 91234 56789', position: 'Talent Acquisition', company: 'Infosys', status: 'pending', avatar: 'https://i.pravatar.cc/40?img=2' },
    { _id: '3', name: 'Ravi Kumar', email: 'ravi@wipro.com', mobile: '+91 99887 77665', position: 'Recruiter', company: 'Wipro', status: 'verified', avatar: 'https://i.pravatar.cc/40?img=3' }
  ];

  seekerData: any[] = [
    { _id: '11', name: 'Arjun Reddy', mobile: '+91 98765 11111', experience: '3 Years', position: 'Frontend Developer', status: 'verified', avatar: 'https://i.pravatar.cc/40?img=11' },
    { _id: '12', name: 'Meena Kapoor', mobile: '+91 91234 22222', experience: '2 Years', position: 'Backend Developer', status: 'pending', avatar: 'https://i.pravatar.cc/40?img=12' },
    { _id: '13', name: 'Karthik N', mobile: '+91 99887 33333', experience: '5 Years', position: 'Fullstack Developer', status: 'verified', avatar: 'https://i.pravatar.cc/40?img=13' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private ngZone: NgZone
  ) { }


  chart: any;
  pieChart: any;
  barChart: any;


  options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: true, color: 'rgba(0,0,0,0.02)' } },
      x: { grid: { display: false } }
    }
  };

  ngAfterViewInit() {
    this.initTables();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.createChart();
        this.createCategoryPieChart();
        this.createCategoryBarChart();
      }, 100);
    }
  }

  initTables() {
    this.recruiterColumns = [
      { name: 'Recruiter', template: this.userTpl, width: '200px' },
      { name: 'Mobile', prop: 'mobile', width: '150px' },
      { name: 'Position', prop: 'position', width: '150px' },
      { name: 'Company', prop: 'company', width: '120px' },
      { name: 'Status', template: this.statusTpl, width: '100px', center: true }
    ];

    this.seekerColumns = [
      { name: 'Job Seeker', template: this.userTpl, width: '200px' },
      { name: 'Mobile', prop: 'mobile', width: '150px' },
      { name: 'Experience', prop: 'experience', width: '100px' },
      { name: 'Position', prop: 'position', width: '180px' },
      { name: 'Status', template: this.statusTpl, width: '100px', center: true }
    ];

    this.recruiterActions = [
      { label: 'View Profile', icon: 'bi-person', callback: (row: any) => console.log('View', row) },
      { label: 'Verify User', icon: 'bi-check-circle', callback: (row: any) => row.status = 'verified' },
      { label: 'Block User', icon: 'bi-slash-circle', variant: 'danger', callback: (row: any) => console.log('Block', row) }
    ];

    this.seekerActions = [...this.recruiterActions];
  }

  createChart() {
    if (this.chart) this.chart.destroy();
    try {
      const ctx = this.myChartRef.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            { label: 'Applications', data: [120, 150, 180, 200, 170, 160, 190, 210, 230, 220, 200, 250], backgroundColor: 'rgba(59, 130, 246, 0.7)', borderRadius: 6 },
            { label: 'Hired', data: [40, 60, 70, 80, 65, 55, 75, 90, 100, 95, 85, 110], backgroundColor: 'rgba(16, 185, 129, 0.7)', borderRadius: 6 },
            { label: 'Rejected', data: [80, 90, 110, 120, 105, 100, 115, 120, 130, 125, 115, 140], backgroundColor: 'rgba(239, 68, 68, 0.7)', borderRadius: 6 }
          ]
        },
        options: this.options
      });
    } catch (e) { console.error('Chart error:', e); }
  }

  createCategoryPieChart() {
    if (this.pieChart) this.pieChart.destroy();
    try {
      const ctx = this.pieRef.nativeElement.getContext('2d');
      this.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'DevOps'],
          datasets: [{
            data: [120, 90, 150, 80, 60],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
        }
      });
    } catch (e) { console.error('Pie chart error:', e); }
  }

  createCategoryBarChart() {
    if (this.barChart) this.barChart.destroy();
    try {
      const ctx = this.barRef.nativeElement.getContext('2d');
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'DevOps'],
          datasets: [{
            label: 'Applications',
            data: [300, 250, 400, 180, 120],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } },
          plugins: { legend: { display: false } }
        }
      });
    } catch (e) { console.error('Bar chart error:', e); }
  }
}
