import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectTypeEnum } from '../../../models/portfolio.enum';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { FileService } from '../../../core/services/file.service';
import { UploadBucket, UploadSection } from '../../../core/enums/upload.enum';

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

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private fileService: FileService,
    private router: Router
  ) {}

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
      await this.portfolioService.createPortfolio(payload).toPromise();
      
      this.router.navigate(['/portfolio']);
      
    } catch (error) {
      console.error('Error creating portfolio', error);
      alert('Failed to create portfolio. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}

