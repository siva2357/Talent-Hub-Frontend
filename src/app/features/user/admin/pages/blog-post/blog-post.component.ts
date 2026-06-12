import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { BlogService } from '../../../../../core/services/blog.service';
import { Blog } from '../../../../../core/model/blog.model';
import {
  CreateBlogDto,
  UpdateBlogDto
} from '../../../../../core/DTOs/blog.dto';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

import { BucketKey, UploadSection } from '../../../../../core/enums/upload.enum';
import {InputComponent } from "../../../../../shared/components/input/input.component"
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilePreviewComponent } from "../../../../../shared/components/file-preview/file-preview.component";

import { Table } from "../../../../../shared/components/table/table.component";
import { RichTextEditorComponent } from '../../../../../shared/components/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    FileUploadComponent,
    FilePreviewComponent,
    RichTextEditorComponent,
    Table
],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostComponent implements OnInit, AfterViewInit {

  private blogService = inject(BlogService);
  private toastr = inject(ToastrService);

bucketKey = BucketKey.AdminCollection;

uploadSection = UploadSection.BlogMedia;
  posts: Blog[] = [];

  isFormOpen = false;
  isEditing = false;

  editId = '';

  title = '';
  category = '';
  description = '';
  mediaUrl = '';

  status: 'Published' | 'Draft' = 'Draft';

  categories = [
    'Technology',
    'Artificial Intelligence',
    'Education',
    'Career',
    'Business',
    'Programming',
    'Security',
    'Other'
  ];



categoryOptions = [
  { label: 'Technology', value: 'Technology' },
  { label: 'Career', value: 'Career' },
  { label: 'Freelancing', value: 'Freelancing' },
  { label: 'Business', value: 'Business' }
];

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {

    this.blogService
      .getAllBlogsAdmin()
      .subscribe({
        next: (response) => {
          this.posts = response.blogs;
        },
        error: (error) => {
          console.error(error);

          this.toastr.error(
            'Failed to load blogs',
            'Blog Management'
          );
        }
      });

  }

  openCreateForm(): void {

    this.resetForm();

    this.isEditing = false;

    this.isFormOpen = true;

  }

  onSubmit(): void {

    if (
      !this.title.trim() ||
      !this.category.trim() ||
      !this.description.trim()
    ) {

      this.toastr.warning(
        'Please fill all required fields.',
        'Blog Management'
      );

      return;

    }

    if (this.isEditing) {

      const dto: UpdateBlogDto = {
        title: this.title,
        category: this.category,
        description: this.description,
        mediaUrl: this.mediaUrl,
        status: this.status
      };

      this.blogService
        .updateBlog(this.editId, dto)
        .subscribe({
          next: () => {

            this.toastr.success(
              'Blog updated successfully',
              'Blog Management'
            );

            this.closeFormModal();

            this.loadPosts();

          },
          error: (error) => {

            console.error(error);

            this.toastr.error(
              'Failed to update blog',
              'Blog Management'
            );

          }
        });

    } else {

      const dto: CreateBlogDto = {
        title: this.title,
        category: this.category,
        description: this.description,
        mediaUrl: this.mediaUrl,
        status: this.status
      };

      this.blogService
        .createBlog(dto)
        .subscribe({
          next: () => {

            this.toastr.success(
              'Blog created successfully',
              'Blog Management'
            );

            this.closeFormModal();

            this.loadPosts();

          },
          error: (error) => {

            console.error(error);

            this.toastr.error(
              'Failed to create blog',
              'Blog Management'
            );

          }
        });

    }

  }

  editPost(blog: Blog): void {

    this.isEditing = true;

    this.editId = blog._id;

    this.title = blog.title;
    this.category = blog.category;
    this.description = blog.description;

    this.mediaUrl = blog.mediaUrl ?? '';

    this.status = blog.status;

    this.isFormOpen = true;

  }

  deletePost(id: string): void {

    const confirmed = confirm(
      'Are you sure you want to delete this blog?'
    );

    if (!confirmed) {
      return;
    }

    this.blogService
      .deleteBlog(id)
      .subscribe({
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

  resetForm(): void {

    this.isEditing = false;

    this.editId = '';

    this.title = '';
    this.category = '';

    this.description = '';

    this.mediaUrl = '';

    this.status = 'Draft';

  }

  closeFormModal(): void {

    this.resetForm();

    this.isFormOpen = false;

  }


@ViewChild('actionTemplate', { static: true })
actionTemplate!: TemplateRef<any>;

  columns: any[] = [];

ngAfterViewInit(): void {

    this.columns = [
      {
        name: 'Title',
        prop: 'title'
      },
      {
        name: 'Category',
        prop: 'category'
      },
      {
        name: 'Status',
        prop: 'status'
      },
      {
        name: 'Views',
        prop: 'views'
      },
      {
        name: 'Published Date',
        prop: 'publishedDate'
      },
      {
        name: 'Author',
        prop: 'author'
      },
      {
        name: 'Actions',
        prop: 'actions',
        cellTemplate: this.actionTemplate
      }
    ];

  }

rows = [
  {
    id: 1,
    title: 'Getting Started with Angular',
    category: 'Technology',
    status: 'Published',
    views: 15420,
    publishedDate: '2026-06-01',
    author: 'Siva Prasad'
  },
  {
    id: 2,
    title: 'AI Tools for Developers',
    category: 'Artificial Intelligence',
    status: 'Published',
    views: 9840,
    publishedDate: '2026-05-28',
    author: 'John David'
  },
  {
    id: 3,
    title: 'Freelancing Success Guide',
    category: 'Career',
    status: 'Draft',
    views: 0,
    publishedDate: '-',
    author: 'Sarah Wilson'
  },
  {
    id: 4,
    title: 'Cyber Security Best Practices',
    category: 'Security',
    status: 'Published',
    views: 22340,
    publishedDate: '2026-05-15',
    author: 'Michael Brown'
  },
  {
    id: 5,
    title: 'Building Scalable APIs',
    category: 'Programming',
    status: 'Draft',
    views: 0,
    publishedDate: '-',
    author: 'Robert King'
  },
  {
    id: 6,
    title: 'Future of Remote Work',
    category: 'Business',
    status: 'Published',
    views: 12890,
    publishedDate: '2026-05-12',
    author: 'Emma Johnson'
  },
  {
    id: 7,
    title: 'Learning TypeScript Effectively',
    category: 'Programming',
    status: 'Published',
    views: 8730,
    publishedDate: '2026-04-29',
    author: 'Alex Carter'
  },
  {
    id: 8,
    title: 'Data Science Career Roadmap',
    category: 'Education',
    status: 'Draft',
    views: 0,
    publishedDate: '-',
    author: 'Sophia Lee'
  },
  {
    id: 9,
    title: 'Mastering RxJS',
    category: 'Technology',
    status: 'Published',
    views: 14200,
    publishedDate: '2026-04-21',
    author: 'David Smith'
  },
  {
    id: 10,
    title: 'Cloud Architecture Fundamentals',
    category: 'Cloud',
    status: 'Published',
    views: 7600,
    publishedDate: '2026-04-18',
    author: 'Olivia Martin'
  },
  {
    id: 11,
    title: 'Machine Learning Basics',
    category: 'Artificial Intelligence',
    status: 'Review',
    views: 0,
    publishedDate: '-',
    author: 'Daniel Moore'
  },
  {
    id: 12,
    title: 'Docker for Beginners',
    category: 'DevOps',
    status: 'Published',
    views: 11350,
    publishedDate: '2026-03-30',
    author: 'Ethan Clark'
  }
];


openMenuId: number | null = null;

toggleMenu(id: number, event: Event): void {
  event.stopPropagation();

  this.openMenuId =
    this.openMenuId === id
      ? null
      : id;
}

view(row: any): void {
  console.log('View', row);
}

edit(row: any): void {
  console.log('Edit', row);
}

publish(row: any): void {
  console.log('Publish', row);
}

delete(row: any): void {
  console.log('Delete', row);
}

}