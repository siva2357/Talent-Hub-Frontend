import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastService } from '../../../../core/services/ui/toast.service';


@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './report-card.html',
  styleUrl: './report-card.css'
})
export class ReportCard {
  @Input() report: any;
  isDownloading = false;

  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) { }

  downloadReport() {
    if (!this.report || !this.report.id) return;

    this.isDownloading = true;
    this.adminService.downloadReportFile(this.report.id).subscribe({
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
      error: (err) => {
        console.error('Download error:', err);
        this.toastService.show('Failed to download report.', 'error');
        this.isDownloading = false;
      }
    });
  }
}
