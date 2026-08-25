import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';
import { ProjectTypeEnum } from '../../../core/enums/portfolio.enum';

@Component({
  selector: 'app-create-portfolio',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-portfolio.html',
  styleUrl: './create-portfolio.css'
})
export class CreatePortfolio implements OnInit {
  portfolioForm!: FormGroup;
  projectTypes = Object.values(ProjectTypeEnum);

  selectedFiles: File[] = [];
  previews: string[] = [];

  isSubmitting = false;
  uploadProgress = 0;
  portfolioId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.portfolioForm = this.fb.group({
      title: ['', [Validators.required]],
      projectType: ['', [Validators.required]],
      role: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
      description: ['', [Validators.required]],
      projectUrl: [''],
      tags: ['']
    });

    this.route.paramMap.subscribe(params => {
      this.portfolioId = params.get('id');
      if (this.portfolioId) {
        this.isEditMode = true;
        this.loadPortfolioData(this.portfolioId);
      }
    });
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
            startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
            endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
            description: p.description,
            projectUrl: p.projectUrl,
            tags: p.tags ? p.tags.join(', ') : ''
          });
          if (p.media && p.media.length > 0) {
            this.previews = p.media.map((m: any) => m.url);
            // We aren't fully re-constructing File objects for existing media 
            // since they are already uploaded. We might need logic to handle mixed 
            // existing and new media, but for now we skip re-uploading existing.
          }
        }
      },
      error: (err) => console.error('Error fetching portfolio for edit', err)
    });
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.addFiles(files);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: any) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files) as File[];
    this.addFiles(files);
  }

  addFiles(files: File[]) {
    if (this.selectedFiles.length + files.length > 6) {
      alert('You can only upload up to 6 files.');
      return;
    }

    files.forEach(file => {
      // Allow only image or video
      if (!file.type.match(/image\/*|video\/*/)) {
        return;
      }
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previews.splice(index, 1);
  }

  async onSubmit() {
    if (this.portfolioForm.invalid) {
      this.portfolioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      // 1. Upload files
      const media = [];
      for (const file of this.selectedFiles) {
        const response = await this.fileService.uploadFile(
          file,
          UploadBucket.FreelancerData,
          UploadSection.Portfolio
        ).toPromise();

        if (response && response.success) {
          media.push({
            mediaType: file.type.startsWith('video') ? 'video' : 'image',
            url: response.url
          });
        }
      }

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

      this.router.navigate(['/freelancer/portfolio']);

    } catch (error) {
      console.error('Error creating portfolio', error);
      alert('Failed to create portfolio. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}

