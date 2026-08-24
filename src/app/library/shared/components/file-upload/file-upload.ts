import { Component, Input } from '@angular/core';

export type FileUploadMode = 'file' | 'avatar';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload {

  @Input() mode: FileUploadMode = 'file';

  // File upload UI
  @Input() title = 'Drag & drop your file here';
  @Input() browseText = 'or click to browse';
  @Input() acceptedFormats =
    'PDF, DOC, DOCX, XLS, XLSX, PPT, ZIP, RAR, PNG, JPG, JPEG';
  @Input() maxSize = '10MB';

  // Avatar upload UI
  @Input() avatarTitle = 'Click to upload profile photo';
  @Input() avatarFormats = 'JPG, PNG';
  @Input() avatarMaxSize = '5MB';

  // Optional avatar preview
  @Input() previewUrl: string | null = null;

  isDragging = false;
}