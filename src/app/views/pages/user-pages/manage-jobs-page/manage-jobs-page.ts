import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { Buttons } from '../../../components/buttons/buttons';
import { InputFields } from "../../../components/input-fields/input-fields";
import { JobPost } from '../../../../core/models/jobpost.model';

@Component({
  selector: 'app-manage-jobs-page',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, Buttons, InputFields],
  templateUrl: './manage-jobs-page.html',
  styleUrl: './manage-jobs-page.css',
})
export class ManageJobsPage implements OnInit {
  categories = ['Frontend', 'Backend', 'Full Stack', 'Data Science'];
  jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
  statuses = ['Closed', 'Open'];

  searchText = '';
  selectedCategory = '';
  selectedJobtype = '';
  selectedStatus = '';

  appliedSearchText = '';
  appliedCategory = '';
  appliedJobtype = '';
  appliedStatus = '';

  jobForm!: FormGroup;
  selectedJob: any = null;
  isEditMode = false;
  isLoadingJob = false;

  jobs: JobPost[] = [];
  jobPost: any[] = []; // Unified data source for the template
  isFiltering = false;

  constructor(private jobService: JobpostService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForm();
    this.loadJobs();
  }

  initForm() {
    this.jobForm = this.fb.group({
      jobId: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobCategory: ['', Validators.required],
      jobType: ['', Validators.required],
      location: ['', Validators.required],
      salary: ['', Validators.required],
      status: ['Open'],
      jobDescription: ['', Validators.required],
      applyByDate: ['', Validators.required]
    });
  }

  loadJobs() {
    this.jobService.getMyJobPosts().subscribe({
      next: (res) => {
        this.jobs = res.jobs || [];
        if (this.isFiltering) {
          this.executeFilter();
        } else {
          this.jobPost = [...this.jobs];
        }
      },
      error: (err) => console.error("Error fetching jobs:", err)
    });
  }

  applyFilters() {
    this.appliedSearchText = this.searchText;
    this.appliedCategory = this.selectedCategory;
    this.appliedJobtype = this.selectedJobtype;
    this.appliedStatus = this.selectedStatus;
    this.executeFilter();
  }

  executeFilter() {
    let data = [...this.jobs];

    if (this.appliedSearchText) {
      data = data.filter(c =>
        c.title?.toLowerCase().includes(this.appliedSearchText.toLowerCase())
      );
    }

    if (this.appliedCategory) {
      data = data.filter(c => c.category === this.appliedCategory);
    }

    if (this.appliedJobtype) {
      data = data.filter(c => c.type === this.appliedJobtype);
    }

    if (this.appliedStatus) {
      data = data.filter(c => c.status === this.appliedStatus);
    }

    this.jobPost = [...data];
    this.isFiltering = true;
  }

  resetFilters() {
    this.searchText = '';
    this.selectedCategory = '';
    this.selectedJobtype = '';
    this.selectedStatus = '';

    this.appliedSearchText = '';
    this.appliedCategory = '';
    this.appliedJobtype = '';
    this.appliedStatus = '';

    this.isFiltering = false;
    this.jobPost = [...this.jobs];
  }

  getActiveFilters(): { key: string; label: string }[] {
    const filters: { key: string; label: string }[] = [];
    if (this.appliedSearchText) filters.push({ key: 'search', label: this.appliedSearchText });
    if (this.appliedCategory) filters.push({ key: 'category', label: this.appliedCategory });
    if (this.appliedJobtype) filters.push({ key: 'type', label: this.appliedJobtype });
    if (this.appliedStatus) filters.push({ key: 'status', label: this.appliedStatus });
    return filters;
  }

  removeFilter(key: string) {
    if (key === 'search') { this.searchText = ''; this.appliedSearchText = ''; }
    if (key === 'category') { this.selectedCategory = ''; this.appliedCategory = ''; }
    if (key === 'type') { this.selectedJobtype = ''; this.appliedJobtype = ''; }
    if (key === 'status') { this.selectedStatus = ''; this.appliedStatus = ''; }
    this.executeFilter();
  }

  addJob() {
    this.isEditMode = false;
    this.selectedJob = null;
    this.jobForm.reset({
      jobId: '', jobTitle: '', jobCategory: '', jobType: '',
      location: '', salary: '', status: 'Open', jobDescription: '', applyByDate: ''
    });
  }

  selectJob(job: any) {
    this.isEditMode = true;
    this.jobService.getRecruiterJobPostById(job._id).subscribe({
      next: (res) => {
        const fullJob = res.jobPost;
        this.selectedJob = fullJob;
        const formattedDate = fullJob.applyByDate ? new Date(fullJob.applyByDate).toISOString().split('T')[0] : '';
        this.jobForm.patchValue({
          jobId: fullJob.jobId || '',
          jobTitle: fullJob.title || '',
          jobCategory: fullJob.category || '',
          jobType: fullJob.type || '',
          location: fullJob.location || '',
          salary: fullJob.salary || '',
          status: fullJob.status || 'Open',
          jobDescription: fullJob.description || '',
          applyByDate: formattedDate
        });
      },
      error: (err) => console.error(err)
    });
  }

  saveJob() {
    if (this.jobForm.invalid) return;
    const form = this.jobForm.value;
    const payload = {
      jobId: form.jobId,
      title: form.jobTitle,
      category: form.jobCategory,
      type: form.jobType,
      location: form.location,
      salary: form.salary,
      status: form.status,
      description: form.jobDescription,
      applyByDate: form.applyByDate
    };

    if (this.isEditMode && this.selectedJob?._id) {
      this.jobService.updateJobPost(this.selectedJob._id, payload).subscribe({
        next: () => { this.closeModal(); this.loadJobs(); },
        error: (err) => console.error(err)
      });
    } else {
      this.jobService.createJobPost(payload).subscribe({
        next: () => { this.closeModal(); this.loadJobs(); },
        error: (err) => console.error(err)
      });
    }
  }

  closeModal() {
    const modal = document.getElementById('jobFormModal');
    if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  openActionModal(job: any, type: 'close' | 'reopen' | 'delete') {
    this.selectedJob = job;
    this.modalType = type;
    if (type === 'close') { this.modalTitle = 'Close Posting'; this.modalMessage = 'Are you sure you want to close this job?'; this.modalButtonText = 'Close'; }
    if (type === 'reopen') { this.modalTitle = 'Reopen Posting'; this.modalMessage = 'Are you sure you want to reopen this job?'; this.modalButtonText = 'Reopen'; }
    if (type === 'delete') { this.modalTitle = 'Delete Posting'; this.modalMessage = 'This action cannot be undone. Delete?'; this.modalButtonText = 'Delete'; }
    const modal = new (window as any).bootstrap.Modal(document.getElementById('actionModal'));
    modal.show();
  }

  modalType: 'close' | 'reopen' | 'delete' = 'close';
  modalTitle = '';
  modalMessage = '';
  modalButtonText = '';

  confirmAction() {
    if (!this.selectedJob?._id) return;
    if (this.modalType === 'close') this.closeJob(this.selectedJob);
    if (this.modalType === 'reopen') this.reopenJob(this.selectedJob);
    if (this.modalType === 'delete') this.deleteJob(this.selectedJob);
    this.closeActionModal();
  }

  closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }

  closeJob(job: any) {
    this.jobService.closeJobPost(job._id).subscribe({ next: () => this.loadJobs(), error: (err) => console.error(err) });
  }

  reopenJob(job: any) {
    this.jobService.reopenJobPost(job._id).subscribe({ next: () => this.loadJobs(), error: (err) => console.error(err) });
  }

  deleteJob(job: any) {
    this.jobService.deleteJobPost(job._id).subscribe({ next: () => this.loadJobs(), error: (err) => console.error(err) });
  }

  viewJob(job: any) {
    this.isLoadingJob = true;
    this.jobService.getRecruiterJobPostById(job._id).subscribe({
      next: (res) => { this.selectedJob = res.jobPost; this.isLoadingJob = false; this.openViewModal(); },
      error: (err) => { this.isLoadingJob = false; console.error(err); }
    });
  }

  openViewModal() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('viewJobModal'));
    modal.show();
  }

  goToApplicants(jobId: string) {
    if (jobId) this.router.navigate(['/user/my-jobposts', jobId, 'job-applications']);
  }
}
