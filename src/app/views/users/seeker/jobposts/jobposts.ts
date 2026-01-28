import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { JobpostService } from '../../../../core/services/jobpost-service';
import { JobPost } from '../../../../core/models/jobpost.model';
import { JOBPOSTCATEGORY } from '../../../../core/enums/jobpost-category.enum';
import { JOBPOSTTYPE } from '../../../../core/enums/jobpost-type.enum';
import { TimeAgoPipe } from "../../../../core/pipes/time.pipe";
import { RecommendationService } from '../../../../core/services/recommendation-service';
import { JobMatchResponse } from '../../../../core/models/jobMatchReponse.model';
import { getMatchBadge } from '../../../../core/helpers/job-match.helper';

@Component({
  selector: 'app-jobposts',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeAgoPipe],
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
selectedJob: JobPost | null = null;
  jobPostId!: string;
    jobMatch!: JobMatchResponse;
  loading = true;
  recommendedJobs: any[] = [];

badge: { label: string; color: string } | null = null;

  filters = {
    search: '',
    jobType: '',
    jobCategory: '',
    jobStatus: ''
  };

  constructor(
    private router: Router,
    private jobpostService: JobpostService,
    private recommendService:RecommendationService
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






openJobOffcanvas(job: any) {
  this.selectedJob = job;
  this.jobPostId = job._id;   // or job._id depending on API
  this.loadJobMatch();
  this.loadRecommendedJobs();// 👈 NEW
}

loadJobMatch(): void {
  if (!this.jobPostId) return; // safety

  this.recommendService.getJobResumeMatch(this.jobPostId).subscribe({
    next: (res) => {
      this.jobMatch = res;
      this.badge = getMatchBadge(res.matchLevel); // ✅ SAFE
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}

loadRecommendedJobs(): void {
  if (!this.jobPostId) return;

  this.recommendService.getRecommendedJobs(this.jobPostId).subscribe({
    next: (jobs) => {
      this.recommendedJobs = jobs;
    },
    error: () => {
      this.recommendedJobs = [];
    }
  });
}


private closeOffcanvas(): void {
  const offcanvasEl = document.getElementById('jobOffcanvas');
  if (!offcanvasEl) return;

  const win = window as any;

  const bsOffcanvas = win.bootstrap?.Offcanvas?.getInstance(offcanvasEl);
  bsOffcanvas?.hide();
}



applyJob(): void {
  if (!this.selectedJob) return;

  this.jobpostService.applyJobPost(this.selectedJob._id).subscribe({
    next: () => {
      this.selectedJob!.isApplied = true;   // updates card + offcanvas
      this.closeOffcanvas();                // auto close
    },
    error: () => alert('Failed to apply for job')
  });
}

withdrawJob(): void {
  if (!this.selectedJob) return;

  this.jobpostService.withdrawJobPost(this.selectedJob._id).subscribe({
    next: () => {
      this.selectedJob!.isApplied = false;  // updates card + offcanvas
      this.closeOffcanvas();                // auto close
    },
    error: () => alert('Failed to withdraw application')
  });
}


}
