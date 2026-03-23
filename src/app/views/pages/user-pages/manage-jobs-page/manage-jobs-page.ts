import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule, FormGroup } from '@angular/forms';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { Pagination } from "../../../components/pagination/pagination";
import { Table } from "../../../components/table/table";
import { Buttons } from '../../../components/buttons/buttons';

export interface JobPost {
  _id?: string;          // MongoDB id (used for update)
  jobId?: string;        // display ID like JOB-001
  title: string;         // UI field
  category: string;
  type: string;
  location: string;
  salary?: string;
  status: 'Open' | 'Closed';
  description?: string;
  applicants?: number;
  applyByDate:Date
}



@Component({
  selector: 'app-manage-jobs-page',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule, Pagination,Table,Buttons],
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



jobForm!: FormGroup;
selectedJob:any = null;
isEditMode = false;

  jobs :JobPost[]=[]
isLoadingJob = false;
jobPost:any;

  columns: any[] = [];
  page = 1;
limit = 5;
total = 0;
filteredJobPosts: any[] = [];
paginatedJobPosts: any[] = [];
isFiltering = false;

  @ViewChild('valueTemplate', { static: true })
  public valueTemplateRef!: TemplateRef<any>;

  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

@ViewChild('applicantsTemplate', { static: true })
public applicantsTemplateRef!: TemplateRef<any>;


  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

constructor(private jobService: JobpostService,  private fb: FormBuilder) {}

ngOnInit() {

  this.columns = [
  { name: 'S.No', prop: 'sno' }, // ✅ new
  { name: 'Job Id', prop: 'jobId' },
  { name: 'Job Title', prop: 'title' },
  { name: 'Category', prop: 'category' },
  { name: 'Job type', prop: 'type' },
  { name: 'Location', prop: 'location' },
  { name: 'Applicants', template: this.applicantsTemplateRef },
  { name: 'Status', template: this.statusTemplateRef },
  { name: 'Action', template: this.actionsTemplateRef, center: true },
];


  this.initForm();
  this.loadJobs();
}


initForm() {
  this.jobForm = this.fb.group({
    jobId:['',Validators.required],
    jobTitle: ['', Validators.required],
    jobCategory: ['', Validators.required],
    jobType: ['', Validators.required],
    location: ['', Validators.required],
    salary: [''],
    status: ['Open'],
    jobDescription: ['', Validators.required],
    applyByDate:['',Validators.required]
  });
}



applyFilters() {
  let data = [...this.jobs];

  if (this.searchText) {
    data = data.filter(c =>
      c.title?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedCategory) {
    data = data.filter(c => c.category === this.selectedCategory);
  }

  if (this.selectedJobtype) {
    data = data.filter(c => c.type === this.selectedJobtype);
  }

  if (this.selectedStatus) {
    data = data.filter(c => c.status === this.selectedStatus);
  }

  this.filteredJobPosts = [...data]; // 🔥 FIX
  this.isFiltering = true;

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedCategory = '';
  this.selectedJobtype = '';
  this.selectedStatus = '';

  this.filteredJobPosts = [];
  this.isFiltering = false; // ✅ important

  this.total = this.jobs.length;
  this.page = 1;

  this.applyPagination();
}


getActiveFilters(): { key: string; label: string }[] {
  const filters: { key: string; label: string }[] = [];

  if (this.searchText) {
    filters.push({ key: 'search', label: this.searchText });
  }

  if (this.selectedCategory ) {
    filters.push({ key: 'category', label: this.selectedCategory  });
  }

  if (this.selectedJobtype) {
    filters.push({ key: 'type', label: this.selectedJobtype });
  }

  if (this.selectedStatus) {
    filters.push({ key: 'status', label: this.selectedStatus });
  }

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'category') this.selectedCategory = '';
  if (key === 'type') this.selectedJobtype = '';
  if (key === 'status') this.selectedStatus = '';
  this.applyFilters(); // re-run filtering
}




addJob() {
  this.isEditMode = false;
  this.selectedJob = null;

  this.jobForm.reset({
    jobId:'',
    jobTitle: '',
    jobCategory: '',
    jobType: '',
    location: '',
    salary: '',
    status: 'Open',
    jobDescription: '',
    applyByDate:''
  });
}

selectJob(job: any) {
  this.isEditMode = true;

  this.jobService.getRecruiterJobPostById(job._id).subscribe({
    next: (res) => {
      const fullJob = res.jobPost;

      this.selectedJob = fullJob;

      this.jobForm.patchValue({
        jobId: fullJob.jobId || '',
        jobTitle: fullJob.jobTitle || '',
        jobCategory: fullJob.jobCategory || '',
        jobType: fullJob.jobType || '',
        location: fullJob.location || '',
        salary: fullJob.salary || '',
        status: fullJob.status || 'Open',
        jobDescription: fullJob.jobDescription || '',
        applyByDate: fullJob.applyByDate || ''
      });
    },
    error: (err) => console.error(err)
  });
}



saveJob() {
  if (this.jobForm.invalid) return;

  const form = this.jobForm.value;

  // 🔥 map correctly
 const payload = {
  jobId: form.jobId,
  jobTitle: form.jobTitle,
  jobCategory: form.jobCategory,
  jobType: form.jobType,
  location: form.location,
  salary: form.salary,
  status: form.status,
  jobDescription: form.jobDescription,
  applyByDate: form.applyByDate
};

  console.log('Payload:', payload); // debug
console.log('EditMode:', this.isEditMode);
console.log('SelectedJob:', this.selectedJob);
  if (this.isEditMode && this.selectedJob?._id) {
    this.jobService.updateJobPost(this.selectedJob._id, payload).subscribe({
      next: (res) => {
        console.log('Updated', res);
        this.closeModal();
        this.loadJobs();
      },
      error: (err) => console.error(err)
    });
  } else {
    this.jobService.createJobPost(payload).subscribe({
      next: (res) => {
        console.log('Created', res);
        this.closeModal();
        this.loadJobs();
      },
      error: (err) => console.error(err)
    });
  }
}

loadJobs() {
    this.jobService.getMyJobPosts().subscribe({
    next: (res) => {
      this.jobs = res.jobs || [];

      this.total = this.jobs.length;   // ✅ set total
      this.applyPagination();               // ✅ IMPORTANT
    },
    error: (err) => {
      console.error("Error fetching jobs:", err);
    }
  });
}



applyPagination() {
  const source = this.isFiltering
    ? this.filteredJobPosts
    : this.jobs;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedJobPosts = source.slice(start, end).map((item, index) => ({
    ...item,
    sno: start + index + 1
  }));
}


onPageChange(p: number) {
  this.page = p;
  this.applyPagination();
}

onLimitChange(l: number) {
  this.limit = l;
  this.page = 1;
  this.applyPagination();
}



closeModal() {
  const modal = document.getElementById('jobFormModal');
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }
}


closeActionModal() {
  const modal = document.getElementById('actionModal');
  if (modal) {
    (window as any).bootstrap.Modal.getInstance(modal)?.hide();
  }
}

modalType: 'close' | 'reopen' | 'delete' = 'close';
modalTitle = '';
modalMessage = '';
modalButtonText = '';


openActionModal(job: any, type: 'close' | 'reopen' | 'delete') {
  this.selectedJob = job;
  this.modalType = type;

  if (type === 'close') {
    this.modalTitle = 'Close Job';
    this.modalMessage = 'Are you sure you want to close this job posting?';
    this.modalButtonText = 'Close Job';
  }

  if (type === 'reopen') {
    this.modalTitle = 'Reopen Job';
    this.modalMessage = 'Are you sure you want to reopen this job posting?';
    this.modalButtonText = 'Reopen Job';
  }

  if (type === 'delete') {
    this.modalTitle = 'Delete Job';
    this.modalMessage = 'Are you sure you want to delete this job posting?';
    this.modalButtonText = 'Delete Job';
  }

  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('actionModal')
  );
  modal.show();
}


confirmAction() {
  if (!this.selectedJob?._id) return;

  if (this.modalType === 'close') {
    this.closeJob(this.selectedJob);
  }

  if (this.modalType === 'reopen') {
    this.reopenJob(this.selectedJob);
  }

  if (this.modalType === 'delete') {
    this.deleteJob(this.selectedJob);
  }

  this.closeActionModal();
}

closeJob(job: any) {
  if (!job?._id) return;

  this.jobService.closeJobPost(job._id).subscribe({
    next: (res) => {
      console.log("Closed:", res);

      this.loadJobs();      // 🔥 refresh list
      this.closeActionModal();    // optional
    },
    error: (err) => console.error(err)
  });
}

reopenJob(job: any) {
  if (!job?._id) return;

  this.jobService.reopenJobPost(job._id).subscribe({
    next: (res) => {
      console.log("Reopened:", res);

      this.loadJobs();  // refresh
      this.closeActionModal()
    },
    error: (err) => console.error(err)
  });
}

deleteJob(job: any) {
  if (!job?._id) return;

  this.jobService.deleteJobPost(job._id).subscribe({
    next: (res) => {
      console.log("Deleted:", res);

      this.loadJobs();  // refresh list
      this.closeActionModal()
    },
    error: (err) => console.error(err)
  });
}


viewJob(job: any) {
  this.isLoadingJob = true;

  this.jobService.getRecruiterJobPostById(job._id).subscribe({
    next: (res) => {
      this.selectedJob = res.jobPost;
      this.isLoadingJob = false;
      this.openViewModal();
    },
    error: (err) => {
      this.isLoadingJob = false;
      console.error(err);
    }
  });
}

openViewModal() {
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('viewJobModal')
  );
  modal.show();
}

}
