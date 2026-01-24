
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { JobpostService } from '../../../../core/services/jobpost-service';
import { JobPost } from '../../../../core/models/jobpost.model';

@Component({
  selector: 'app-applied-jobposts-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './applied-jobposts-page.html',
  styleUrl: './applied-jobposts-page.css',
})
export class AppliedJobpostsPage implements OnInit {

  jobPosts: JobPost[] = [];
  filteredJobPosts: JobPost[] = [];
  totalJobPosts = 0;
  errorMessage = '';
selectedJob: any = null;

  filters = {
    search: '',
    jobStatus: ''
  };

  constructor(
    private router: Router,
    private jobpostService: JobpostService
  ) {}

  /* =========================
     Lifecycle
  ========================== */
  ngOnInit(): void {
    this.fetchAppliedJobs();
  }

  /* =========================
     Fetch Applied Jobs
  ========================== */
  fetchAppliedJobs(): void {
    this.jobpostService.getAppliedJobPosts().subscribe({
      next: (res) => {
        this.jobPosts = res.appliedJobs;
        this.filteredJobPosts = [...this.jobPosts];
        this.totalJobPosts = res.totalAppliedJobs;
      },
      error: () => {
        this.errorMessage = 'Failed to load applied jobs';
      }
    });
  }

  /* =========================
     Filters
  ========================== */
  applyFilters(): void {
    this.filteredJobPosts = this.jobPosts.filter(job => {

      const matchSearch =
        !this.filters.search ||
        job.jobTitle.toLowerCase().includes(this.filters.search.toLowerCase());

      const matchStatus =
        !this.filters.jobStatus ||
        job.applicationStatus === this.filters.jobStatus;

      return matchSearch && matchStatus;
    });
  }

  clearFilter(filterKey: keyof typeof this.filters): void {
    this.filters[filterKey] = '';
    this.applyFilters();
  }


viewTracking(job: any) {
  this.selectedJob = job;

  const offcanvasEl = document.getElementById('trackingOffcanvas');
  if (offcanvasEl) {
    // @ts-ignore
    const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
    offcanvas.show();
  }
}


}
