import { Component, OnInit, inject, signal, TemplateRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PortfolioService } from '../../../../../core/services/portfolio.service';
import { Portfolio, PortfolioMedia } from '../../../../../core/model/portfolio.model';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FilePreviewComponent } from '../../../../../shared/components/file-preview/file-preview.component';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { Table } from '../../../../../shared/components/table/table.component';
import { TableColumn } from '@swimlane/ngx-datatable';

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
    ReactiveFormsModule,
    Table
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  private portfolioService = inject(PortfolioService);
  private toastr = inject(ToastrService);

  private fb = inject(FormBuilder);

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  isSaving = signal(false);
  isFormOpen = signal(false);

  private refresh$ = new BehaviorSubject<void>(undefined);

  items = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.portfolioService.getMyPortfolio()),
      catchError(err => {
        console.error(err);
        return of([]);
      })
    ),
    { initialValue: [] as Portfolio[] }
  );

  // Form Fields
  portfolioForm!: FormGroup;
  isEditing = signal(false);
  editId = signal('');
  mediaItems = signal<PortfolioMedia[]>([]);
  tempUploadUrl = signal<string | null>(null);
  showUploader = signal(false);

  // Table & Actions
  @ViewChild('indexTemplate', { static: true }) indexTemplate!: TemplateRef<any>;
  @ViewChild('mediaTemplate', { static: true }) mediaTemplate!: TemplateRef<any>;
  @ViewChild('tagsTemplate', { static: true }) tagsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  columns: TableColumn[] = [];
  activeActionRow: Portfolio | null = null;
  menuTop: number = 0;
  menuLeft: number = 0;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.activeActionRow) {
      const target = event.target as HTMLElement;
      if (!target.closest('.action-dropdown') && !target.closest('.action-menu')) {
        this.closeActionMenu();
      }
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        { name: 'S.No', prop: 'index', cellTemplate: this.indexTemplate, width: 60, sortable: false },
        { name: 'Media', prop: 'media', cellTemplate: this.mediaTemplate, width: 100, sortable: false },
        { name: 'Title', prop: 'title', width: 200 },
        { name: 'Project Type', prop: 'projectType', width: 150 },
        { name: 'Role', prop: 'role', width: 150 },
        { name: 'Tags', prop: 'tags', cellTemplate: this.tagsTemplate, width: 250 },
        { name: 'Actions', prop: 'actions', cellTemplate: this.actionsTemplate, sortable: false, width: 100 }
      ];
    });
  }

  initForm(): void {
    this.portfolioForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      role: ['', Validators.required],
      projectType: ['', Validators.required],
      techInput: ['', Validators.required], // Comma-separated list e.g. "Angular, TypeScript, CSS"
      projectUrl: ['']
    });
  }

  loadPortfolio(): void {
    this.refresh$.next();
  }
  openCreateForm(): void {
    this.resetForm();
    this.isEditing.set(false);
    this.showUploader.set(true);
    this.isFormOpen.set(true);
  }

  onSubmit(): void {
    if (this.portfolioForm.invalid) {
      this.portfolioForm.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields.', 'My Portfolio');
      return;
    }

    const formValues = this.portfolioForm.getRawValue();
    const techArray = formValues.techInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);

    const payload = {
      title: formValues.title,
      description: formValues.description,
      role: formValues.role,
      projectType: formValues.projectType,
      tags: techArray,
      media: this.mediaItems(),
      projectUrl: formValues.projectUrl || undefined,
    };

    if (this.isEditing()) {
      this.portfolioService.updatePortfolio(this.editId(), payload).subscribe({
        next: () => {
          this.isSaving.set(true);
          this.toastr.success('New portfolio project added!', 'My Portfolio');
          this.closeFormModal();
          setTimeout(() => {
            this.loadPortfolio();
            this.isSaving.set(false);
          }, 2000);
        },
        error: (err: any) => {
          this.toastr.error('Failed to update portfolio project.', 'My Portfolio');
          console.error(err);
        },
      });
    } else {
      this.portfolioService.createPortfolio(payload).subscribe({
        next: () => {
          this.isSaving.set(true);
          this.toastr.success('Portfolio project updated successfully!', 'My Portfolio');
          this.closeFormModal();
          setTimeout(() => {
            this.loadPortfolio();
            this.isSaving.set(false);
          }, 2000);
        },
        error: (err: any) => {
          this.toastr.error('Failed to add portfolio project.', 'My Portfolio');
          console.error(err);
        },
      });
    }
  }

  editItem(item: Portfolio): void {
    this.isEditing.set(true);
    this.editId.set(item._id || '');

    this.portfolioForm.patchValue({
      title: item.title,
      description: item.description,
      role: item.role,
      projectType: item.projectType || '',
      techInput: item.tags.join(', '),
      projectUrl: item.projectUrl || ''
    });

    this.mediaItems.set([...item.media]);
    this.showUploader.set(false);
    this.isFormOpen.set(true);
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      this.portfolioService.deletePortfolio(id).subscribe({
        next: () => {
          this.isSaving.set(true);
          this.toastr.success('Project deleted from portfolio.', 'My Portfolio');
          setTimeout(() => {
            this.loadPortfolio();
            this.isSaving.set(false);
          }, 2000);
        },
        error: (err: any) => {
          this.toastr.error('Failed to delete portfolio project.', 'My Portfolio');
          console.error(err);
        },
      });
    }
  }

  onUploadSuccess(url: string): void {
    if (!url) return;
    const isVideo = /\.(mp4|webm|ogg|mov|avi|flv|mkv|wmv)/i.test(url);
    this.mediaItems.update(items => [...items, {
      mediaType: isVideo ? 'video' : 'image',
      url: url,
    }]);
    this.tempUploadUrl.set(null); // Reset value so user can upload more files
    this.toastr.success(
      `Added ${isVideo ? 'video' : 'image'} to project showcase.`,
      'Upload Media',
    );
  }

  removeMedia(index: number): void {
    this.mediaItems.update(items => items.filter((_, i) => i !== index));
    this.toastr.info('Media attachment removed.', 'Upload Media');
  }

  resetForm(): void {
    this.isEditing.set(false);
    this.editId.set('');

    if (this.portfolioForm) {
      this.portfolioForm.reset({
        title: '',
        description: '',
        role: '',
        projectType: '',
        techInput: '',
        projectUrl: ''
      });
    }

    this.mediaItems.set([]);
    this.showUploader.set(false);
  }

  closeFormModal(): void {
    this.resetForm();
    this.isFormOpen.set(false);
  }

  toggleActionMenu(event: MouseEvent, row: Portfolio): void {
    event.stopPropagation();
    if (this.activeActionRow && this.activeActionRow._id === row._id) {
      this.closeActionMenu();
    } else {
      this.activeActionRow = row;
      const target = (event.currentTarget as HTMLElement).closest('.action-trigger') || event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      this.menuTop = rect.bottom + window.scrollY + 8;
      this.menuLeft = rect.right + window.scrollX - 220;
    }
  }

  closeActionMenu(): void {
    this.activeActionRow = null;
  }
}
