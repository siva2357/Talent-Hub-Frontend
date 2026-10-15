import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { RichTextEditor } from '../../../library/shared/components/rich-text-editor/rich-text-editor';
import { MasterDataService } from '../../../core/services/master-data.service';
import { ToastService } from '../../../core/services/ui/toast.service';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, InputField, Button, FileUpload, FilePreview, RichTextEditor],
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
  isEditMode = false;
  blogId: string | null = null;
  isLoadingBlog = false;

  categoryOptions: InputOption[] = [
    { label: 'Select a category', value: '' }
  ];

  statusOptions: InputOption[] = [
    { label: 'Draft', value: 'Draft' },
    { label: 'Published', value: 'Published' }
  ];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private fileService: FileService,
    private masterDataService: MasterDataService,
    private toastService: ToastService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      content: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tags: [''],
      status: ['Draft', [Validators.required]]
    });

    this.masterDataService.getMasterDataByCategory('BlogCategories').subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const fetchedOptions = res.data.map((opt: any) => ({
            label: opt.value,
            value: opt.key
          }));
          this.categoryOptions = [
            { label: 'Select a category', value: '' },
            ...fetchedOptions
          ];
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });

    this.blogId = this.route.snapshot.paramMap.get('id');
    if (this.blogId) {
      this.isEditMode = true;
      this.loadBlogData(this.blogId);
    }
  }

  loadBlogData(id: string) {
    this.isLoadingBlog = true;
    this.blogService.getBlogByIdAdmin(id).subscribe({
      next: (res) => {
        if (res.success && res.blog) {
          const b = res.blog;
          this.blogForm.patchValue({
            title: b.title || '',
            content: b.content || '',
            category: b.category || '',
            tags: Array.isArray(b.tags) ? b.tags.join(', ') : (b.tags || ''),
            status: b.status || 'Draft'
          });
          this.featuredMediaUrl = b.featuredMedia || null;
          this.blogBannerUrl = b.blogBanner || null;
        }
        this.isLoadingBlog = false;
      },
      error: (err) => {
        console.error('Error fetching blog details', err);
        this.toastService.show('Failed to load blog details', 'error');
        this.isLoadingBlog = false;
      }
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
      const tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => !!t) : [];
      
      const payload = {
        title: formValue.title,
        content: formValue.content,
        category: formValue.category,
        tags: tags,
        status: formValue.status,
        featuredMedia: this.featuredMediaUrl,
        blogBanner: this.blogBannerUrl
      };

      if (this.isEditMode && this.blogId) {
        await this.blogService.updateBlog(this.blogId, payload).toPromise();
        this.toastService.show('Blog updated successfully!', 'success');
      } else {
        await this.blogService.createBlog(payload).toPromise();
        this.toastService.show('Blog created successfully!', 'success');
      }
      
      this.router.navigate(['/blog-manager']);
      
    } catch (error) {
      console.error(this.isEditMode ? 'Error updating blog' : 'Error creating blog', error);
      this.toastService.show(
        this.isEditMode ? 'Failed to update blog. Please try again.' : 'Failed to create blog. Please try again.',
        'error'
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
