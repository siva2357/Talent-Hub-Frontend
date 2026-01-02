import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../../../core/services/portfolio-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Projects,
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
  PortfolioFile
} from '../../../../core/models/portfolio.model';
import { FilePreview } from "../../../shared/file-preview/file-preview";
import { FileUpload } from "../../../shared/file-upload/file-upload";
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';

@Component({
  selector: 'app-portfolio',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FilePreview, FileUpload],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
    standalone: true,
})
export class Portfolio implements OnInit {

  projectForm!: FormGroup;
formSubmitted = false;

  isSubmitting = false;
  isLoading = false;
  errorMessage = '';

  // data
  allProjects: Projects[] = [];
  filteredProjects: Projects[] = [];

  selectedProjectId: string | null = null;
  isEditMode = false;

    BucketKey = BucketKey;
    UploadSection = UploadSection;

  uploadedFiles: PortfolioFile[] = [];
  // filters
  filters = {
    search: '',
    projectType: ''
  };

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProjects();
  }

  // ---------------- FORM ----------------
  initializeForm(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      projectType: ['', Validators.required],
      projectDescription: ['', Validators.required],
      softwares: [[], Validators.required],
      tags: [[], Validators.required],
      files: [[], Validators.required] // images / videos
    });
  }

  // ---------------- LOAD ----------------
  loadProjects(): void {
    this.portfolioService.getProjects().subscribe({
      next: res => {
        this.allProjects = res.projects;
        this.applyFilters();
      },
      error: err => {
        this.errorMessage = err;
      }
    });
  }

  // ---------------- FILTER ----------------
  applyFilters(): void {
    this.filteredProjects = this.allProjects.filter(p => {
      const titleMatch =
        !this.filters.search ||
        p.projectDetails.projectTitle
          .toLowerCase()
          .includes(this.filters.search.toLowerCase());

      const typeMatch =
        !this.filters.projectType ||
        p.projectDetails.projectType === this.filters.projectType;

      return titleMatch && typeMatch;
    });
  }

  removeFilter(key: 'search' | 'projectType'): void {
    this.filters[key] = '';
    this.applyFilters();
  }




onFileUploaded(url: string): void {
  const file: PortfolioFile = {
    fileName: url.split('/').pop() || 'file',
    url
  };

  // ✅ create NEW array reference
  this.uploadedFiles = [...this.uploadedFiles, file];

  this.projectForm.patchValue({
    files: this.uploadedFiles
  });

  this.projectForm.get('files')?.markAsTouched();
}




submitProject(): void {
  this.formSubmitted = true;

  if (this.projectForm.invalid || this.uploadedFiles.length === 0) {
    return;
  }

  this.projectForm.patchValue({
    files: this.uploadedFiles
  });

  const payload: CreatePortfolioPayload | UpdatePortfolioPayload = {
    projectDetails: this.projectForm.value
  };

  const request$ =
    this.isEditMode && this.selectedProjectId
      ? this.portfolioService.updateProjectById(
          this.selectedProjectId,
          payload as UpdatePortfolioPayload
        )
      : this.portfolioService.createProjectUpload(
          payload as CreatePortfolioPayload
        );

  request$.subscribe({
    next: () => {
      this.resetForm();
      this.loadProjects();
    },
    error: err => {
      this.errorMessage = err;
    }
  });
}




openEdit(project: Projects): void {
  this.isEditMode = true;
  this.selectedProjectId = project._id;

  // ✅ restore uploaded files from DB
  this.uploadedFiles = [...project.projectDetails.files];

  this.projectForm.patchValue({
    projectTitle: project.projectDetails.projectTitle,
    projectType: project.projectDetails.projectType,
    projectDescription: project.projectDetails.projectDescription,
    softwares: project.projectDetails.softwares,
    tags: project.projectDetails.tags,
    files: this.uploadedFiles
  });
}

  // ---------------- DELETE ----------------
  deleteProject(projectId: string): void {
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.portfolioService.deleteProjectById(projectId).subscribe({
      next: () => this.loadProjects(),
      error: err => (this.errorMessage = err)
    });
  }

  // ---------------- VIEW ----------------
  viewProject(projectId: string): void {
    this.router.navigate([
      'jobSeeker/project',
      projectId,
      'project-details'
    ]);
  }

resetForm(): void {
  this.projectForm.reset({
    projectType: '',
    softwares: [],
    tags: [],
    files: []
  });

  this.uploadedFiles = []; // ✅ IMPORTANT

  this.isSubmitting = false;
  this.isLoading = false;
  this.isEditMode = false;
  this.selectedProjectId = null;
}


addSoftware(event: Event): void {
  event.preventDefault();

  const input = event.target as HTMLInputElement;
  const value = input.value.trim();
  if (!value) return;

  const softwares = this.projectForm.value.softwares || [];
  if (!softwares.includes(value)) {
    this.projectForm.patchValue({
      softwares: [...softwares, value]
    });
  }

  input.value = '';
}


removeSoftware(value: string): void {
  this.projectForm.patchValue({
    softwares: this.projectForm.value.softwares.filter((s: string) => s !== value)
  });
}

removeFile(url: string): void {
  this.uploadedFiles = this.uploadedFiles.filter(f => f.url !== url);

  this.projectForm.patchValue({
    files: this.uploadedFiles
  });
}


addTag(event: Event): void {
  event.preventDefault();

  const input = event.target as HTMLInputElement;
  const value = input.value.trim();
  if (!value) return;

  const tags = this.projectForm.value.tags || [];
  if (!tags.includes(value)) {
    this.projectForm.patchValue({
      tags: [...tags, value]
    });
  }

  input.value = '';
}

removeTag(value: string): void {
  this.projectForm.patchValue({
    tags: this.projectForm.value.tags.filter((t: string) => t !== value)
  });
}


}
