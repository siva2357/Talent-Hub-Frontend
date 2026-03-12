import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart, { ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements AfterViewInit {

charts: Chart<any, any, any>[] = [];

chartOptions(): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 200,
    animation: false,

    interaction:{
      intersect:false,
      mode:'index'
    },

    plugins:{
      legend:{ display:false }
    },

    scales:{
      x:{ display:false, grid:{display:false}},
      y:{ display:false, grid:{display:false}}
    }
  };
}


ngAfterViewInit(): void {

  setTimeout(() => {

    this.createMiniChart('recruiterChart',[10,15,12,22,14,28,35,30,42,33,50]);
    this.createMiniChart('seekerChart',[30,35,40,45,50,60,70,80,85,95,100]);
    this.createMiniChart('applicationChart',[100,150,200,250,300,350,400,450,470,490,520]);
    this.createMiniChart('hiredChart',[5,8,12,18,25,30,35,40,42,45,50]);
    this.createAnalyticsChart();
    
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    },200);

  },200);

}

  createMiniChart(id: string, dataValues: number[]) {

    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"],
        datasets: [{
          data: dataValues,
          borderColor: "#3da5f4",
          backgroundColor: "rgba(61,165,244,0.2)",
          tension: 0.4,
          pointRadius: 0,
          fill: true
        }]
      },
      options: this.chartOptions()
    });

    this.charts.push(chart);
  }

  createAnalyticsChart() {

    const canvas = document.getElementById('analyticsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [
          {
            label: "Applications",
            data: [500,600,720,850,900,1000,920,980,870,820,760,1100],
            backgroundColor: "rgba(61,165,244,0.74)"
          },
          {
            label: "Hired",
            data: [200,250,300,380,420,500,450,480,420,390,350,520],
            backgroundColor: "#1387df"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" }
        },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      }
    });

    this.charts.push(chart);
  }

}
