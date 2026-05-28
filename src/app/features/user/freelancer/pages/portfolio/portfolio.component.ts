import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService, PortfolioItem } from '../../../../../core/services/portfolio.service';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RichTextEditorComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private toastr = inject(ToastrService);

  items: PortfolioItem[] = [];
  isFormOpen = false;

  // Form Fields
  isEditing = false;
  editId = '';
  title = '';
  description = '';
  role = '';
  techInput = ''; // Comma-separated list e.g. "Angular, TypeScript, CSS"
  projectUrl = '';
  imageUrl = '';

  ngOnInit(): void {
    this.loadPortfolio();
  }

  loadPortfolio(): void {
    this.portfolioService.getPortfolioItems().subscribe({
      next: (data) => {
        this.items = data;
      }
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.isEditing = false;
    this.isFormOpen = true;
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.description.trim() || !this.role.trim() || !this.techInput.trim()) {
      this.toastr.warning('Please fill in all required fields.', 'My Portfolio');
      return;
    }

    const techArray = this.techInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const imgArg = this.imageUrl || undefined;
    const urlArg = this.projectUrl || undefined;

    if (this.isEditing) {
      this.portfolioService.deletePortfolioItem(this.editId);
      this.portfolioService.addPortfolioItem(this.title, this.description, this.role, techArray, urlArg, imgArg);
      this.toastr.success('Portfolio project updated successfully!', 'My Portfolio');
    } else {
      this.portfolioService.addPortfolioItem(this.title, this.description, this.role, techArray, urlArg, imgArg);
      this.toastr.success('New portfolio project added!', 'My Portfolio');
    }

    this.closeFormModal();
    this.loadPortfolio();
  }

  editItem(item: PortfolioItem): void {
    this.isEditing = true;
    this.editId = item.id;
    this.title = item.title;
    this.description = item.description;
    this.role = item.role;
    this.techInput = item.technologies.join(', ');
    this.projectUrl = item.projectUrl || '';
    this.imageUrl = item.imageUrl || '';
    this.isFormOpen = true;
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      this.portfolioService.deletePortfolioItem(id);
      this.toastr.success('Project deleted from portfolio.', 'My Portfolio');
      this.loadPortfolio();
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Please upload an image file only.', 'Image Upload');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.toastr.success('Project thumbnail preview loaded.', 'Image Upload');
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imageUrl = '';
    this.toastr.info('Project image removed.', 'Image Upload');
  }

  resetForm(): void {
    this.isEditing = false;
    this.editId = '';
    this.title = '';
    this.description = '';
    this.role = '';
    this.techInput = '';
    this.projectUrl = '';
    this.imageUrl = '';
  }

  closeFormModal(): void {
    this.resetForm();
    this.isFormOpen = false;
  }
}
