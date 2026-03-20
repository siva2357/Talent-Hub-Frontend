import { Component, AfterViewInit, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart, { ChartOptions } from 'chart.js/auto';
import { RouterModule } from '@angular/router';
import { Table } from '../../../components/table/table';
interface DashboardCard {
  title: string;
  description: string;
  chartId: string;
  data: number[];
  total?: number; // 👈 add this
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Table],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnInit {
  totalApplications = 0;
  totalHired = 0;
  totalRejected = 0;
  totalJobs = 0;

  charts: Chart<any, any, any>[] = [];

  @ViewChild('valueTemplate', { static: true })
	public valueTemplateRef!: TemplateRef<any>;


  	@ViewChild('statusTemplate', { static: true })
	public statusTemplateRef!: TemplateRef<any>;

columns: any[] = [];
  jobSeekercolumns:any[]=[]


  	constructor() {}




  ngOnInit() {
    this.dashboardCards = this.dashboardCards.map((card) => ({
      ...card,
      total: card.data.reduce((sum, v) => sum + v, 0),
    }));

    this.totalJobs = this.getSum(this.analyticsData.datasets.jobs);
    this.totalApplications = this.getSum(this.analyticsData.datasets.applications);
    this.totalHired = this.getSum(this.analyticsData.datasets.hired);
    this.totalRejected = this.totalApplications - this.totalHired;

        this.columns = [
      { name: 'ID', prop: 'id' },
      { name: 'Full Name', prop: 'name' },
      { name: 'Email', prop: 'email' },
      { name: 'Phone', prop: 'phone' },
      { name: 'Company', prop: 'company' },
      { name: 'Status', template: this.statusTemplateRef },
    ];

        this.jobSeekercolumns=[
       { name: 'ID', prop: 'id' },
      { name: 'Full Name', prop: 'name' },
      { name: 'Email', prop: 'email' },
      { name: 'Phone', prop: 'phone' },
      { name: 'Experience', prop: 'experience' },
      { name: 'Status', template: this.statusTemplateRef },
    ]

  }

  getSum(data: number[]): number {
    return data.reduce((sum, v) => sum + v, 0);
  }

  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Recruiters',
      description: 'Registered recruiters',
      chartId: 'recruiterChart',
      data: [10, 15, 12, 22, 14, 28, 35, 30, 42, 33, 50],
    },
    {
      title: 'Total Job Seekers',
      description: 'Active job seekers',
      chartId: 'seekerChart',
      data: [30, 35, 40, 45, 50, 60, 70, 80, 85, 95, 100],
    },
    {
      title: 'Total Job Applications',
      description: 'Applications submitted',
      chartId: 'applicationChart',
      data: [100, 150, 200, 250, 300, 350, 400, 450, 470, 490, 520],
    },
    {
      title: 'Total Hired Candidates',
      description: 'Successfully hired',
      chartId: 'hiredChart',
      data: [5, 8, 12, 18, 25, 30, 35, 40, 42, 45, 50],
    },
  ];

  chartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 200,
      animation: false,

      interaction: {
        intersect: false,
        mode: 'index',
      },

      plugins: {
        legend: { display: false },
      },

      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } },
      },
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createMiniChart('recruiterChart', [10, 15, 12, 22, 14, 28, 35, 30, 42, 33, 50]);
      this.createMiniChart('seekerChart', [30, 35, 40, 45, 50, 60, 70, 80, 85, 95, 100]);
      this.createMiniChart(
        'applicationChart',
        [100, 150, 200, 250, 300, 350, 400, 450, 470, 490, 520],
      );
      this.createMiniChart('hiredChart', [5, 8, 12, 18, 25, 30, 35, 40, 42, 45, 50]);
      this.createAnalyticsChart();

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);
    }, 200);
  }

  createMiniChart(id: string, dataValues: number[]) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [
          {
            data: dataValues,
            borderColor: '#3da5f4',
            backgroundColor: 'rgba(61,165,244,0.2)',
            tension: 0.4,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: this.chartOptions(),
    });

    this.charts.push(chart);
  }

  analyticsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    datasets: {
      jobs: [120, 150, 180, 200, 220, 250, 230, 240, 210, 190, 170, 260], // 👈 added
      applications: [500, 600, 720, 850, 900, 1000, 920, 980, 870, 820, 760, 1100],
      hired: [200, 250, 300, 380, 420, 500, 450, 480, 420, 390, 350, 520],
    },
  };

  createAnalyticsChart() {
    const canvas = document.getElementById('analyticsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Jobs',
            data: this.analyticsData.datasets.jobs,
            backgroundColor: '#6c757d',
          },
          {
            label: 'Applications',
            data: [500, 600, 720, 850, 900, 1000, 920, 980, 870, 820, 760, 1100],
            backgroundColor: 'rgba(61,165,244,0.74)',
          },
          {
            label: 'Hired',
            data: [200, 250, 300, 380, 420, 500, 450, 480, 420, 390, 350, 520],
            backgroundColor: '#1387df',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true },
        },
      },
    });

    this.charts.push(chart);
  }





  recruiters = [
  {
    id: '01',
    name: 'John Smith',
    email: 'johnsmith@email.com',
    phone: '+91 9876543210',
    company: 'Tech Solutions',
    status: 'Active'
  },
  {
    id: '02',
    name: 'Emma Watson',
    email: 'emma@email.com',
    phone: '+91 9876543210',
    company: 'Global Hiring',
    status: 'Inactive'
  },
  {
    id: '03',
    name: 'Michael Lee',
    email: 'michael@email.com',
    phone: '+91 9876543210',
    company: 'Future Tech',
    status: 'Active'
  },
  {
    id: '04',
    name: 'Sophia Brown',
    email: 'sophia@email.com',
    phone: '+91 9876543210',
    company: 'NextGen Corp',
    status: 'Active'
  }
];



jobSeekers = [
  {
    id: '01',
    name: 'Arjun Kumar',
    email: 'arjun@email.com',
    phone: '+91 9876543210',
    experience: '3 years',
    status: 'Active'
  },
  {
    id: '02',
    name: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 9123456780',
    experience: '6 years',
    status: 'Active'
  },
  {
    id: '03',
    name: 'Rahul Verma',
    email: 'rahul@email.com',
    phone: '+91 9988776655',
    experience: '4 years',
    status: 'Inactive'
  },
  {
    id: '04',
    name: 'Sneha Patel',
    email: 'sneha@email.com',
    phone: '+91 9871234567',
    experience: '5 years',
    status: 'Active'
  }
];

}
