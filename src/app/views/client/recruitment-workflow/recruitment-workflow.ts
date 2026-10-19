import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Timeline, TimelineStep } from '../../../library/shared/components/timeline/timeline';
import { Badge } from '../../../library/ui/components/badge/badge';

@Component({
  selector: 'app-recruitment-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputField,],
  templateUrl: './recruitment-workflow.html',
  styleUrl: './recruitment-workflow.css'
})
export class RecruitmentWorkflow implements OnChanges {
  @Input() applicationId: string = '';
  @Input() applicantData: any = null;
  applicationDetails: any = null;
  isLoading: boolean = true;

  get freelancer(): any {
    if (this.applicationDetails?.freelancer) return this.applicationDetails.freelancer;
    if (this.applicantData?.freelancer) return this.applicantData.freelancer;
    if (this.applicationDetails?.freelancerId?.registrationDetails) {
      const reg = this.applicationDetails.freelancerId.registrationDetails;
      return {
        fullName: reg.fullName,
        email: this.applicationDetails.freelancerId.email || reg.email,
        phone: this.applicationDetails.freelancerId.phone || reg.phone,
        profilePhoto: reg.profilePhoto,
        professionalHeadline: reg.title || 'Professional Freelancer',
        gender: this.applicationDetails.freelancerId.gender || reg.gender,
        city: this.applicationDetails.freelancerId.city || reg.city,
        country: this.applicationDetails.freelancerId.country || reg.country,
        availability: this.applicationDetails.freelancerId.availability || reg.availability,
        skills: reg.skills || []
      };
    }
    return this.applicationDetails?.freelancerId || null;
  }

  getFormattedAvailability(availability?: string): string {
    const val: string = availability || this.freelancer?.availability || '';
    if (!val || val === 'N/A') return 'Full-Time';
    if (val === 'full_time') return 'Full-Time';
    if (val === 'part_time') return 'Part-Time';
    return val.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  }

  get contractDetails(): any {
    const rawContract = (this.applicationDetails?.contractId && typeof this.applicationDetails.contractId === 'object')
      ? this.applicationDetails.contractId
      : {};
    return {
      title: rawContract.contractTitle || this.applicationDetails?.contractTitle || this.applicantData?.contractTitle || 'Contract Role',
      budget: rawContract.estimatedBudget || this.applicationDetails?.estimatedBudget,
      type: rawContract.contractType || this.applicationDetails?.contractType || 'Fixed-Price',
      subject: rawContract.contractSubject || this.applicationDetails?.contractSubject || '',
      startDate: rawContract.contractStartDate || this.applicationDetails?.contractStartDate || null,
      endDate: rawContract.contractEndDate || this.applicationDetails?.contractEndDate || null,
      description: rawContract.contractDescription || this.applicationDetails?.contractDescription || '',
      status: rawContract.status || this.applicationDetails?.contractStatus || 'Active'
    };
  }

  timelineSteps = [
    { id: 1, title: 'Application Submitted', key: 'application submitted', description: 'Candidate has submitted their application.' },
    { id: 2, title: 'Application Shortlisted', key: 'shortlisted', description: 'Candidate was shortlisted for the next round.' },
    { id: 3, title: 'Assessment Assigned', key: 'assessment assigned', description: 'An assessment has been assigned to the candidate.' },
    { id: 4, title: 'Assessment Completed', key: 'assessment completed', description: 'Candidate has successfully completed the assessment.' },
    { id: 5, title: 'Interview Scheduled', key: 'interview scheduled', description: 'An interview has been scheduled with the candidate.' },
    { id: 6, title: 'Interview Completed', key: 'interview completed', description: 'The interview process has been completed.' },
    { id: 7, title: 'Hired', key: 'hired', description: 'The candidate has been hired for the position.' },
    { id: 8, title: 'Rejected', key: 'rejected', description: 'The candidate was not selected for this position.' }
  ];

  mappedTimelineSteps: TimelineStep[] = [];

  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

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

  getStatusBadgeClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'hired':
        return 'bg-success bg-opacity-10 text-success border-success border-opacity-25';
      case 'rejected':
        return 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25';
      case 'shortlisted':
      case 'assessment assigned':
      case 'interview scheduled':
        return 'bg-info bg-opacity-10 text-info border-info border-opacity-25';
      case 'assessment completed':
      case 'interview completed':
        return 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-25';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25';
    }
  }

  getAssessmentBadgeClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'passed':
        return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'failed':
        return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      default:
        return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
    }
  }

  getInterviewBadgeClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'cancelled':
        return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      case 'scheduled':
        return 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25';
      default:
        return 'bg-info bg-opacity-10 text-info border border-info border-opacity-25';
    }
  }

  getStepDescription(index: number): string {
    const filtered = this.getFilteredTimelineSteps();
    const step = filtered[index];
    return step ? step.description : '';
  }

  getStepDate(index: number): string | null {
    const currentIndex = this.getTimelineIndex();
    const filtered = this.getFilteredTimelineSteps();
    const step = filtered[index];
    if (!step) return null;

    const appliedDate = this.applicationDetails?.appliedAt || this.applicationDetails?.createdAt;
    if (step.id === 1 && appliedDate) {
      return 'Submitted ' + new Date(appliedDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (step.id === 3 && this.applicationDetails?.assessment?.date) {
      return 'Assigned: ' + new Date(this.applicationDetails.assessment.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (step.id === 4 && this.applicationDetails?.assessment?.date) {
      const status = this.applicationDetails?.assessment?.status ? ` (${this.applicationDetails.assessment.status})` : '';
      return 'Completed: ' + new Date(this.applicationDetails.assessment.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + status;
    }
    if (step.id === 5 && this.applicationDetails?.interview?.date) {
      return 'Scheduled: ' + new Date(this.applicationDetails.interview.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + (this.applicationDetails.interview.time ? ' at ' + this.applicationDetails.interview.time : '');
    }
    if (step.id === 6 && this.applicationDetails?.interview?.date) {
      return 'Completed: ' + new Date(this.applicationDetails.interview.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + (this.applicationDetails.interview.time ? ' at ' + this.applicationDetails.interview.time : '');
    }
    if (step.id === 7 && this.applicationDetails?.applicationStatus === 'hired') {
      const dt = this.applicationDetails?.updatedAt || this.applicationDetails?.interview?.date || appliedDate;
      return dt ? 'Hired on ' + new Date(dt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Hired';
    }
    if (step.id < currentIndex && this.applicationDetails?.updatedAt) {
      return 'Completed ' + new Date(this.applicationDetails.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return null;
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

  assessmentResultOptions = [
    { label: 'Pass (Proceed to Interview)', value: 'passed' },
    { label: 'Fail (Reject Candidate)', value: 'failed' }
  ];

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

  interviewResultOptions = [
    { label: 'Hire Candidate', value: 'hired' },
    { label: 'Reject Candidate', value: 'rejected' }
  ];

  constructor(
    private applicationService: ApplicationService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['applicantData'] && changes['applicantData'].currentValue) {
      this.applicationDetails = { ...(this.applicationDetails || {}), ...this.applicantData };
      this.updateTimeline();
    }
    if (changes['applicationId'] && changes['applicationId'].currentValue) {
      this.fetchApplicationDetails();
    }
  }

  fetchApplicationDetails(): void {
    this.isLoading = true;
    this.applicationService.getApplicationById(this.applicationId).subscribe({
      next: (res) => {
        if (res.success) {
          const merged = { ...(this.applicantData || {}), ...res.application };
          if (this.applicantData?.freelancer) {
            merged.freelancer = { ...(this.applicantData.freelancer || {}), ...(res.application?.freelancer || {}) };
          }
          if (this.applicantData?.assessment && (!res.application?.assessment || !res.application.assessment.title)) {
            merged.assessment = this.applicantData.assessment;
          }
          if (this.applicantData?.interview && (!res.application?.interview || !res.application.interview.title)) {
            merged.interview = this.applicantData.interview;
          }
          if (this.applicantData?.appliedAt && !res.application?.appliedAt) {
            merged.appliedAt = this.applicantData.appliedAt;
          }
          if (this.applicantData?.offerStatus && !res.application?.offerStatus) {
            merged.offerStatus = this.applicantData.offerStatus;
          }
          this.applicationDetails = merged;
          this.updateTimeline();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching application:', err);
        if (this.applicantData) {
          this.applicationDetails = { ...this.applicantData };
          this.updateTimeline();
        }
        this.isLoading = false;
      }
    });
  }

  updateTimeline(): void {
    const currentIndex = this.getTimelineIndex();
    const filteredSteps = this.getFilteredTimelineSteps();
    const isHired = this.applicationDetails?.applicationStatus === 'hired';
    const isRejected = this.applicationDetails?.applicationStatus === 'rejected';

    this.mappedTimelineSteps = filteredSteps.map((step, idx) => {
      let status: 'completed' | 'active' | 'upcoming';
      if (isHired) {
        status = step.id <= 7 ? 'completed' : 'upcoming';
      } else if (isRejected) {
        status = (step.id === 8 || step.key === 'rejected') ? 'active' : (step.id < currentIndex ? 'completed' : 'upcoming');
      } else if (step.id < currentIndex) {
        status = 'completed';
      } else if (step.id === currentIndex) {
        status = 'active';
      } else {
        status = 'upcoming';
      }

      let icon = '';
      let customClass = '';
      if (step.key === 'hired' || step.id === 7) {
        icon = 'bi bi-trophy-fill';
        if (isHired) {
          customClass = 'hired-step';
        }
      } else if (step.key === 'rejected' || step.id === 8) {
        icon = 'bi bi-trophy-fill';
        if (isRejected) {
          customClass = 'rejected-step';
        }
      }

      return {
        id: step.id,
        key: step.key,
        title: step.title,
        status: status,
        icon: icon,
        customClass: customClass,
        description: step.description,
        date: this.getStepDate(idx)
      };
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

  hireCandidate(): void {
    const payload = {
      feedback: "Hired directly.",
      result: "hired"
    };

    this.applicationService.interviewResult(this.applicationId, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.finalizeApplication("hired");
        }
      },
      error: (err) => console.error('Error hiring:', err)
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
