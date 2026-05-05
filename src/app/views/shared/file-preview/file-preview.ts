import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css',
  imports: [CommonModule],
  standalone: true
})
export class FilePreview {

  @Input() fileUrl!: string;
@Input() mode: 'full' | 'avatar' = 'full';

  constructor(private sanitizer: DomSanitizer) {}

  get safeUrl(): SafeResourceUrl | null {
    if (!this.fileUrl) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
  }

  get fileType(): 'image' | 'video' | 'pdf' | 'unknown' {
    if (!this.fileUrl) return 'unknown';

    const cleanUrl = this.fileUrl.split('?')[0].toLowerCase();

    if (cleanUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)$/)) return 'image';
    if (cleanUrl.match(/\.(mp4|webm|ogg)$/)) return 'video';
    if (cleanUrl.endsWith('.pdf')) return 'pdf';

    return 'unknown';
  }

  onLoaded() {
    console.log('🎥 Video metadata loaded');
  }
}
