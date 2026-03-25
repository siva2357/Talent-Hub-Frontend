import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../../../core/services/applications-service';
@Component({
  selector: 'app-applied-jobposts-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './applied-jobposts-page.html',
  styleUrl: './applied-jobposts-page.css',
})
export class AppliedJobpostsPage implements OnInit {
  selectedJob: any;
  jobs: any[] = [];
  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadAppliedJobs();
  }

  getTrackingSteps(job: any) {
    if (!job) return [];

    const steps: any[] = [];

    steps.push({ name: 'Application Submitted' });

    if (job.applicationStatus !== 'Pending') {
      steps.push({ name: 'InProcess' });
    }

    if (job.assessmentAssigned) {
      steps.push({ name: 'Assessment Assigned' });
    }

    if (job.assessmentSubmitted) {
      steps.push({ name: 'Assessment Submitted' });
    }

    if (job.interviewScheduled) {
      steps.push({ name: 'Interview Scheduled' });
    }

    if (job.interviewCompleted) {
      steps.push({ name: 'Interview Completed' });
    }

    if (job.applicationStatus === 'Shortlisted') {
      steps.push({ name: 'Shortlisted' });
    }

    if (job.applicationStatus === 'Rejected') {
      steps.push({ name: 'Rejected' });
    }

    return steps;
  }

  openTrackingModal(job: any) {
    this.selectedJob = job;

    const modal = new (window as any).bootstrap.Modal(document.getElementById('trackingModal'));

    modal.show();
  }

  openWithdrawModal(job: any) {
    this.selectedJob = job;

    const modal = new (window as any).bootstrap.Modal(document.getElementById('withdrawModal'));

    modal.show();
  }

  confirmWithdraw() {
    if (!this.selectedJob?._id) return;

    this.applicationService.withdraw(this.selectedJob._id).subscribe({
      next: () => {
        console.log('Withdraw success');

        // ✅ remove job from UI
        this.jobs = this.jobs.filter((job) => job._id !== this.selectedJob._id);

        // close modal
        const modal = document.getElementById('withdrawModal');
        (window as any).bootstrap.Modal.getInstance(modal)?.hide();
      },
      error: (err) => {
        console.error('Withdraw failed', err);
      },
    });
  }

  loadAppliedJobs() {
    this.applicationService.getAppliedJobs().subscribe({
      next: (res) => {
        console.log('API Response:', res);

        this.jobs = res.jobs; // ✅ matches backend format
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }

}
