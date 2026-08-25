import { Component, EventEmitter, Input, Output } from '@angular/core';

export type FilePreviewMode = 'image' | 'profile' | 'document';

@Component({
  selector: 'app-file-preview',
  standalone: true,
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css'
})
export class FilePreview {

  @Input() mode: FilePreviewMode | null = null;
  @Input() previewUrl: string | null = null;
  @Output() editClicked = new EventEmitter<void>();

}