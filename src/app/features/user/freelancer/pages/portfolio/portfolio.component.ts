import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService, PortfolioItem, PortfolioMedia } from '../../../../../core/services/portfolio.service';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent, FileUploadComponent, ButtonComponent, InputComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private toastr = inject(ToastrService);

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  items: PortfolioItem[] = [];
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
    this.portfolioService.getPortfolioItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (err) => {
        console.error('Failed to load portfolio items:', err);
      }
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.isEditing = false;
    this.isFormOpen = true;
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.description.trim() || !this.role.trim() || !this.projectType.trim() || !this.techInput.trim()) {
      this.toastr.warning('Please fill in all required fields.', 'My Portfolio');
      return;
    }

    const techArray = this.techInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: this.title,
      description: this.description,
      role: this.role,
      projectType: this.projectType,
      tags: techArray,
      media: this.mediaItems,
      projectUrl: this.projectUrl || undefined
    };

    if (this.isEditing) {
      this.portfolioService.updatePortfolioItem(this.editId, payload).subscribe({
        next: () => {
          this.toastr.success('Portfolio project updated successfully!', 'My Portfolio');
          this.closeFormModal();
          this.loadPortfolio();
        },
        error: (err) => {
          this.toastr.error('Failed to update portfolio project.', 'My Portfolio');
          console.error(err);
        }
      });
    } else {
      this.portfolioService.addPortfolioItem(payload).subscribe({
        next: () => {
          this.toastr.success('New portfolio project added!', 'My Portfolio');
          this.closeFormModal();
          this.loadPortfolio();
        },
        error: (err) => {
          this.toastr.error('Failed to add portfolio project.', 'My Portfolio');
          console.error(err);
        }
      });
    }
  }

  editItem(item: PortfolioItem): void {
    this.isEditing = true;
    this.editId = item.id;
    this.title = item.title;
    this.description = item.description;
    this.role = item.role;
    this.projectType = item.projectType || '';
    this.techInput = item.tags.join(', ');
    this.projectUrl = item.projectUrl || '';
    this.mediaItems = [...item.media];
    this.isFormOpen = true;
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      this.portfolioService.deletePortfolioItem(id).subscribe({
        next: () => {
          this.toastr.success('Project deleted from portfolio.', 'My Portfolio');
          this.loadPortfolio();
        },
        error: (err) => {
          this.toastr.error('Failed to delete portfolio project.', 'My Portfolio');
          console.error(err);
        }
      });
    }
  }

  onUploadSuccess(url: string): void {
    if (!url) return;
    const isVideo = /\.(mp4|webm|ogg|mov|avi|flv|mkv|wmv)/i.test(url);
    this.mediaItems.push({
      mediaType: isVideo ? 'video' : 'image',
      url: url
    });
    this.tempUploadUrl = null; // Reset value so user can upload more files
    this.toastr.success(`Added ${isVideo ? 'video' : 'image'} to project showcase.`, 'Upload Media');
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
  }

  closeFormModal(): void {
    this.resetForm();
    this.isFormOpen = false;
  }
}
