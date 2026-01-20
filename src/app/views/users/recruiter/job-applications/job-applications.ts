import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ ADD THIS
import { JobpostService } from '../../../../core/services/jobpost-service';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications implements OnInit {

  loading = true;
  errorMessage = '';
  applicationsSummary: any[] = [];
  filters = {
  search: '',
  jobType: '',
  jobCategory: ''
};

allJobs: any[] = [];
filteredJobs: any[] = [];


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
      this.allJobs = res.jobs || [];
      this.applyFilters();
      this.loading = false;
    },
    error: () => {
      this.errorMessage = 'Failed to load job applications';
      this.loading = false;
    }
  });
}

applyFilters(): void {
  this.filteredJobs = this.allJobs.filter(job => {

    const matchesSearch =
      !this.filters.search ||
      job.jobTitle.toLowerCase().includes(this.filters.search.toLowerCase());

    const matchesType =
      !this.filters.jobType ||
      job.jobType === this.filters.jobType;

    const matchesCategory =
      !this.filters.jobCategory ||
      job.jobCategory === this.filters.jobCategory;

    return matchesSearch && matchesType && matchesCategory;
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
