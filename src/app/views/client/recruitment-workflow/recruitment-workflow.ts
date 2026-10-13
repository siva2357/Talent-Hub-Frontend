import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { Button } from '../../../library/ui/components/button/button';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Timeline, TimelineStep } from '../../../library/shared/components/timeline/timeline';
import { Table, TableColumn } from '../../../library/ui/components/table/table';
import { Badge } from '../../../library/ui/components/badge/badge';

@Component({
  selector: 'app-recruitment-workflow',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, InputField, Timeline, Table, Badge],
  templateUrl: './recruitment-workflow.html',
  styleUrl: './recruitment-workflow.css'
})
export class RecruitmentWorkflow implements OnChanges, AfterViewInit {
  @Input() applicationId: string = '';
  applicationDetails: any = null;
  isLoading: boolean = true;

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
  tableData: any[] = [];

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
    if (changes['applicationId'] && changes['applicationId'].currentValue) {
      this.fetchApplicationDetails();
    }
  }

  @ViewChild('idTpl') idTpl!: TemplateRef<any>;
  @ViewChild('stageTpl') stageTpl!: TemplateRef<any>;
  @ViewChild('descTpl') descTpl!: TemplateRef<any>;
  @ViewChild('dateTpl') dateTpl!: TemplateRef<any>;
  @ViewChild('userTpl') userTpl!: TemplateRef<any>;

  tableColumns: TableColumn[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableColumns = [
        { field: 'id', headerName: '#', minWidth: 50, maxWidth: 60, cellTemplate: this.idTpl },
        { field: 'stage', headerName: 'Stage', minWidth: 140, flexGrow: 1, cellTemplate: this.stageTpl },
        { field: 'description', headerName: 'Description', minWidth: 180, flexGrow: 2, cellTemplate: this.descTpl },
        { field: 'completedOn', headerName: 'Completed On', minWidth: 130, flexGrow: 1, cellTemplate: this.dateTpl },
        { field: 'completedBy', headerName: 'Completed By', minWidth: 140, flexGrow: 1, cellTemplate: this.userTpl }
      ];
    });
  }

  fetchApplicationDetails(): void {
    this.isLoading = true;
    this.applicationService.getApplicationById(this.applicationId).subscribe({
      next: (res) => {
        if (res.success) {
          this.applicationDetails = res.application;
          this.updateTimelineAndTable();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching application:', err);
        this.isLoading = false;
      }
    });
  }

  updateTimelineAndTable(): void {
    const currentIndex = this.getTimelineIndex();
    const filteredSteps = this.getFilteredTimelineSteps();
    
    this.mappedTimelineSteps = filteredSteps.map(step => ({
      title: step.title,
      status: step.id < currentIndex ? 'completed' : (step.id === currentIndex ? 'active' : 'upcoming')
    }));

    this.tableData = filteredSteps.map(step => {
      let completedOn = '-';
      let completedBy = '-';

      if (currentIndex > step.id) {
        if (this.applicationDetails?.updatedAt) {
          const d = new Date(this.applicationDetails.updatedAt);
          completedOn = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        completedBy = this.applicationDetails?.clientId?.registrationDetails?.fullName || 'Client User';
      }

      return {
        id: step.id,
        stage: step.title,
        description: step.description,
        completedOn,
        completedBy
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
