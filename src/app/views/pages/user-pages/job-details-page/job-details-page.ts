import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { Buttons } from "../../../components/buttons/buttons";
import { ApplicationService } from '../../../../core/services/applications-service';
import { ResumeService } from '../../../../core/services/resume-service';

@Component({
  selector: 'app-job-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, Buttons],
  templateUrl: './job-details-page.html',
  styleUrls: ['./job-details-page.css']
})
export class JobDetailsPage implements OnInit {

  jobId: string | null = null;
  job: any = null;
  loading = false;
  error = '';
  resumeId: string = '';
  isCheckingATS = false;
  jobs: any[] = [];
  recommendedJobs: any[] = [];
  isApplied = false;
  currentMatch: any = null;
  atsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobpostService,
    private applicationService: ApplicationService,
    private resumeService: ResumeService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');

      if (this.jobId) {
        this.getJobDetails(this.jobId);
        this.loadAllJobs();
        this.loadResume();
      }
    });
  }

  checkATS() {
    this.atsError = null;
    this.currentMatch = null;

    if (!this.resumeId) {
      this.atsError = "No resume found. Please upload a resume in your profile.";
      return;
    }

    this.isCheckingATS = true;
    this.runMatch();
  }

  loadResume() {
    this.resumeService.getResumes().subscribe({
      next: (res: any) => {
        const resumes = res.data || [];
        if (resumes.length) {
          this.resumeId = resumes[0]._id;
        }
      },
      error: (err) => console.error(err)
    });
  }

  runMatch() {
    if (!this.resumeId) return;

    this.resumeService.matchJobs(this.resumeId).subscribe({
      next: (res: any) => {
        const matches = res.data || [];
        const match = matches.find(
          (m: any) => m.job_id === this.jobId
        );

        if (match) {
          this.currentMatch = match;
        } else {
          this.atsError = "No compatibility data found for this role.";
        }
        this.isCheckingATS = false;
      },
      error: (err) => {
        console.error(err);
        this.atsError = "Failed to perform ATS verification. Please try again.";
        this.isCheckingATS = false;
      }
    });
  }

  getJobDetails(id: string) {
    this.loading = true;

    this.jobService.getJobPostById(id).subscribe({
      next: (res: any) => {
        this.job = res.jobDetails;
        this.getRecommendedJobs();
        this.checkIfApplied();
        this.markSavedStatus();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load job details';
        this.loading = false;
      }
    });
  }

  loadAllJobs() {
    this.jobService.getAllJobPosts().subscribe({
      next: (res: any) => {
        this.jobs = res.jobs || [];
        this.getRecommendedJobs();
        this.markSavedStatus(); // Sync saved status for recommended jobs
      },
      error: (err) => console.error(err)
    });
  }

  getRecommendedJobs() {
    if (!this.job || !this.jobs.length) return;

    this.recommendedJobs = this.jobs
      .filter((j: any) =>
        j.category?.toLowerCase() === this.job.jobCategory?.toLowerCase() &&
        j._id !== this.job._id
      )
      .slice(0, 4);
  }

  applyJob() {
    if (!this.job?._id) return;
    
    // RESUME GUARD: Raise modal if no resume found
    if (!this.resumeId) {
      const modalElement = document.getElementById('resumeWarningModal');
      if (modalElement) {
        const bootstrap = (window as any).bootstrap;
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
      return;
    }

    this.isApplied = true;
    this.applicationService.apply(this.job._id).subscribe({
      error: (err) => {
        console.error(err);
        this.isApplied = false;
      }
    });
  }

  withdrawJob() {
    if (!this.job?._id) return;
    this.isApplied = false;
    this.applicationService.withdraw(this.job._id).subscribe({
      error: (err) => {
        console.error(err);
        this.isApplied = true;
      }
    });
  }

  checkIfApplied() {
    if (!this.job?._id) return;
    this.applicationService.getAppliedJobIds().subscribe({
      next: (res: any) => {
        const appliedIds = res.appliedJobIds || [];
        this.isApplied = appliedIds.includes(this.job._id);
      },
      error: (err) => console.error(err)
    });
  }

  markSavedStatus() {
    this.jobService.getSavedJobPosts().subscribe({
      next: (res: any) => {
        // Use the authoritative savedJobIds key from the backend
        const savedIds = res.savedJobIds || [];
        
        // Mark main job
        if (this.job?._id) {
          this.job.isSaved = savedIds.includes(this.job._id);
        }

        // Mark recommended jobs
        if (this.recommendedJobs.length) {
          this.recommendedJobs = this.recommendedJobs.map(j => ({
            ...j,
            isSaved: savedIds.includes(j._id)
          }));
        }
      },
      error: (err) => console.error(err)
    });
  }

  toggleSave(job: any) {
    if (!job?._id) return;

    if (job.isSaved) {
      this.jobService.unsaveJobPost(job._id).subscribe({
        next: () => job.isSaved = false,
        error: (err) => console.error(err)
      });
    } else {
      this.jobService.saveJobPost(job._id).subscribe({
        next: () => job.isSaved = true,
        error: (err) => console.error(err)
      });
    }
  }
}
