import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { ToastService } from '../../../../core/services/ui/toast.service';
import { Button } from '../../../ui/components/button/button';
import { Badge } from '../../../ui/components/badge/badge';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [CommonModule, Button, Badge],
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

  get categoryVariant(): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' {
    const cat = (this.report?.category || this.report?.type || '').toLowerCase();
    if (cat.includes('user') || cat.includes('client')) return 'info';
    if (cat.includes('finan') || cat.includes('revenue') || cat.includes('pay')) return 'success';
    if (cat.includes('contract') || cat.includes('audit')) return 'warning';
    if (cat.includes('system') || cat.includes('error')) return 'danger';
    return 'primary';
  }

  get categoryIcon(): string {
    const cat = (this.report?.category || this.report?.type || '').toLowerCase();
    if (cat.includes('user') || cat.includes('client')) return 'bi bi-people';
    if (cat.includes('finan') || cat.includes('revenue')) return 'bi bi-currency-dollar';
    if (cat.includes('contract')) return 'bi bi-file-earmark-text';
    if (cat.includes('audit')) return 'bi bi-shield-check';
    return 'bi bi-file-earmark-bar-graph';
  }

  downloadReport() {
    const id = this.report?._id || this.report?.id;
    if (!id) return;

    this.isDownloading = true;
    this.adminService.downloadReportFile(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = (this.report?.title || 'report').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${filename}.xlsx`;
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
