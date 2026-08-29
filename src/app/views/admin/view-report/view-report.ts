import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [DatePipe],
  templateUrl: './view-report.html',
  styleUrl: './view-report.css'
})
export class ViewReport implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart: any;
  
  reportId: string | null = null;
  report: any = null;
  data: any = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.reportId = params.get('id');
      if (this.reportId) {
        this.fetchReportData();
      }
    });
  }

  fetchReportData() {
    this.isLoading = true;
    this.adminService.getReportData(this.reportId!).subscribe({
      next: (res) => {
        if (res.success) {
          this.report = res.report;
          this.data = res.data;
          // Use setTimeout to wait for the DOM to render the canvas before drawing the chart
          setTimeout(() => this.renderChart(), 0);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching report data', err);
        this.isLoading = false;
      }
    });
  }

  printReport() {
    window.print();
  }

  renderChart() {
    if (!this.data || !this.data.chartData || !this.chartCanvas) return;
    
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.data.chartData.map((d: any) => d.monthName);
    
    let dataset1Label = 'Value 1';
    let dataset2Label = 'Value 2';
    
    if (this.report.category === 'Users') {
       dataset1Label = 'Clients Joined';
       dataset2Label = 'Freelancers Joined';
    } else if (this.report.category === 'Contracts') {
       dataset1Label = 'Total Contracts';
       dataset2Label = 'Completed Contracts';
    } else {
       dataset1Label = 'Total Volume (₹)';
       dataset2Label = 'Commissions (₹)';
    }

    const data1 = this.data.chartData.map((d: any) => d.value1);
    const data2 = this.data.chartData.map((d: any) => d.value2);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: dataset1Label,
            data: data1,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          },
          {
            label: dataset2Label,
            data: data2,
            borderColor: '#198754',
            backgroundColor: 'rgba(25, 135, 84, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
