import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
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

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  bucketKey = BucketKey.AdminCollection;
  uploadSection = UploadSection.BlogMedia;
  posts: Blog[] = [];
  rows: any[] = [];
  columns: any[] = [];
  isFormOpen = false;
  isEditing = false;
  editId = '';
  saving = false;
  openMenuId: string | null = null;
  form!: FormGroup;
  loadingPosts = false;
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


  ngOnInit(): void {
    this.initializeForm();
    this.loadPosts();
  }

  ngAfterViewInit(): void {
    this.columns = [
      {
        name: 'S.No',
        prop: 'index',
        width: 80
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
        width: 150
      },
      {
        name: 'Created',
        prop: 'createdAt',
        width: 220
      },
    ];
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
    this.loadingPosts = true;
    this.blogService.getAllBlogsAdmin().subscribe({

      next: ({ blogs }) => {
        this.posts = blogs;
        this.rows = blogs.map((post, index) => ({
          id: post._id,
          index: index + 1,
          title: post.title,
          category: post.category,
          status: post.status,
          createdAt: post.createdAt,
          post
        }));
        this.loadingPosts = false;
      },

      error: (error) => {
        console.error(error);
        this.loadingPosts = false;
        this.toastr.error(
          'Failed to load blogs',
          'Blog Management'
        );
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.resetForm();
    this.isFormOpen = true;
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
    this.saving = true;
    if (this.isEditing) {
      const dto: UpdateBlogDto = this.form.getRawValue();
      this.blogService.updateBlog(this.editId, dto).subscribe({
        next: () => {
          this.saving = false;
          this.toastr.success(
            'Blog updated successfully',
            'Blog Management'
          );
          this.closeFormModal();
          this.loadPosts();
        },

        error: (error) => {
          this.saving = false;
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
        this.saving = false;
        this.toastr.success(
          'Blog created successfully',
          'Blog Management'
        );
        this.closeFormModal();
        this.loadPosts();
      },

      error: (error) => {
        this.saving = false;
        console.error(error);
        this.toastr.error(
          'Failed to create blog',
          'Blog Management'
        );
      }
    });
  }

  editPost(blog: Blog): void {
    this.isEditing = true;
    this.editId = blog._id;
    this.form.patchValue({
      title: blog.title,
      category: blog.category,
      description: blog.description,
      mediaUrl: blog.mediaUrl ?? '',
      status: blog.status
    });

    this.isFormOpen = true;
  }

  deletePost(id: string): void {

    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

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

  toggleMenu(id: string, event: Event): void {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  resetForm(): void {
    this.editId = '';
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
    this.isEditing = false;
    this.isFormOpen = false;
  }

}