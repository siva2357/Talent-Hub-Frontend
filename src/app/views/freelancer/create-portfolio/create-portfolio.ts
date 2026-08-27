import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { ProjectTypeEnum } from '../../../core/enums/portfolio.enum';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';

@Component({
  selector: 'app-create-portfolio',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, InputField, Button, FilePreview, FileUpload],
  templateUrl: './create-portfolio.html',
  styleUrl: './create-portfolio.css'
})
export class CreatePortfolio implements OnInit {
  portfolioForm!: FormGroup;
  projectTypes = Object.values(ProjectTypeEnum);
  projectTypeOptions: InputOption[] = [];

  previews: string[] = [];

  isSubmitting = false;
  portfolioId: string | null = null;
  isEditMode = false;

  UploadBucket = UploadBucket;
  UploadSection = UploadSection;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projectTypeOptions = this.projectTypes.map(pt => ({ label: pt, value: pt }));

    this.portfolioForm = this.fb.group({
      title: ['', [Validators.required]],
      projectType: ['', [Validators.required]],
      role: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
      description: ['', [Validators.required]],
      projectUrl: [''],
      tags: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe(params => {
      this.portfolioId = params.get('id');
      if (this.portfolioId) {
        this.isEditMode = true;
        this.loadPortfolioData(this.portfolioId);
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.portfolioForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  loadPortfolioData(id: string) {
    this.portfolioService.getPortfolioById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const p = res.data;
          this.portfolioForm.patchValue({
            title: p.title,
            projectType: p.projectType,
            role: p.role,
            startDate: p.startDate ? new Date(p.startDate).toISOString().substring(0, 10) : '',
            endDate: p.endDate ? new Date(p.endDate).toISOString().substring(0, 10) : '',
            description: p.description,
            projectUrl: p.projectUrl,
            tags: p.tags.join(', ')
          });

          this.previews = p.media.map((m: any) => m.url);
        }
      },
      error: (err) => console.error('Error fetching portfolio for edit', err)
    });
  }

  onUploadComplete(url: string) {
    this.previews = [url];
  }

  onUploadError(err: string) {
    alert('Upload failed: ' + err);
  }

  removeFile(index: number) {
    this.previews = [];
  }

  async onSubmit() {
    if (this.portfolioForm.invalid) {
      this.portfolioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      // 1. Gather media from previews
      const media = this.previews.map(url => ({
        mediaType: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
        url: url
      }));

      // 2. Prepare payload
      const formValue = this.portfolioForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [];

      const payload = {
        title: formValue.title,
        projectType: formValue.projectType,
        role: formValue.role,
        startDate: formValue.startDate ? new Date(formValue.startDate) : undefined,
        endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
        description: formValue.description,
        projectUrl: formValue.projectUrl,
        tags: tags,
        media: media
      };

      // 3. Submit portfolio
      if (this.isEditMode && this.portfolioId) {
        // Just merge existing media if we skipped creating File objects for them
        // A more robust app would track deleted existing media vs new media
        await this.portfolioService.updatePortfolio(this.portfolioId, payload).toPromise();
      } else {
        await this.portfolioService.createPortfolio(payload).toPromise();
      }

      this.router.navigate(['/portfolio']);

    } catch (error) {
      console.error('Error creating portfolio', error);
      alert('Failed to create portfolio. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

}


