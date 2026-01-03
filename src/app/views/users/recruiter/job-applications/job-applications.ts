import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { JobpostService } from '../../../../core/services/jobpost-service';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications implements OnInit {

  loading = true;
  errorMessage = '';
  applicationsSummary: any[] = [];

  constructor(
    private jobpostService: JobpostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchApplicantsSummary();
  }

  fetchApplicantsSummary(): void {
    this.jobpostService.getApplicantsSummary().subscribe({
      next: (res) => {
        this.applicationsSummary = res.jobs || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load job applications';
        this.loading = false;
      }
    });
  }

  /* =========================
     Navigation
  ========================== */
  goToApplicantsList(jobId: string): void {
    this.router.navigate([
      '/recruiter/job-applications',
      jobId,
      'applicant-list'
    ]);
  }
}
