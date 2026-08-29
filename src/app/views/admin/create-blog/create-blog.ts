import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, InputField, Button, FileUpload, FilePreview],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit {
  blogForm!: FormGroup;
  
  featuredMediaUrl: string | null = null;
  blogBannerUrl: string | null = null;
  
  uploadBucket = UploadBucket;
  uploadSection = UploadSection;
  
  isSubmitting = false;

  categoryOptions: InputOption[] = [
    { label: 'Select a category', value: '' },
    { label: 'Career', value: 'Career' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Platform News', value: 'Platform News' }
  ];

  statusOptions: InputOption[] = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Published', value: 'Published' }
  ];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private fileService: FileService,
    public router: Router
  ) {}

  ngOnInit() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tags: [''],
      status: ['Draft', [Validators.required]]
    });
  }

  // --- Media Uploads ---
  onUploadComplete(url: string, type: 'featured' | 'banner') {
    if (type === 'featured') {
      this.featuredMediaUrl = url;
    } else {
      this.blogBannerUrl = url;
    }
  }

  clearFile(type: 'featured' | 'banner') {
    if (type === 'featured') {
      this.featuredMediaUrl = null;
    } else {
      this.blogBannerUrl = null;
    }
  }

  // --- Submit ---
  async onSubmit(saveAsDraft: boolean = false) {
    if (saveAsDraft) {
      this.blogForm.patchValue({ status: 'Draft' });
    } else {
      this.blogForm.patchValue({ status: 'Published' });
    }

    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    try {
      const formValue = this.blogForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [];
      
      const payload = {
        title: formValue.title,
        content: formValue.content,
        category: formValue.category,
        tags: tags,
        status: formValue.status,
        featuredMedia: this.featuredMediaUrl,
        blogBanner: this.blogBannerUrl
      };

      await this.blogService.createBlog(payload).toPromise();
      
      this.router.navigate(['/blog-manager']);
      
    } catch (error) {
      console.error('Error creating blog', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
