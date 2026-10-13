import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, TemplateRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { Chart, registerables } from 'chart.js';
import { Button } from '../../../library/ui/components/button/button';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Pagination } from '../../../library/ui/components/pagination/pagination';

Chart.register(...registerables);


@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [RouterLink, CommonModule, Button, Badge, Table, InputField, Pagination],
  providers: [DatePipe],
  templateUrl: './view-report.html',
  styleUrl: './view-report.css'
})
export class ViewReport implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  @ViewChild('cellTemplate', { static: true }) cellTemplate!: TemplateRef<any>;
  chart: any;

  reportId: string | null = null;
  report: any = null;
  data: any = null;
  isLoading = true;
  isDownloading = false;

  periodControl = 'yearly';
  periodOptions: InputOption[] = [
    { label: 'Current Financial Year', value: 'yearly' },
    { label: 'First Half (H1)', value: 'h1' },
    { label: 'Second Half (H2)', value: 'h2' },
    { label: 'Quarter 1 (Q1)', value: 'q1' },
    { label: 'Quarter 2 (Q2)', value: 'q2' },
    { label: 'Quarter 3 (Q3)', value: 'q3' },
    { label: 'Quarter 4 (Q4)', value: 'q4' }
  ];

  tableColumns: TableColumn[] = [];

  currentPage = 1;
  pageSize = 10;

  get paginatedData() {
    if (!this.data || !this.data.tableData) return [];
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.data.tableData.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toastService: ToastService
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
    this.adminService.getReportData(this.reportId!, this.periodControl).subscribe({
      next: (res) => {
        if (res.success) {
          this.report = res.report;
          this.data = res.data;
          this.setupTableColumns();
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

  onPeriodChange(val: string) {
    this.periodControl = val;
    this.fetchReportData();
  }



  downloadReport() {
    if (!this.report || !this.report.id) return;

    this.isDownloading = true;
    this.adminService.downloadReportFile(this.report.id, this.periodControl).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.toastService.show('Report downloaded successfully!', 'success');
        this.isDownloading = false;
      },
      error: (err: any) => {
        console.error('Download error:', err);
        this.toastService.show('Failed to download report.', 'error');
        this.isDownloading = false;
      }
    });
  }

  setupTableColumns() {
    if (!this.data || !this.data.tableHeaders) return;
    this.tableColumns = this.data.tableHeaders.map((header: any) => {
      return {
        field: header.key,
        headerName: header.label,
        cellTemplate: this.cellTemplate,
        flexGrow: 1
      };
    });
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

  isBadge(val: any): boolean {
    if (typeof val !== 'string') return false;
    const v = val.toLowerCase();
    return ['draft', 'open', 'in progress', 'completed', 'closed', 'client', 'freelancer', 'active', 'inactive', 'suspended', 'banned'].includes(v);
  }
}
