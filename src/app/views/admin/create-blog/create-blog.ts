import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-blog.html',
  styleUrl: './create-blog.css'
})
export class CreateBlog implements OnInit {
  blogForm!: FormGroup;
  
  featuredMediaFile: File | null = null;
  featuredMediaPreview: string | null = null;
  
  blogBannerFile: File | null = null;
  blogBannerPreview: string | null = null;
  
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private fileService: FileService,
    private router: Router
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

  // --- Featured Media ---
  onFeaturedMediaSelected(event: any) {
    const file = event.target.files[0];
    this.setFeaturedMedia(file);
  }
  
  onDragOver(event: any) {
    event.preventDefault();
  }
  
  onDropFeaturedMedia(event: any) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    this.setFeaturedMedia(file);
  }

  setFeaturedMedia(file: File) {
    if (file && file.type.match(/image\/*|video\/*/)) {
      this.featuredMediaFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.featuredMediaPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  // --- Blog Banner ---
  onBannerSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.match(/image\/*/)) {
      this.blogBannerFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.blogBannerPreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  clearBanner() {
    this.blogBannerFile = null;
    this.blogBannerPreview = null;
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
      let featuredMediaUrl = null;
      let blogBannerUrl = null;

      if (this.featuredMediaFile) {
        const res = await this.fileService.uploadFile(
          this.featuredMediaFile, 
          UploadBucket.AdminCollection, 
          UploadSection.BlogMedia
        ).toPromise();
        if (res && res.success) featuredMediaUrl = res.url;
      }

      if (this.blogBannerFile) {
        const res = await this.fileService.uploadFile(
          this.blogBannerFile, 
          UploadBucket.AdminCollection, 
          UploadSection.BlogMedia
        ).toPromise();
        if (res && res.success) blogBannerUrl = res.url;
      }

      const formValue = this.blogForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [];
      
      const payload = {
        title: formValue.title,
        content: formValue.content,
        category: formValue.category,
        tags: tags,
        status: formValue.status,
        featuredMedia: featuredMediaUrl,
        blogBanner: blogBannerUrl
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
