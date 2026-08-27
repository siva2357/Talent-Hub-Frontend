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

}