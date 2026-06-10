import { Component, OnInit, inject } from '@angular/core';
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
import { RichTextEditorComponent }from "../../../../../shared/components/rich-text-editor/rich-text-editor.component";

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
    RichTextEditorComponent
],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostComponent implements OnInit {

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

}