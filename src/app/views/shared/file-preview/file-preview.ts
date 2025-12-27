import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-preview',
  imports: [],
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css',
  standalone:true
})
export class FilePreview {

  @Input() fileUrl!: string;

  get fileType(): 'image' | 'pdf' | 'unknown' {
    if (!this.fileUrl) return 'unknown';
    const lower = this.fileUrl.toLowerCase();
    if (lower.match(/\.(png|jpg|jpeg|webp|gif)/)) return 'image';
    if (lower.endsWith('.pdf')) return 'pdf';

    return 'unknown';
  }
}
