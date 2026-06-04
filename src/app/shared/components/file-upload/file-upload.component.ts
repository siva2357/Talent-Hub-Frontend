import { Component, Input, Output, EventEmitter, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UploadService } from '../../../core/services/upload.service';
import { BucketKey, UploadSection } from '../../../core/enums/upload.enum';
import { FilePreviewComponent } from '../file-preview/file-preview.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FilePreviewComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  private uploadService = inject(UploadService);

  @Input() variant: 'avatar' | 'dragdrop' = 'dragdrop';
  @Input() label: string = '';
  @Input() placeholder: string = 'Drag & drop your file here or click to browse';
  @Input() accept: string = '';
  @Input() maxSizeMb: number = 5;
  @Input() bucketKey: BucketKey = BucketKey.FreelancerData;
  @Input() uploadSection: UploadSection = UploadSection.ProfilePhoto;
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;

  @Output() uploadSuccess = new EventEmitter<string>();
  @Output() uploadSuccessDetailed = new EventEmitter<{ url: string; fileName: string; fileSize: string; fileType: string }>();
  @Output() uploadStart = new EventEmitter<void>();
  @Output() uploadError = new EventEmitter<string>();
  @Output() fileRemoved = new EventEmitter<void>();

  // Internal state
  value: string | null = null;
  isUploading = false;
  uploadProgress = 0;
  errorMessage: string | null = null;
  isDragOver = false;

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get defaultAccept(): string {
    if (this.accept) return this.accept;
    return this.variant === 'avatar' ? 'image/*' : '*/*';
  }

  triggerFileInput(): void {
    if (this.disabled || this.isUploading) return;
    const fileInput = document.getElementById(this.fileInputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  get fileInputId(): string {
    return 'file-input-' + this.label.replace(/\s+/g, '-').toLowerCase() || 'generic-file-input';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  // Drag and Drop handlers
  onDragOver(event: DragEvent): void {
    if (this.disabled || this.isUploading) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    if (this.disabled || this.isUploading) return;
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File): void {
    // Check file size
    const fileSizeInMb = file.size / (1024 * 1024);
    if (fileSizeInMb > this.maxSizeMb) {
      const errorMsg = `File size exceeds the maximum limit of ${this.maxSizeMb}MB.`;
      this.errorMessage = errorMsg;
      this.uploadError.emit(errorMsg);
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.uploadStart.emit();

    this.uploadService.uploadFile(file, this.bucketKey, this.uploadSection, true).subscribe({
      next: (res) => {
        this.isUploading = false;
        if (res.success && res.url) {
          this.value = res.url;
          this.onChange(this.value);
          this.uploadSuccess.emit(res.url);

          const formattedSize = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

          this.uploadSuccessDetailed.emit({
            url: res.url,
            fileName: file.name,
            fileType: file.type || file.name.split('.').pop() || '',
            fileSize: formattedSize
          });
        } else {
          const errorMsg = res.message || 'Upload failed.';
          this.errorMessage = errorMsg;
          this.uploadError.emit(errorMsg);
        }
      },
      error: (err) => {
        this.isUploading = false;
        const errorMsg = err.error?.message || 'Failed to upload file.';
        this.errorMessage = errorMsg;
        this.uploadError.emit(errorMsg);
      }
    });
  }

  removeFile(): void {
    if (this.disabled || this.isUploading) return;
    this.value = null;
    this.onChange(this.value);
    this.fileRemoved.emit();
    this.errorMessage = null;
  }
}
