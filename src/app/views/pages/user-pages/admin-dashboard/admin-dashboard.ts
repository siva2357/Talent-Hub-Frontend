import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { NgZone } from '@angular/core';



Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements AfterViewInit {

    @ViewChild('myChart') myChartRef!: ElementRef;
  @ViewChild('categoryPieChart') pieRef!: ElementRef;
  @ViewChild('categoryBarChart') barRef!: ElementRef;

constructor(
  @Inject(PLATFORM_ID) private platformId: any,
  private ngZone: NgZone
) {}


  chart: any;
  pieChart: any;
  barChart: any;


  options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

ngAfterViewInit() {
  console.log('AFTER VIEW INIT CALLED');

  if (isPlatformBrowser(this.platformId)) {
    console.log('IN BROWSER');

    setTimeout(() => {
      console.log('CHART INIT RUNNING');

      this.createChart();
      this.createCategoryPieChart();
      this.createCategoryBarChart();
    }, 100);
  } else {
    console.log('RUNNING ON SERVER');
  }
}

createChart() {
  if (this.chart) this.chart.destroy();

  try {
    const ctx = this.myChartRef.nativeElement.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec'
        ],
        datasets: [
          {
            label: 'Applications',
            data: [120, 150, 180, 200, 170, 160, 190, 210, 230, 220, 200, 250],
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          },
          {
            label: 'Hired',
            data: [40, 60, 70, 80, 65, 55, 75, 90, 100, 95, 85, 110],
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          },
          {
            label: 'Rejected',
            data: [80, 90, 110, 120, 105, 100, 115, 120, 130, 125, 115, 140],
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
          }
        ]
      },
      options: this.options
    });

  } catch (e) {
    console.error('Chart error:', e);
  }
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
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });

  } catch (e) {
    console.error('Pie chart error:', e);
  }
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
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

  } catch (e) {
    console.error('Bar chart error:', e);
  }
}



}
