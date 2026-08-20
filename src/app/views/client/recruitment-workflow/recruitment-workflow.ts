import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-recruitment-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruitment-workflow.html',
  styleUrl: './recruitment-workflow.css'
})
export class RecruitmentWorkflow implements OnChanges {
  @Input() applicationId: string = '';
  applicationDetails: any = null;
  isLoading: boolean = true;

  timelineSteps = [
    { id: 1, title: 'Application Submitted', key: 'application submitted' },
    { id: 2, title: 'Application Shortlisted', key: 'shortlisted' },
    { id: 3, title: 'Assessment Assigned', key: 'assessment assigned' },
    { id: 4, title: 'Assessment Completed', key: 'assessment completed' },
    { id: 5, title: 'Interview Scheduled', key: 'interview scheduled' },
    { id: 6, title: 'Interview Completed', key: 'interview completed' },
    { id: 7, title: 'Hired', key: 'hired' },
    { id: 8, title: 'Rejected', key: 'rejected' }
  ];

  getTimelineIndex(): number {
    if (!this.applicationDetails?.applicationStatus) return 1;

    if (this.applicationDetails.applicationStatus === 'offer sent' || this.applicationDetails.applicationStatus === 'offer accepted') return 6;
    if (this.applicationDetails.applicationStatus === 'interviewing') return 5;

    const step = this.timelineSteps.find(s => s.key === this.applicationDetails.applicationStatus);
    return step ? step.id : 1;
  }

  getFilteredTimelineSteps() {
    if (this.applicationDetails?.applicationStatus === 'rejected') {
      return this.timelineSteps.filter(s => s.id !== 7);
    } else if (this.applicationDetails?.applicationStatus === 'hired' || this.applicationDetails?.applicationStatus === 'offer sent' || this.applicationDetails?.applicationStatus === 'offer accepted') {
      return this.timelineSteps.filter(s => s.id !== 8);
    }
    return this.timelineSteps;
  }

  showAssessmentForm = false;
  assessmentDetails = {
    title: '',
    description: '',
    date: ''
  };

  showAssessmentEvaluationForm = false;
  assessmentResult = {
    notes: '',
    result: 'passed'
  };

  showInterviewForm = false;
  interviewDetails = {
    date: '',
    time: '',
    link: ''
  };

  showInterviewEvaluationForm = false;
  interviewResult = {
    feedback: '',
    result: 'hired'
  };

  constructor(
    private applicationService: ApplicationService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['applicationId'] && changes['applicationId'].currentValue) {
      this.fetchApplicationDetails();
    }
  }

  fetchApplicationDetails(): void {
    this.isLoading = true;
    this.applicationService.getApplicationById(this.applicationId).subscribe({
      next: (res) => {
        if (res.success) {
          this.applicationDetails = res.application;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching application:', err);
        this.isLoading = false;
      }
    });
  }

  shortlistCandidate(): void {
    this.applicationService.shortlistApplication(this.applicationId).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error shortlisting:', err)
    });
  }

  rejectCandidate(): void {
    this.applicationService.rejectApplication(this.applicationId).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error rejecting:', err)
    });
  }

  assignAssessment(): void {
    if (!this.assessmentDetails.title || !this.assessmentDetails.date) {
      alert('Please fill out title and date');
      return;
    }

    this.applicationService.scheduleAssessment(this.applicationId, this.assessmentDetails).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAssessmentForm = false;
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error assigning assessment:', err)
    });
  }

  evaluateAssessment(): void {
    if (!this.assessmentResult.result) {
      alert('Please select a result');
      return;
    }

    this.applicationService.assessmentResult(this.applicationId, this.assessmentResult).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAssessmentEvaluationForm = false;
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error evaluating assessment:', err)
    });
  }

  scheduleInterview(): void {
    if (!this.interviewDetails.date || !this.interviewDetails.time) {
      alert('Please select date and time');
      return;
    }

    this.applicationService.scheduleInterview(this.applicationId, this.interviewDetails).subscribe({
      next: (res) => {
        if (res.success) {
          this.showInterviewForm = false;
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error scheduling interview:', err)
    });
  }

  markInterviewDone(): void {
    // We send empty feedback just to move state to 'interview completed'
    const payload = {
      feedback: "Interview completed.",
      result: "passed"
    };

    this.applicationService.interviewResult(this.applicationId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error marking interview as done:', err)
    });
  }

  evaluateInterview(): void {
    if (!this.interviewResult.result) {
      alert('Please select a final decision');
      return;
    }

    const payload = {
      feedback: this.interviewResult.feedback,
      result: this.interviewResult.result
    };

    this.applicationService.interviewResult(this.applicationId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          if (this.interviewResult.result === 'hired' || this.interviewResult.result === 'rejected') {
            this.finalizeApplication(this.interviewResult.result);
          }
        }
      },
      error: (err) => console.error('Error evaluating interview:', err)
    });
  }

  finalizeApplication(result: string): void {
    const payload = { result };
    this.applicationService.finalizeApplication(this.applicationId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.showInterviewEvaluationForm = false;
          this.fetchApplicationDetails();
        }
      },
      error: (err) => console.error('Error finalizing application:', err)
    });
  }
}
