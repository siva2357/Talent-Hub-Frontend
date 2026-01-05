import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css',
  standalone: true
})
export class FilePreview {

  @Input() fileUrl!: string;

  get fileType(): 'image' | 'video' | 'pdf' | 'unknown' {
    if (!this.fileUrl) return 'unknown';

    const cleanUrl = this.fileUrl.split('?')[0].toLowerCase();

    if (cleanUrl.match(/\.(png|jpg|jpeg|webp|gif)$/)) return 'image';
    if (cleanUrl.match(/\.(mp4|webm|ogg)$/)) return 'video';
    if (cleanUrl.endsWith('.pdf')) return 'pdf';

    return 'unknown';
  }

  onLoaded() {
    console.log('🎥 Video metadata loaded');
  }
}
