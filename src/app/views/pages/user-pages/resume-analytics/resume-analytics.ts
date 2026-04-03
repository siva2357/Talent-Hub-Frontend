import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUpload } from "../../../shared/file-upload/file-upload";
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { UploadSection } from '../../../../core/enums/upload-section.constant';
import { RouterModule } from '@angular/router';
import { ResumeService } from '../../../../core/services/resume-service';

@Component({
  selector: 'app-resume-analytics',
  standalone: true,
  imports: [CommonModule, FileUpload,  RouterModule],
  templateUrl: './resume-analytics.html',
  styleUrls: ['./resume-analytics.css'] // ✅ fix
})
export class ResumeAnalytics implements OnInit {

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  resumes: any[] = []; // ✅ array now

  constructor(private resumeService: ResumeService) {}

  ngOnInit() {
    this.loadResumes();
  }

  // 🔹 Upload → Save → Reload
  onLogoUploaded(url: string) {
    const payload = {
      resumeUrl: url,
      fileName: url.split('/').pop()
    };

    this.resumeService.saveResume(payload).subscribe({
      next: () => this.loadResumes()
    });
  }

  // 🔹 Load all resumes
  loadResumes() {
    this.resumeService.getResumes().subscribe({
      next: (res: any) => {
        this.resumes = res.data || [];
      },
      error: () => {
        this.resumes = [];
      }
    });
  }

  getCleanFileName(fileName: string): string {
  if (!fileName) return 'resume.pdf';

  // remove timestamp + UUID
  const parts = fileName.split('-');

  // take last part (actual name)
  return parts.slice(-1)[0];
}

  // 🔹 Delete by ID
  deleteResume(id: string) {
    this.resumeService.deleteResume(id).subscribe({
      next: () => {
        this.resumes = this.resumes.filter(r => r._id !== id);
      }
    });
  }
}
