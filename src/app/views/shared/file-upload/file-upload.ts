import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadService } from '../../../core/services/file-upload-service';
import { BucketKey } from '../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../core/enums/upload-section.constant';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  standalone: true
})
export class FileUpload {

  @Input() bucketKey!: BucketKey;
  @Input() section!: UploadSection;
  @Input() accept = '*/*';

  // ✅ parent decides pre-login or not
  @Input() preLoginUserId?: string;

  @Output() uploaded = new EventEmitter<string>();

  uploading = false;
  progress = 0;

  constructor(private uploadService: FileUploadService) {}

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploading = true;
    this.progress = 0;

    this.uploadService
      .uploadFile(file, this.bucketKey, this.section, this.preLoginUserId)
      .subscribe({
        next: (event) => {

          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = Math.round((event.loaded / event.total) * 100);
          }

          if (event.type === HttpEventType.Response && event.body) {
            this.uploaded.emit(event.body.url);
            this.uploading = false;
          }
        },
        error: () => {
          this.uploading = false;
        }
      });
  }
}
