import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css',
  standalone: true
})
export class FilePreview {

  @Input() fileUrl!: string;

  constructor(private sanitizer: DomSanitizer) {}

  get safeUrl(): SafeResourceUrl | null {
    if (!this.fileUrl) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
  }

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
