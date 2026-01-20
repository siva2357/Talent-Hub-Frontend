import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QUALIFICATION } from '../../../../core/enums/qualification.enum';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { Router } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobPost } from '../../../../core/models/jobpost.model';
import { JOBPOSTCATEGORY } from '../../../../core/enums/jobpost-category.enum';
import { JOBPOSTTYPE } from '../../../../core/enums/jobpost-type.enum';
import { EXPERIENCE } from '../../../../core/enums/experience.enum';
import { LOCATIONS } from '../../../../core/enums/location.enum';
import { TimeAgoPipe } from '../../../../core/pipes/time.pipe';

@Component({
  selector: 'app-jobposts',
  imports: [FormsModule,ReactiveFormsModule,CommonModule,TimeAgoPipe],
  templateUrl: './jobposts.html',
  styleUrl: './jobposts.css',
  standalone: true,
})
export class Jobposts implements OnInit {

 jobPostForm!: FormGroup;
  jobPostCreated: boolean = false;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  jobPosts: JobPost[] = [];
selectedJobPostId: string | null = null;
isEditMode = false;
selectedJob: any = null;


  public qualifications = Object.values(QUALIFICATION);
  public jobPostType = Object.values(JOBPOSTTYPE);
  public jobPostCategories = Object.values(JOBPOSTCATEGORY);
  public locations = Object.values(LOCATIONS);
  public experience = Object.values(EXPERIENCE);


  // ORIGINAL DATA (never touch)
allJobPosts: JobPost[] = [];

// FILTERED DATA (UI uses this)
filteredJobPosts: JobPost[] = [];



// Filter state
filters = {
  search: '',
  jobType: '',
  jobCategory: '',
  status: ''
};

  constructor(
    private fb: FormBuilder,
    private jobPostService: JobpostService,
    private router: Router
  ) {}

  ngOnInit() {
      this.loadMyJobPosts();
    this.initializeForm();
  }




initializeForm() {
  this.jobPostForm = this.fb.group({
    jobId: ['', Validators.required],
    jobTitle: ['', Validators.required],
    jobType: ['', Validators.required],
    jobCategory: ['', Validators.required],
    experience: ['', Validators.required],
    qualification: ['', Validators.required],
    jobDescription: ['', Validators.required],

    salary: ['', Validators.required],
    vacancy: ['', Validators.required],
    location: ['', Validators.required],

    applyByDate: ['', Validators.required]
  });
}


loadMyJobPosts() {
  this.jobPostService.getMyJobPosts().subscribe({
    next: (res: any) => {
      this.allJobPosts = res.jobs || res;
      this.applyFilters(); // ✅ important
    },
    error: err => {
      this.errorMessage = err;
    }
  });
}

applyFilters() {
  this.filteredJobPosts = this.allJobPosts.filter(job => {

    const matchesSearch =
      !this.filters.search ||
      job.jobTitle.toLowerCase().includes(this.filters.search.toLowerCase());

    const matchesType =
      !this.filters.jobType ||
      job.jobType === this.filters.jobType;

    const matchesCategory =
      !this.filters.jobCategory ||
      job.jobCategory === this.filters.jobCategory;

    const matchesStatus =
      !this.filters.status ||
      job.status === this.filters.status;

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesStatus
    );
  });
}

removeFilter(key: 'search' | 'jobType' | 'jobCategory' | 'status') {
  this.filters[key] = '';
  this.applyFilters();
}



openJobOffcanvas(job: any) {
  this.selectedJob = job;
}



openEditModal(job: JobPost) {
  this.isEditMode = true;
  this.selectedJobPostId = job._id!;

  this.jobPostForm.patchValue({
    jobId: job.jobId,
    jobTitle: job.jobTitle,
    jobType: job.jobType,
    jobCategory: job.jobCategory,
    experience: job.experience,
    qualification: job.qualification,
    jobDescription: job.jobDescription,
    salary: job.salary,
    vacancy: job.vacancy,
    location: job.location,
    applyByDate: job.applyByDate
      ? new Date(job.applyByDate).toISOString().split('T')[0]
      : ''
  });

  // open bootstrap modal
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('addJobPostModal')
  );
  modal.show();
}




submitJobPost() {
  if (this.jobPostForm.invalid) return;

  this.isSubmitting = true;
  this.isLoading = true;

  const payload: JobPost = this.jobPostForm.value;

  const request$ = this.isEditMode && this.selectedJobPostId
    ? this.jobPostService.updateJobPost(this.selectedJobPostId, payload)
    : this.jobPostService.createJobPost(payload);

  request$.subscribe({
    next: () => {
      this.isSubmitting = false;
      this.isLoading = false;

      this.jobPostForm.reset({
        jobType: '',
    jobCategory: '',
    experience: '',
    qualification: '',
    location: ''
      });
      this.isEditMode = false;
      this.selectedJobPostId = null;

      this.loadMyJobPosts(); // refresh list
    },
    error: err => {
      this.isSubmitting = false;
      this.isLoading = false;
      this.errorMessage = err;
    }
  });
}



  confirmDiscard() {
    if (confirm('Are you sure you want to discard the changes?')) {
      this.discard();
    }
  }

discard() {
  this.jobPostForm.reset();
  this.isEditMode = false;
  this.selectedJobPostId = null;
}



closeJob(jobId: string) {
  if (!confirm('Are you sure you want to close this job?')) return;

  this.jobPostService.closeJobPost(jobId).subscribe({
    next: () => {
      this.loadMyJobPosts();
    },
    error: err => {
      this.errorMessage = err;
    }
  });
}

reopenJob(jobId: string) {
  if (!confirm('Are you sure you want to reopen this job?')) return;

  this.jobPostService.reopenJobPost(jobId).subscribe({
    next: () => {
      this.loadMyJobPosts();
    },
    error: err => {
      this.errorMessage = err;
    }
  });
}

deleteJob(jobId: string) {
  if (!confirm('This action cannot be undone. Delete job?')) return;

  this.jobPostService.deleteJobPost(jobId).subscribe({
    next: () => {
      this.loadMyJobPosts();
    },
    error: err => {
      this.errorMessage = err;
    }
  });
}


viewJob(jobId: string) {
  this.router.navigate([
    'recruiter/my-jobs',
    jobId,
    'job-details'
  ]);
}


}
