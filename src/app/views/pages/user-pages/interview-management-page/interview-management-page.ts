import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InterviewService } from '../../../../core/services/interview-service';
import { UpdateInterviewDTO } from '../../../../core/dtos/interview.dto';
import { Pagination } from "../../../components/pagination/pagination";
import { Table } from "../../../components/table/table";
import { Buttons } from "../../../components/buttons/buttons";


@Component({
  selector: 'app-interview-management-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Pagination, Table, Buttons],
  templateUrl: './interview-management-page.html',
  styleUrl: './interview-management-page.css',
})
export class InterviewManagementPage implements OnInit {

constructor(  private fb: FormBuilder,private interviewService: InterviewService) {}

interviewForm!: FormGroup;
minDate = new Date().toISOString().split('T')[0];
  columns: any[] = [];



  @ViewChild('statusTemplate', { static: true })
  public statusTemplateRef!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { static: true })
  public actionsTemplateRef!: TemplateRef<any>;

  page = 1;
limit = 5;
total = 0;
paginatedInterviews: any[] = [];
filteredInterviews: any[] = [];
isFiltering = false;


ngOnInit() {
  this.columns = [
  { name: 'S.NO', prop: 'sno' }, // ✅ new
  { name: 'Job ID', prop:'jobId' },
  { name: 'Job Title', prop: 'jobTitle' },
  { name: 'Applicant Name', prop: 'jobSeekerName' },
  { name: 'Email', prop: 'email' },
  { name: 'Interview Date', prop: 'scheduledDate' },
  { name: 'Status', template: this.statusTemplateRef},
  { name: 'Actions', template: this.actionsTemplateRef, center: true },
];


  this.loadInterviews();
  this.initForm();
}

initForm() {
this.interviewForm = this.fb.group({
  _id: [''], // ✅ ADD THIS

  jobPostId: [''],
  jobSeekerId: [''],

  jobTitle: [{ value: '', disabled: true }],
  candidateName: ['', Validators.required],
  interviewTitle:['',Validators.required],
  date: ['', Validators.required],
  time: ['', Validators.required],

  meetingLink: ['', Validators.required],

  status: ['Scheduled'],
  description: ['']
});
}

loadInterviews() {
  this.loading = true;

  this.interviewService.getAllRecruiterInterviews().subscribe({
    next: (res) => {
      this.interviews = res.meetings || [];
      this.total = this.interviews.length;   // ✅ set total
      this.applyPagination();

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}


applyPagination() {
  const source = this.filteredInterviews.length || this.isFiltering
    ? this.filteredInterviews
    : this.interviews;

  const start = (this.page - 1) * this.limit;
  const end = start + this.limit;

  this.paginatedInterviews = source.slice(start, end).map((item, index) => ({
    ...item,
    sno: start + index + 1 // ✅ generates 1,2,3,4...
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




selectInterview(interview: any) {
  this.isEditMode = true;

  const formatted = {
    ...interview,
    date: this.formatDate(interview.scheduledDate),
    time: this.formatTime(interview.startTime)
  };

  this.selectedInterview = formatted;

  // ✅ PATCH FORM HERE
  this.interviewForm.patchValue({
    _id: interview._id, // important
    jobPostId: interview.jobPostId,
    jobSeekerId: interview.jobSeekerId,
    jobTitle: interview.jobTitle,
    candidateName: interview.jobSeekerName,
    interviewTitle: interview.interviewTitle,
    date: formatted.date,
    time: formatted.time,
    meetingLink: interview.meetingJoinUrl,
    status: interview.status,
    description: interview.interviewDescription
  });
}


formatDate(date: string) {
  return new Date(date).toISOString().split('T')[0];
}

formatTime(date: string) {
  return new Date(date).toTimeString().slice(0, 5);
}

selectedInterview:any
isEditMode = false;



interviews: any[] = [];
loading = false;



saveInterview() {

  if (this.interviewForm.invalid) {
    this.interviewForm.markAllAsTouched();
    return;
  }

  const form = this.interviewForm.getRawValue();

  const start = new Date(`${form.date}T${form.time}`);
  const end = new Date(start.getTime() + 30 * 60000);

  const payload: UpdateInterviewDTO = {
    interviewTitle:form.interviewTitle,
    interviewDescription: form.description,
    scheduledDate: new Date(form.date).toISOString(),
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    meetingJoinUrl: form.meetingLink,
    status: form.status
  };

  // ✅ FIXED UPDATE LOGIC
  if (this.isEditMode && form._id) {
    this.interviewService.updateInterview(form._id, payload).subscribe(() => {
      this.loadInterviews();
      this.resetForm();
    });
  }
}


resetForm() {
  this.isEditMode = false;
  this.interviewForm.reset({
    status: 'Scheduled'
  });
}

openDeleteModal(interview: any) {
  this.selectedInterview = interview;
}

confirmDelete() {
  if (!this.selectedInterview?._id) return;

  this.interviewService.deleteInterview(this.selectedInterview._id).subscribe({
    next: (res) => {
      console.log(res.message);

      // ✅ Refresh list
      this.loadInterviews();

      // ✅ Close modal manually
      const modal = document.getElementById('deleteInterviewModal');
      if (modal) {
        (window as any).bootstrap.Modal.getInstance(modal)?.hide();
      }

      // ✅ Reset selection
      this.selectedInterview = null;
    },
    error: (err) => {
      console.error(err);
    }
  });
}


}
