import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.css'
})
export class FilePreviewComponent {
  @Input() url: string = '';
  @Input() fileName: string = '';
  @Input() disabled: boolean = false;
  
  @Output() remove = new EventEmitter<void>();

  get isImage(): boolean {
    if (!this.url) return false;
    const cleanUrl = this.url.toLowerCase().split('?')[0];
    return cleanUrl.endsWith('.jpg') || 
           cleanUrl.endsWith('.jpeg') || 
           cleanUrl.endsWith('.png') || 
           cleanUrl.endsWith('.gif') || 
           cleanUrl.endsWith('.webp') ||
           cleanUrl.endsWith('.svg') ||
           this.url.startsWith('data:image');
  }

  get parsedFileName(): string {
    if (this.fileName) return this.fileName;
    if (!this.url) return 'Uploaded File';
    try {
      const decoded = decodeURIComponent(this.url);
      const parts = decoded.split('/');
      const lastPart = parts[parts.length - 1];
      // Strip GCP/AWS UUID prefix if present in the filename
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;
      const timePrefixRegex = /^\d{13}-/;
      return lastPart.replace(uuidRegex, '').replace(timePrefixRegex, '');
    } catch (e) {
      return 'File';
    }
  }

  get fileIcon(): string {
    const cleanUrl = this.url.toLowerCase().split('?')[0];
    if (cleanUrl.endsWith('.pdf')) return 'bi-file-earmark-pdf';
    if (cleanUrl.endsWith('.doc') || cleanUrl.endsWith('.docx')) return 'bi-file-earmark-word';
    if (cleanUrl.endsWith('.xls') || cleanUrl.endsWith('.xlsx')) return 'bi-file-earmark-excel';
    if (cleanUrl.endsWith('.zip') || cleanUrl.endsWith('.rar')) return 'bi-file-earmark-zip';
    return 'bi-file-earmark-arrow-up';
  }

  onRemove(event: MouseEvent): void {
    if (this.disabled) return;
    event.stopPropagation();
    this.remove.emit();
  }
}
