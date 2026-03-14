import { Component, AfterViewInit } from '@angular/core';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

Chart.register(DoughnutController, ArcElement, Tooltip);

@Component({
  selector: 'app-resume-ats-report',
  imports: [FormsModule,CommonModule,RouterModule ],
  templateUrl: './resume-ats-report.html',
  styleUrl: './resume-ats-report.css',
})
export class ResumeAtsReport implements AfterViewInit{

  getScoreColor(score:number): string {

  if(score >= 80) return '#28a745';   // green
  if(score >= 50) return '#fdbd0d';   // blue
  return '#dc3545';                   // red

}


getMatchLabel(score:number): string {

  if(score >= 80) return 'Excellent Match';
  if(score >= 50) return 'Average Match';
  return 'Poor Match';

}

getBadgeClass(score:number): string {

  if(score >= 80) return 'bg-success';
  if(score >= 50) return 'bg-warning text-dark';
  return 'bg-danger';

}


atsScore = 85;

ngAfterViewInit(): void {

  const ctx = document.getElementById('atsScoreChart') as HTMLCanvasElement;

  const scoreColor = this.getScoreColor(this.atsScore);

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100],   // start from 0
        backgroundColor: [
          scoreColor,
          '#e9ecef'
        ],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      plugins: {
        tooltip: { enabled:false }
      }
    }
  });

  // trigger animation after render
  setTimeout(() => {

    chart.data.datasets[0].data = [
      this.atsScore,
      100 - this.atsScore
    ];

    chart.update();

  }, 100);

}



}
