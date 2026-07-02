import { AfterViewInit, Component, HostListener, OnInit, TemplateRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from '../../../../../core/services/blog.service';
import { Blog } from '../../../../../core/model/blog.model';
import { CreateBlogDto, UpdateBlogDto } from '../../../../../core/DTOs/blog.dto';
import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { Table } from '../../../../../shared/components/table/table.component';
import { FilePreviewComponent } from "../../../../../shared/components/file-preview/file-preview.component";
import { BadgeComponent } from '../../../../../shared/components/badge/badge.component';
import { DateTimeHelper } from '../../../../../core/helpers/date-time.helper';
import { AlertModalService } from '../../../../../core/services/alert-modal.service';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, FileUploadComponent, RichTextEditorComponent, Table, FilePreviewComponent, BadgeComponent],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})


export class BlogPostComponent implements OnInit, AfterViewInit {
  DateTimeHelper = DateTimeHelper;

  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private toastr = inject(ToastrService);
  private alertModalService = inject(AlertModalService);


  bucketKey = BucketKey.AdminCollection;
  uploadSection = UploadSection.BlogMedia;
  posts = signal<Blog[]>([]);
  rows = signal<any[]>([]);
  columns: any[] = [];
  isFormOpen = signal(false);
  isEditing = signal(false);
  editId = signal('');
  saving = signal(false);
  openMenuId = signal<string | null>(null);
  form!: FormGroup;
  loadingPosts = signal(false);
  categoryOptions = [
    { label: 'Technology', value: 'Technology' },
    { label: 'Career', value: 'Career' },
    { label: 'Freelancing', value: 'Freelancing' },
    { label: 'Business', value: 'Business' }
  ];
  statusOptions = [
    { label: 'Published', value: 'Published' },
    { label: 'Draft', value: 'Draft' }
  ];

  menuTop = 0;
  menuLeft = 0;
  activeActionRow: any = null;

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return null;
    }
    if (control.errors['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email';
    }
    return 'Invalid value';
  }


  @ViewChild('indexTemplate', { static: true })
  indexTemplate!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;

  @ViewChild('dateTemplate', { static: true })
  dateTemplate!: TemplateRef<any>;

  @ViewChild('mediaTemplate', { static: true })
  mediaTemplate!: TemplateRef<any>;

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  ngOnInit(): void {
    this.initializeForm();
    this.columns = [
      {
        name: 'S.No',
        prop: 'index',
        width: 80,
        sortable: false,
        cellTemplate: this.indexTemplate
      },
      {
        name: 'Media',
        prop: 'media',
        width: 100,
        sortable: false,
        cellTemplate: this.mediaTemplate
      },
      {
        name: 'Title',
        prop: 'title',
        width: 300
      },
      {
        name: 'Category',
        prop: 'category',
        width: 180
      },
      {
        name: 'Status',
        prop: 'status',
        width: 150,
        cellTemplate: this.statusTemplate
      },
      {
        name: 'Created',
        prop: 'createdAt',
        width: 220,
        cellTemplate: this.dateTemplate
      },
      {
        name: 'Actions',
        prop: 'actions',
        width: 100,
        sortable: false,
        cellTemplate: this.actionTemplate
      }
    ];
    this.loadPosts();
  }

  ngAfterViewInit(): void {
  }

  initializeForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      mediaUrl: [''],
      status: ['Draft', Validators.required]
    });
  }

  loadPosts(): void {
    this.loadingPosts.set(true);
    this.blogService.getAllBlogsAdmin().subscribe({

      next: ({ blogs }) => {
        this.posts.set(blogs);
        this.rows.set(blogs.map((post, index) => ({
          id: post._id,
          index: index + 1,
          title: post.title,
          category: post.category,
          status: post.status,
          description: post.description,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          post
        })));
        this.loadingPosts.set(false);
      },

      error: (error) => {
        console.error(error);
        this.loadingPosts.set(false);
        this.toastr.error(
          'Failed to load blogs',
          'Blog Management'
        );
      }
    });
  }

  openCreateForm(): void {
    this.isEditing.set(false);
    this.resetForm();
    this.isFormOpen.set(true);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning(
        'Please fill all required fields.',
        'Blog Management'
      );
      return;
    }
    this.saving.set(true);
    if (this.isEditing()) {
      const dto: UpdateBlogDto = this.form.getRawValue();
      this.blogService.updateBlog(this.editId(), dto).subscribe({
        next: () => {
          this.saving.set(false);
          this.toastr.success(
            'Blog updated successfully',
            'Blog Management'
          );
          this.closeFormModal();
          this.loadPosts();
        },

        error: (error) => {
          this.saving.set(false);
          console.error(error);
          this.toastr.error(
            'Failed to update blog',
            'Blog Management'
          );
        }
      });

      return;
    }

    const dto: CreateBlogDto = this.form.getRawValue();
    this.blogService.createBlog(dto).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastr.success(
          'Blog created successfully',
          'Blog Management'
        );
        this.closeFormModal();
        this.loadPosts();
      },

      error: (error) => {
        this.saving.set(false);
        console.error(error);
        this.toastr.error(
          'Failed to create blog',
          'Blog Management'
        );
      }
    });
  }

  editPost(blog: Blog): void {
    this.isEditing.set(true);
    this.editId.set(blog._id);
    this.form.patchValue({
      title: blog.title,
      category: blog.category,
      description: blog.description,
      mediaUrl: blog.mediaUrl ?? '',
      status: blog.status
    });

    this.isFormOpen.set(true);
  }

  deletePost(id: string): void {
    this.alertModalService.show({
      title: 'Delete Blog',
      message: 'Are you sure you want to delete this blog?',
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        this.blogService.deleteBlog(id).subscribe({
          next: () => {
            this.toastr.success(
              'Blog deleted successfully',
              'Blog Management'
            );
            this.loadPosts();
          },
          error: (error) => {
            console.error(error);
            this.toastr.error(
              'Failed to delete blog',
              'Blog Management'
            );
          }
        });
      }
    });
  }

  toggleActionMenu(event: MouseEvent, row: any) {
    event.stopPropagation();
    if (this.openMenuId() === row.id) {
      this.closeActionMenu();
      return;
    }

    this.activeActionRow = row;
    this.openMenuId.set(row.id);

    const button = (event.target as HTMLElement).closest('button');
    if (button) {
      const rect = button.getBoundingClientRect();
      this.menuTop = rect.bottom + window.scrollY + 8;
      this.menuLeft = rect.right + window.scrollX - 200;
    }
  }

  closeActionMenu() {
    this.openMenuId.set(null);
    this.activeActionRow = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeActionMenu();
  }

  resetForm(): void {
    this.editId.set('');
    this.form.reset({
      title: '',
      category: '',
      description: '',
      mediaUrl: '',
      status: 'Draft'
    });
  }

  closeFormModal(): void {
    this.resetForm();
    this.isEditing.set(false);
    this.isFormOpen.set(false);
  }

}