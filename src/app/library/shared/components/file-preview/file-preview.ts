import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilePreviewMode = 'image' | 'profile' | 'document';

@Component({
  selector: 'app-file-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css'
})
export class FilePreview {

  @Input() mode: FilePreviewMode | null = null;
  @Input() previewUrl: string | null = null;
  @Input() files: any[] = [];
  
  @Output() editClicked = new EventEmitter<void>();
  @Output() downloadClicked = new EventEmitter<any>();
  @Output() removeClicked = new EventEmitter<any>();

  getFileTypeClass(file: any): string {
    const name = (file?.fileName || file?.name || file?.fileUrl || file?.url || '').toLowerCase();
    if (name.endsWith('.pdf')) return 'bg-pdf';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'bg-word';
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'bg-excel';
    if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'bg-ppt';
    if (name.endsWith('.zip') || name.endsWith('.rar')) return 'bg-zip';
    return 'bg-generic';
  }

  getFileIcon(file: any): string {
    const name = (file?.fileName || file?.name || file?.fileUrl || file?.url || '').toLowerCase();
    if (name.endsWith('.pdf')) return 'bi bi-file-earmark-pdf';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'bi bi-file-earmark-word';
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'bi bi-file-earmark-excel';
    if (name.endsWith('.ppt') || name.endsWith('.pptx')) return 'bi bi-file-earmark-ppt';
    if (name.endsWith('.zip') || name.endsWith('.rar')) return 'bi bi-file-earmark-zip';
    if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp')) return 'bi bi-file-earmark-image';
    return 'bi bi-file-earmark';
  }
}