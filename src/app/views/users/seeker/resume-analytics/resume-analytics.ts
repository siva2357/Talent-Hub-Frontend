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
resume: any | null = null;

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
      this.resume = res.resumes?.[0] || null;
      this.loadingResumes = false;
    },
    error: () => {
      this.loadingResumes = false;
    }
  });
}



onResumeUploaded(url: string): void {
  this.resumeForm.get('resume')?.setValue(url);
  this.resumeForm.get('resume')?.markAsTouched();

  // reset UI state
  this.selectedReport = null;
  this.showReportModal = false;

  this.resumeService.saveResumeUrl(url).subscribe({
    next: () => this.loadMyResumes(),
    error: (err) => console.error(err)
  });
}


runScoreForResume(): void {
  if (!this.resume) return;

  this.scoring = true;

  this.resumeService.runResumeScoring(this.resume._id, true).subscribe({
    next: () => {
      this.scoring = false;
      this.loadMyResumes();
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


deleteResume(): void {
  if (!this.resume) return;

  const confirmed = confirm('Delete resume permanently?');
  if (!confirmed) return;

  this.resumeService.deleteResume(this.resume._id).subscribe({
    next: () => {
      this.resume = null;
      this.closeReport();
    },
    error: (err) => console.error(err)
  });
}



}
