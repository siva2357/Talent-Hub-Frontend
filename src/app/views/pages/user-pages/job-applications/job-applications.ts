import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationService } from '../../../../core/services/applications-service';
import { Table } from "../../../components/table/table";
import { Pagination } from "../../../components/pagination/pagination";
@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, Table, Pagination],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications {

  selectedApplicant: any = null;
job: any = {};
applicants: any[] = [];

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


constructor( private route: ActivatedRoute, private appService: ApplicationService) {}


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


scheduleInterview(){
this.selectedInterview = {
jobTitle:'',
candidateName:'',
date:'',
time:'',
meetingLink:'',
status:'Scheduled',
description:''
};
}




}
