import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationService } from '../../../../core/services/applications-service';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
import { Buttons } from "../../../components/buttons/buttons";
import { AssessmentService } from '../../../../core/services/assessment-service';
import { InterviewService } from '../../../../core/services/interview-service';
import { CreateInterviewDTO } from '../../../../core/dtos/interview.dto';
@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, Table, Pagination, Buttons],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications {
minDate = new Date().toISOString().split('T')[0];
  selectedApplicant: any = null;
job: any = {};
applicants: any[] = [];
statusList: string[]  =["Pending", "InProcess", 'Assessment Assigned', 'Interview Scheduled', "Shortlisted", "Rejected"]
columns: any[] = [];
page = 1;
limit = 5;
total = 0;
filteredApplicants: any[] = [];
paginatedApplicants: any[] = [];
isFiltering = false;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;



    @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const jobId = params.get('id');

    if (jobId) {
      console.log('Job ID from route:', jobId);
      this.loadApplicants(jobId);
    }

    this.initForm();
  });

    this.columns = [
  { name: 'S.No', prop: 'sno' }, // ✅ new
  { name: 'Full Name', prop: 'name' },
  { name: 'Email', prop: 'email' },
  { name: 'Phone', prop: 'phone' },
  { name: 'Applied Date', prop: 'appliedAt' },
  { name: 'Status', template: this.statusTemplateRef },
  { name: 'Action', template: this.actionsTemplateRef, center: true },
];



}


constructor( private route: ActivatedRoute, private appService: ApplicationService, private assessmentService:AssessmentService, private interviewService:InterviewService, private fb: FormBuilder,) {}


loadApplicants(jobId: string) {
  this.appService.getApplicants(jobId).subscribe({
    next: (res: any) => {
      console.log('Full Response:', res);

      this.loadJobData(res);
      this.loadApplicantsData(res);

      this.total = this.applicants.length;   // ✅ total count
      this.applyPagination();                // ✅ apply after data load
    },
    error: (err) => {
      console.error('Error:', err);
    }
  });
}


loadJobData(res: any) {
  this.job = res.job || {};

  console.log('Job Loaded:', this.job);
}


loadApplicantsData(res: any) {
  this.applicants = res.job?.applicants || [];

  console.log('Applicants Loaded:', this.applicants);
}


applyPagination() {
  const source = this.isFiltering
    ? this.filteredApplicants   // ✅ FIX
    : this.applicants;          // ✅ FIX

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedApplicants = source.slice(start, end).map((item, index) => ({
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


  viewApplicant(applicant: any) {
    this.selectedApplicant = applicant;
  }

selectedInterview:any = {
jobTitle:'',
candidateName:'',
date:'',
time:'',
meetingLink:'',
status:'Scheduled',
description:''
};


scheduleInterview(job: any, applicant: any) {
  this.interviewForm.patchValue({
    jobPostId: job._id || job.id,
    jobSeekerId: applicant.jobSeekerId,
    interviewTitle:'',
    date: '',
    time: '',
    meetingLink: '',
    status: 'Scheduled',
    description: ''
  });
}

interviewForm!: FormGroup;

initForm() {
  this.interviewForm = this.fb.group({
    jobPostId: [''],
    jobSeekerId: [''],
    interviewTitle:['',Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],

    meetingLink: ['', [Validators.required]],

    status: ['Scheduled', Validators.required],

    description: ['']
  });
}


submitInterview() {

  if (this.interviewForm.invalid) {
    this.interviewForm.markAllAsTouched();
    return;
  }

  const form = this.interviewForm.getRawValue();

  const start = new Date(`${form.date}T${form.time}`);
  const end = new Date(start.getTime() + 30 * 60000);

  const payload: CreateInterviewDTO = {
    interviewTitle:form.interviewTitle,
    jobPostId: form.jobPostId,
    jobSeekerId: form.jobSeekerId,
    interviewDescription: form.description,
    scheduledDate: new Date(form.date).toISOString(),
    startTime: start.toISOString(),
    endTime: end.toISOString(),

    meetingJoinUrl: form.meetingLink
  };

  this.interviewService.createInterview(payload).subscribe({
    next: () => {
      console.log("Interview scheduled successfully");

      const modal = document.getElementById('scheduleInterviewModal');
      (window as any).bootstrap.Modal.getInstance(modal)?.hide();

      this.interviewForm.reset();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

searchText = '';
selectedStatus = '';



applyFilters() {
  let data = [...this.applicants];

  if (this.searchText) {
    data = data.filter(c =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  if (this.selectedStatus) {
    data = data.filter(c => c.status === this.selectedStatus);
  }

  this.filteredApplicants = data;
  this.isFiltering = true;   // ✅ important

  this.total = data.length;
  this.page = 1;

  this.applyPagination();
}

resetFilters() {
  this.searchText = '';
  this.selectedStatus = '';

  this.filteredApplicants = [];
  this.isFiltering = false; // ✅ important

  this.total = this.applicants.length;
  this.page = 1;

  this.applyPagination();
}



getActiveFilters(): { key: string; label: string }[] {
  const filters: { key: string; label: string }[] = [];

  if (this.searchText) {
    filters.push({ key: 'search', label: this.searchText });
  }

  if (this.selectedStatus) {
    filters.push({ key: 'status', label: this.selectedStatus });
  }

  return filters;
}

removeFilter(key: string) {
  if (key === 'search') this.searchText = '';
  if (key === 'status') this.selectedStatus = '';
  this.applyFilters(); // re-run filtering
}


selectedAssessment: any = {
  jobPostId: '',
  jobSeekerId: '',
  assessmentLink: '',
  dueDate: '',
  description: ''
};

openAssessmentModal(job: any, applicant: any) {

  const jobId = job._id || job.id; // ✅ FIX

  if (!jobId || !applicant?.jobSeekerId) {
    console.error('Invalid data', job, applicant);
    return;
  }

  this.selectedAssessment = {
    jobPostId: jobId, // ✅ FIXED
    jobSeekerId: applicant.jobSeekerId,
    assessmentLink: '',
    dueDate: '',
    description: ''
  };

  const modal = new (window as any).bootstrap.Modal(
    document.getElementById('assessmentModal')
  );

  modal.show();
}


submitAssessment() {

  const payload = {
    jobPostId: this.selectedAssessment.jobPostId,
    jobSeekerId: this.selectedAssessment.jobSeekerId,
    assessmentLink: this.selectedAssessment.assessmentLink,
    dueDate: this.selectedAssessment.dueDate,
    description: this.selectedAssessment.description
  };

  this.assessmentService.createAssessment(payload).subscribe({
    next: () => {
      console.log('Assessment assigned');

      const modal = document.getElementById('assessmentModal');
      (window as any).bootstrap.Modal.getInstance(modal)?.hide();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

hireApplicant(applicant: any) {
  const jobId = this.job._id || this.job.id;

  this.appService.hire(jobId, applicant.jobSeekerId).subscribe({
    next: () => {
      applicant.status = 'Shortlisted'; // or 'Hired' if backend sets it
      console.log('Candidate hired');
    },
    error: (err) => console.error(err)
  });
}


rejectApplicant(applicant: any) {
  const jobId = this.job._id || this.job.id;

  this.appService.reject(jobId, applicant.jobSeekerId).subscribe({
    next: () => {
      applicant.status = 'Rejected';
      console.log('Candidate rejected');
    },
    error: (err) => console.error(err)
  });
}

}
