import { Component, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements AfterViewInit {

  chart: any;

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

  ngAfterViewInit(): void {
    this.createChart();
    this.createCategoryPieChart();
    this.createCategoryBarChart();
  }

  createChart() {
    this.chart = new Chart('myChart', {
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
  }

  createCategoryPieChart() {
  new Chart('categoryPieChart', {
    type: 'doughnut',
    data: {
      labels: ['Frontend', 'Backend', 'Fullstack', 'AI/ML', 'DevOps'],
      datasets: [{
        data: [120, 90, 150, 80, 60],
backgroundColor: [
  'rgba(54, 162, 235, 0.6)',  // blue
  'rgba(75, 192, 192, 0.6)',  // teal
  'rgba(255, 206, 86, 0.6)',  // yellow
  'rgba(153, 102, 255, 0.6)', // purple
  'rgba(255, 99, 132, 0.6)'   // red
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
}


createCategoryBarChart() {
  new Chart('categoryBarChart', {
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
}



}
