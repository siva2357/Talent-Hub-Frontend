import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PortfolioService } from '../../../../core/services/portfolio-service';
import { InputFields } from "../../../components/input-fields/input-fields";
import { FileUpload } from "../../../shared/file-upload/file-upload";
import { FilePreview } from "../../../shared/file-preview/file-preview";
import { UploadSection } from '../../../../core/enums/upload-section.constant';
import { BucketKey } from '../../../../core/enums/bucket-key.constant';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    InputFields,
    FileUpload,
    FilePreview
  ],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  constructor(
    private portfolioService: PortfolioService,
    private fb: FormBuilder
  ) {}

  projects: any[] = [];
  selectedProject: any = null;
  isEditMode = false;

  projectForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadProjects();
  }

  initForm() {
    this.projectForm = this.fb.group({
      projectTitle: [''],
      projectType: [''],
      projectDescription: [''],
      softwares: [''],
      tags: [''],
      fileUrl: ['']
    });
  }

  /* ================= LOAD ================= */
  loadProjects() {
    this.portfolioService.getProjects().subscribe({
      next: (res) => this.projects = res.projects,
      error: (err) => console.error(err)
    });
  }

  /* ================= SELECT ================= */
  selectProject(project: any) {
    this.isEditMode = true;
    this.selectedProject = project;

    const details = project?.projectDetails || {};

    this.projectForm.patchValue({
      projectTitle: details.projectTitle || '',
      projectType: details.projectType || '',
      projectDescription: details.projectDescription || '',
      softwares: details.softwares?.join(', ') || '',
      tags: details.tags?.join(', ') || '',
      fileUrl: details.files?.[0]?.url || ''
    });
  }

  /* ================= ADD ================= */
  addProject() {
    this.isEditMode = false;
    this.selectedProject = null;
    this.projectForm.reset();
  }

  /* ================= FILE UPLOAD ================= */
  onLogoUploaded(url: string) {
    this.projectForm.patchValue({ fileUrl: url });
  }

  /* ================= SAVE ================= */
  saveProject() {

    const formValue = this.projectForm.value;

    const payload = {
      projectDetails: {
        projectTitle: formValue.projectTitle,
        projectType: formValue.projectType,
        projectDescription: formValue.projectDescription,
        softwares: formValue.softwares
          ? formValue.softwares.split(',').map((s: string) => s.trim())
          : [],
        tags: formValue.tags
          ? formValue.tags.split(',').map((t: string) => t.trim())
          : [],
        files: formValue.fileUrl
          ? [{ fileName: 'project-file', url: formValue.fileUrl }]
          : []
      }
    };

    const request = this.isEditMode && this.selectedProject?._id
      ? this.portfolioService.updateProjectById(this.selectedProject._id, payload)
      : this.portfolioService.createProjectUpload(payload);

    request.subscribe({
      next: () => {
        this.loadProjects();

        // 🔥 auto close modal
        const modalEl = document.getElementById('projectFormModal');
        (window as any).bootstrap?.Modal.getInstance(modalEl)?.hide();
      },
      error: (err) => console.error(err)
    });
  }

  /* ================= DELETE ================= */
  deleteProject() {
    if (!this.selectedProject?._id) return;

    this.portfolioService.deleteProjectById(this.selectedProject._id)
      .subscribe({
        next: () => this.loadProjects(),
        error: (err) => console.error(err)
      });
  }
}
