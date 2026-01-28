import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FileUpload } from '../../../shared/file-upload/file-upload';
import { UploadSection } from '../../../../core/enums/upload-section.constant';
import { BucketKey } from '../../../../core/enums/bucket-key.constant';
import { ResumeService } from '../../../../core/services/resume-service';

@Component({
  selector: 'app-resume-analytics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FileUpload
  ],
  templateUrl: './resume-analytics.html',
  styleUrl: './resume-analytics.css'
})
export class ResumeAnalytics implements OnInit {

  BucketKey = BucketKey;
  UploadSection = UploadSection;

  resumeForm!: FormGroup;
  resumeUrl!: string;

  scoring = false;
  resumeScore?: number;
  breakdown: any;

feedback: any;
parsedData: any;
resumes: any[] = [];
loadingResumes = false;

selectedReport: any = null;
showReportModal = false;



  constructor(
    private fb: FormBuilder,
    private resumeService: ResumeService
  ) {}

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      resume: [null, Validators.required]
    });
      this.loadMyResumes();
  }

  loadMyResumes(): void {
  this.loadingResumes = true;

  this.resumeService.getMyResumes().subscribe({
    next: (res) => {
      this.resumes = res.resumes || [];
      this.loadingResumes = false;
    },
    error: () => {
      this.loadingResumes = false;
    }
  });
}


onResumeUploaded(url: string): void {
  this.resumeUrl = url + '?v=' + Date.now();

  this.resumeForm.get('resume')?.setValue(url);
  this.resumeForm.get('resume')?.markAsTouched();

  // 🔥 SAVE TO BACKEND
  this.resumeService.saveResumeUrl(url).subscribe({
    next: () => console.log('Resume URL saved'),
    error: (err) => console.error(err)
  });
  this.loadMyResumes()
}

runScoreForResume(resumeId: string): void {
  this.scoring = true;

  this.resumeService.runResumeScoring(resumeId, true).subscribe({
    next: () => {
      this.scoring = false;
      this.loadMyResumes(); // refresh score badge
    },
    error: () => {
      this.scoring = false;
    }
  });
}

closeReport(): void {
  this.showReportModal = false;
  this.selectedReport = null;
}

openReport(resumeId: string): void {
  this.resumeService.getResumeReport(resumeId).subscribe({
    next: (res) => {
      this.selectedReport = res;   // 👈 report tied to this resume
      this.showReportModal = true;
    }
  });
}


deleteResume(resumeId: string): void {
  const confirmed = confirm(
    'Are you sure you want to delete this resume? This action cannot be undone.'
  );

  if (!confirmed) return;

  this.resumeService.deleteResume(resumeId).subscribe({
    next: () => {
      // close report if deleted resume is open
      if (this.selectedReport?.resumeId === resumeId) {
        this.closeReport();
      }

      this.loadMyResumes(); // refresh list
    },
    error: (err) => {
      console.error(err);
    }
  });
}



}
