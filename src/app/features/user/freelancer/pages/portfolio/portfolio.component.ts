import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../../../core/services/portfolio.service';
import { Portfolio, PortfolioMedia } from '../../../../../core/model/portfolio.model';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RichTextEditorComponent,
    FileUploadComponent,
    ButtonComponent,
    InputComponent,
    FilePreviewComponent,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private toastr = inject(ToastrService);

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  isSaving = false;
  items: Portfolio[] = [];
  isFormOpen = false;

  // Form Fields
  isEditing = false;
  editId = '';
  title = '';
  description = '';
  role = '';
  projectType = '';
  techInput = ''; // Comma-separated list e.g. "Angular, TypeScript, CSS"
  projectUrl = '';
  mediaItems: PortfolioMedia[] = [];
  tempUploadUrl: string | null = null;

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.portfolioService.getMyPortfolio().subscribe({
      next: (portfolios) => {
        console.log('PORTFOLIOS:', portfolios);

        this.items = portfolios;

        console.log('ITEMS:', this.items);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  openCreateForm(): void {
    this.resetForm();

    this.isEditing = false;

    this.showUploader = true;

    this.isFormOpen = true;
  }

  showUploader = false;

  onSubmit(): void {
    if (
      !this.title.trim() ||
      !this.description.trim() ||
      !this.role.trim() ||
      !this.projectType.trim() ||
      !this.techInput.trim()
    ) {
      this.toastr.warning('Please fill in all required fields.', 'My Portfolio');
      return;
    }

    const techArray = this.techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: this.title,
      description: this.description,
      role: this.role,
      projectType: this.projectType,
      tags: techArray,
      media: this.mediaItems,
      projectUrl: this.projectUrl || undefined,
    };

    if (this.isEditing) {
      this.portfolioService.updatePortfolio(this.editId, payload).subscribe({
        next: () => {
          this.isSaving = true;

          this.toastr.success('New portfolio project added!', 'My Portfolio');

          this.closeFormModal();

          setTimeout(() => {
            this.loadPortfolio();

            this.isSaving = false;
          }, 2000);
        },
        error: (err) => {
          this.toastr.error('Failed to update portfolio project.', 'My Portfolio');
          console.error(err);
        },
      });
    } else {
      this.portfolioService.createPortfolio(payload).subscribe({
        next: () => {
          this.isSaving = true;

          this.toastr.success('Portfolio project updated successfully!', 'My Portfolio');

          this.closeFormModal();

          setTimeout(() => {
            this.loadPortfolio();

            this.isSaving = false;
          }, 2000);
        },
        error: (err) => {
          this.toastr.error('Failed to add portfolio project.', 'My Portfolio');
          console.error(err);
        },
      });
    }
  }

  editItem(item: Portfolio): void {
    this.isEditing = true;

    this.editId = item._id || '';

    this.title = item.title;
    this.description = item.description;
    this.role = item.role;
    this.projectType = item.projectType || '';
    this.techInput = item.tags.join(', ');
    this.projectUrl = item.projectUrl || '';

    this.mediaItems = [...item.media];

    this.showUploader = false;

    this.isFormOpen = true;
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: () => {
          this.isSaving = true;

          this.toastr.success('Project deleted from portfolio.', 'My Portfolio');

          setTimeout(() => {
            this.loadPortfolio();

            this.isSaving = false;
          }, 2000);
        },
        error: (err) => {
          this.toastr.error('Failed to delete portfolio project.', 'My Portfolio');
          console.error(err);
        },
      });
    }
  }

  onUploadSuccess(url: string): void {
    if (!url) return;
    const isVideo = /\.(mp4|webm|ogg|mov|avi|flv|mkv|wmv)/i.test(url);
    this.mediaItems.push({
      mediaType: isVideo ? 'video' : 'image',
      url: url,
    });
    this.tempUploadUrl = null; // Reset value so user can upload more files
    this.toastr.success(
      `Added ${isVideo ? 'video' : 'image'} to project showcase.`,
      'Upload Media',
    );
  }

  removeMedia(index: number): void {
    this.mediaItems.splice(index, 1);
    this.toastr.info('Media attachment removed.', 'Upload Media');
  }

  resetForm(): void {
    this.isEditing = false;
    this.editId = '';
    this.title = '';
    this.description = '';
    this.role = '';
    this.projectType = '';

    this.techInput = '';

    this.projectUrl = '';

    this.mediaItems = [];

    this.showUploader = false;
  }

  closeFormModal(): void {
    this.resetForm();
    this.isFormOpen = false;
  }
}
