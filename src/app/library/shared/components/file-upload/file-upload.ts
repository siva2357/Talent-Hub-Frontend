import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FileService } from '../../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../../core/enums/upload.enum';
import { CommonModule } from '@angular/common';

export type FileUploadMode = 'file' | 'avatar';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload {

  private fileService = inject(FileService);

  @Input() mode: FileUploadMode = 'file';

  // File upload UI
  @Input() title = 'Drag & drop your file here';
  @Input() browseText = 'or click to browse';
  @Input() acceptedFormats = ['PDF, DOC, DOCX, XLS, XLSX, PPT, ZIP, RAR, PNG, JPG, JPEG'];
  @Input() maxSize = '10MB';

  // Avatar upload UI
  @Input() avatarTitle = 'Click to upload profile photo';
  @Input() avatarFormats = 'JPG, PNG';
  @Input() avatarMaxSize = '5MB';

  // Optional avatar preview
  @Input() previewUrl: string | null = null;

  // Upload configuration
  @Input() uploadBucket?: UploadBucket;
  @Input() uploadSection?: UploadSection;
  @Input() replaceExisting: boolean = false;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() uploadComplete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<string>();

  isDragging = false;
  isUploading = false;

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.fileSelected.emit(file);

      // If upload config is provided, handle the upload internally
      if (this.uploadBucket && this.uploadSection) {
        this.isUploading = true;
        this.fileService.uploadFile(file, this.uploadBucket, this.uploadSection, '', this.replaceExisting).subscribe({
          next: (res) => {
            this.isUploading = false;
            if (res.success) {
              this.uploadComplete.emit(res.url);
            } else {
              this.uploadError.emit(res.message);
            }
          },
          error: (err) => {
            this.isUploading = false;
            this.uploadError.emit(err.error?.message || 'Upload failed');
          }
        });
      }
    }
    // reset input so same file can be selected again
    event.target.value = null;
  }
}