import { AssessmentService } from './../../../../core/services/assessment-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { JobpostService } from '../../../../core/services/jobpost-service';
import { InterviewService } from '../../../../core/services/interview-service';
import { CreateInterviewPayload, Interview } from '../../../../core/models/interview.model';

declare var bootstrap: any;

@Component({
  selector: 'app-applicants-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applicants-list-page.html',
  styleUrl: './applicants-list-page.css',
})
export class ApplicantsListPage implements OnInit {

  jobPostId!: string;
  applicants: any[] = [];
  loading = true;
  errorMessage = '';

  selectedApplicant!: any;
  isEditMode = false;
  interviewId?: string;

  private interviewModal!: any;

  assignModal!: any;
jobTitle = '';
jobCategory = '';

assessmentStatus: 'Assigned' | 'Completed' | 'Reviewed' | null = null;

interviewForm = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  meetingJoinUrl: '',
  status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Not Completed'
};

isAssessmentEditMode = false;
assessmentLink = '';
assessmentId: string | null = null;

  report: any;
reportLoading = false;
private reportModal!: any;


  constructor(
    private route: ActivatedRoute,
    private jobpostService: JobpostService,
    private interviewService: InterviewService,
    private router: Router,
    private assessmentService :AssessmentService,
  ) {}

  ngOnInit(): void {
    this.jobPostId = this.route.snapshot.paramMap.get('jobId')!;
    this.fetchApplicants();
  }

  fetchApplicants(): void {
    this.jobpostService.getJobApplicants(this.jobPostId).subscribe({
      next: res => {
        this.applicants = res.applicants || res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load applicants';
        this.loading = false;
      }
    });
  }

  viewApplicantProfile(applicantId: string): void {
    this.router.navigate([
      'recruiter/job-applications',
      this.jobPostId,
      'applicant-list',
      applicantId,
      'profile'
    ]);
  }

  /* ================= INTERVIEW MODAL ================= */

openInterviewModal(applicant: any): void {
  this.selectedApplicant = applicant;
  this.isEditMode = applicant.interviewScheduled === true;

  // reset form
  this.interviewForm = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  meetingJoinUrl: '',
  status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Not Completed'
};


  if (!this.interviewModal) {
    this.interviewModal = new bootstrap.Modal(
      document.getElementById('interviewModal')
    );
  }

  // ✅ CREATE MODE
  if (!this.isEditMode) {
    this.interviewModal.show();
    return;
  }

  // ✅ EDIT MODE → FETCH INTERVIEW
  this.interviewService
    .getInterviewByApplicant(this.jobPostId, applicant.jobSeekerId)
    .subscribe(interview => {
      this.interviewId = interview._id;
this.interviewForm = {
  title: interview.interviewTitle,
  description: interview.interviewDescription || '',
  date: this.extractDate(interview.scheduledDate),
  startTime: this.extractTime(interview.startTime),
  endTime: this.extractTime(interview.endTime),
  meetingJoinUrl: interview.meetingJoinUrl,
  status: interview.status
};


      this.interviewModal.show();
    });
}


submitInterview(): void {
  if (!this.interviewForm.date || !this.interviewForm.startTime || !this.interviewForm.endTime) {
    alert('Date, start time and end time are required');
    return;
  }
  if (!this.interviewForm.meetingJoinUrl) {
  alert('Meeting link is required');
  return;
}


  const start = this.buildDateTime(this.interviewForm.date, this.interviewForm.startTime);
  const end = this.buildDateTime(this.interviewForm.date, this.interviewForm.endTime);

  if (end <= start) {
    alert('End time must be after start time');
    return;
  }

  /* ================= EDIT MODE ================= */
  if (this.isEditMode && this.interviewId) {

const updateData: Partial<Interview> = {
  interviewTitle: this.interviewForm.title,
  interviewDescription: this.interviewForm.description,
  startTime: start,
  endTime: end,
  meetingJoinUrl: this.interviewForm.meetingJoinUrl,
  status: this.interviewForm.status
};


    this.interviewService
      .updateInterview(this.interviewId, updateData)
      .subscribe(() => this.afterSubmit());

    return;
  }

  /* ================= CREATE MODE ================= */
const payload: CreateInterviewPayload = {
  jobSeekerId: this.selectedApplicant.jobSeekerId,
  jobPostId: this.jobPostId,

  interviewTitle: this.interviewForm.title || 'Networking Interview',
  interviewDescription: this.interviewForm.description || '',

  scheduledDate: this.interviewForm.date,
  startTime: start,
  endTime: end,

  meetingJoinUrl: this.interviewForm.meetingJoinUrl
};

  this.interviewService
    .createInterview(payload)
    .subscribe(() => this.afterSubmit());
}


  afterSubmit(): void {
    this.closeModal();
    this.fetchApplicants();
  }

  closeModal(): void {
    this.interviewModal?.hide();
  }

  goBack(): void {
    this.router.navigate(['recruiter/job-applications']);
  }

  /* ================= UTIL ================= */

  private buildDateTime(date: string, time: string): Date {
    return new Date(`${date}T${time}`);
  }

  private extractDate(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private extractTime(date: string | Date): string {
    return new Date(date).toTimeString().slice(0, 5);
  }






openAssignAssessmentModal(applicant: any): void {
  this.selectedApplicant = applicant;


  // You already have this info from backend response
  this.jobTitle = this.route.snapshot.data['jobTitle'] || 'Angular Developer';
  this.jobCategory = 'Frontend Development'; // or from job API


  this.isAssessmentEditMode = false;
  this.assessmentId = null;
  this.assessmentLink = '';
  this.assessmentStatus = null;

  if (!this.assignModal) {
    this.assignModal = new bootstrap.Modal(
      document.getElementById('assignAssessmentModal')
    );
  }

  this.assignModal.show();
}



openUpdateAssessmentModal(applicant: any): void {
  this.selectedApplicant = applicant;

  // You already have this info from backend response
  this.jobTitle = this.route.snapshot.data['jobTitle'] || 'Angular Developer';
  this.jobCategory = 'Frontend Development'; // or from job API
  this.isAssessmentEditMode = true;
  this.assessmentId = applicant.assessmentId;
  this.assessmentLink = applicant.assessmentLink;

  // 👇 THIS IS THE KEY LINE
  this.assessmentStatus = applicant.assessmentStatus;

  if (!this.assignModal) {
    this.assignModal = new bootstrap.Modal(
      document.getElementById('assignAssessmentModal')
    );
  }

  this.assignModal.show();
}




submitAssessment(): void {

  if (!this.assessmentLink) {
    alert('Assessment link is required');
    return;
  }

  // ✅ UPDATE MODE
  if (this.isAssessmentEditMode && this.assessmentId) {

    this.assessmentService
      .updateAssessment(this.assessmentId, {
        assessmentLink: this.assessmentLink
      })
      .subscribe({
        next: () => {
          alert('Assessment updated successfully');
          this.closeAssignModal();
          this.fetchApplicants();
        },
        error: err => alert(err)
      });

    return;
  }

  // ✅ CREATE MODE
  const payload = {
    jobPostId: this.jobPostId,
    jobSeekerId: this.selectedApplicant.jobSeekerId,
    assessmentLink: this.assessmentLink
  };

  this.assessmentService.createAssessment(payload).subscribe({
    next: () => {
      alert('Assessment assigned successfully');
      this.closeAssignModal();
      this.fetchApplicants();
    },
    error: err => alert(err)
  });
}




closeAssignModal(): void {
  this.assignModal?.hide();
}



shortlistApplicant(applicant: any): void {
  if (!confirm('Are you sure you want to shortlist this applicant?')) {
    return;
  }

  this.jobpostService
    .hireApplicant(this.jobPostId, applicant.jobSeekerId)
    .subscribe({
      next: () => {
        applicant.status = 'Shortlisted';
        applicant.offerLetter = true;
        applicant.interviewCompleted = true;
      },
      error: () => {
        alert('Failed to shortlist applicant');
      }
    });
}

rejectApplicant(applicant: any): void {
  if (!confirm('Are you sure you want to reject this applicant?')) {
    return;
  }

  this.jobpostService
    .rejectApplicant(this.jobPostId, applicant.jobSeekerId)
    .subscribe({
      next: () => {
        applicant.status = 'Rejected';
        applicant.rejectionReason = 'Interview Failed';
      },
      error: () => {
        alert('Failed to reject applicant');
      }
    });
}


}
