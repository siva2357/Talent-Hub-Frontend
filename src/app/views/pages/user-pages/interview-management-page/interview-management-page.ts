import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InterviewService } from '../../../../core/services/interview-service';
import { UpdateInterviewDTO } from '../../../../core/dtos/interview.dto';


@Component({
  selector: 'app-interview-management-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './interview-management-page.html',
  styleUrl: './interview-management-page.css',
})
export class InterviewManagementPage implements OnInit {

constructor(  private fb: FormBuilder,private interviewService: InterviewService) {}

interviewForm!: FormGroup;
minDate = new Date().toISOString().split('T')[0];

ngOnInit() {
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
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
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
