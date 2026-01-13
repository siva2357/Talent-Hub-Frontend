
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { JobpostService } from '../../../../core/services/jobpost-service';
import { JobPost } from '../../../../core/models/jobpost.model';

@Component({
  selector: 'app-job-details-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-details-page.html',
  styleUrl: './job-details-page.css'
})
export class JobDetailsPage implements OnInit {

  jobPostId!: string;
  job!: JobPost;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobpostService: JobpostService
  ) {}

  /* =========================
     Lifecycle
  ========================== */
  ngOnInit(): void {
    this.jobPostId = this.route.snapshot.paramMap.get('jobPostId')!;
    this.fetchJobDetails();
  }

  /* =========================
     Fetch Job Details
  ========================== */
  fetchJobDetails(): void {
    this.jobpostService.getJobPostById(this.jobPostId).subscribe({
      next: (response) => {
        this.job = response.jobDetails || response.job;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load job details';
        this.loading = false;
      }
    });
  }

  /* =========================
     Apply / Withdraw
  ========================== */
  applyJob(): void {
    this.jobpostService.applyJobPost(this.jobPostId).subscribe({
      next: () => {
        this.job.isApplied = true;
      },
      error: () => alert('Failed to apply for job')
    });
  }

  withdrawJob(): void {
    this.jobpostService.withdrawJobPost(this.jobPostId).subscribe({
      next: () => {
        this.job.isApplied = false;
      },
      error: () => alert('Failed to withdraw application')
    });
  }

  goBack(): void {
    this.router.navigate(['/jobSeeker/jobposts']);
  }


goToCompanyDetailsPage(): void {
  if (!this.job?.companyDetails._id) {
    return;
  }

  this.router.navigate([
    '/jobSeeker/company',
    this.job.companyDetails._id,
    'company-details'
  ]);
}



}
