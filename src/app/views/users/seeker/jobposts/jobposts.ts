import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { JobpostService } from '../../../../core/services/jobpost-service';
import { JobPost } from '../../../../core/models/jobpost.model';
import { JOBPOSTCATEGORY } from '../../../../core/enums/jobpost-category.enum';
import { JOBPOSTTYPE } from '../../../../core/enums/jobpost-type.enum';

@Component({
  selector: 'app-jobposts',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './jobposts.html',
  styleUrl: './jobposts.css'
})
export class Jobposts implements OnInit {

  jobPosts: JobPost[] = [];
  filteredJobPosts: JobPost[] = [];
  totalJobPosts = 0;
  errorMessage = '';
  jobCategories = Object.values(JOBPOSTCATEGORY);
jobTypes = Object.values(JOBPOSTTYPE);


  filters = {
    search: '',
    jobType: '',
    jobCategory: '',
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
    this.fetchJobPosts();

  }

  /* =========================
     Fetch Jobs
  ========================== */
  fetchJobPosts(): void {
    this.jobpostService.getAllJobPosts().subscribe({
      next: (response) => {
        this.jobPosts = response.jobs;
        this.filteredJobPosts = [...this.jobPosts];
        this.totalJobPosts = response.totalJobs;
      },
      error: () => {
        this.errorMessage = 'Failed to load job posts';
      }
    });
  }



  /* =========================
     Save / Unsave
  ========================== */
  toggleSave(job: JobPost): void {
    job.saved ? this.unsaveJob(job) : this.saveJob(job);
  }

  saveJob(job: JobPost): void {
    this.jobpostService.saveJobPost(job._id).subscribe(() => {
      job.saved = true;
    });
  }

  unsaveJob(job: JobPost): void {
    this.jobpostService.unsaveJobPost(job._id).subscribe(() => {
      job.saved = false;
    });
  }

  /* =========================
     Navigation
  ========================== */
  goToJobDetails(jobPostId: string): void {
    this.router.navigate([`/jobSeeker/jobposts/${jobPostId}/job-details`]);
  }




  /* =========================
     Filters
  ========================== */
applyFilters(): void {
  this.filteredJobPosts = this.jobPosts.filter(job => {

    const matchSearch =
      !this.filters.search ||
      job.jobTitle.toLowerCase().includes(this.filters.search.toLowerCase());

    const matchType =
      !this.filters.jobType ||
      job.jobType === this.filters.jobType;

    const matchCategory =
      !this.filters.jobCategory ||
      job.jobCategory === this.filters.jobCategory;

    let matchStatus = true;

    if (this.filters.jobStatus === 'Applied') {
      matchStatus = job.isApplied === true;
    }

    if (this.filters.jobStatus === 'Saved') {
      matchStatus = job.saved === true;
    }

    return matchSearch && matchType && matchCategory && matchStatus;
  });
}


  clearFilter(filterKey: keyof typeof this.filters): void {
    this.filters[filterKey] = '';
    this.applyFilters();
  }
}
