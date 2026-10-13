import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button } from '../../../library/ui/components/button/button';
import { AdminService } from '../../../core/services/admin.service';

import { Report } from '../../../core/models/report.model';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  providers: [DatePipe],
  templateUrl: './report-card.html',
  styleUrl: './report-card.css'
})
export class ReportCard {
  @Input() report!: Report;
  isDownloading = false;

  constructor(private adminService: AdminService) { }

  downloadReport() {
    this.isDownloading = true;
    this.adminService.downloadReportFile(this.report.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: (err: any) => {
        console.error('Download failed', err);
        this.isDownloading = false;
      }
    });
  }
}
