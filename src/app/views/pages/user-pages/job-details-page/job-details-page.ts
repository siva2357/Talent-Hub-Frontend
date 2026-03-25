import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { Buttons } from "../../../components/buttons/buttons";
import { ApplicationService } from '../../../../core/services/applications-service';

@Component({
  selector: 'app-job-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, Buttons],
  templateUrl: './job-details-page.html',
  styleUrls: ['./job-details-page.css']
})
export class JobDetailsPage implements OnInit{

  jobId: string | null = null;
  job: any = null;
  loading = false;
  error = '';


  constructor(
    private route: ActivatedRoute,
    private jobService: JobpostService,
    private applicationService:ApplicationService
  ) {}

    ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.jobId = params.get('id');

      if (this.jobId) {
        this.getJobDetails(this.jobId);
         this.loadAllJobs(); // for recommendations
      }
    });
  }


getJobDetails(id: string) {
  this.loading = true;

  this.jobService.getJobPostById(id).subscribe({
    next: (res: any) => {
      this.job = res.jobDetails;

      this.getRecommendedJobs();
      this.checkIfApplied(); // ✅ MOVE HERE

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load job details';
      this.loading = false;
    }
  });
}


jobs: any[] = [];
recommendedJobs: any[] = [];


loadAllJobs() {
  this.jobService.getAllJobPosts().subscribe({
    next: (res: any) => {
      this.jobs = res.jobs || [];

      this.getRecommendedJobs(); // ✅ now works
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



isApplied = false;


applyJob() {
  if (!this.job?._id) return;

  this.isApplied = true; // 🔥 instant UI

  this.applicationService.apply(this.job._id).subscribe({
    error: (err) => {
      console.error(err);
      this.isApplied = false; // rollback if failed
    }
  });
}

withdrawJob() {
  if (!this.job?._id) return;

  this.isApplied = false; // 🔥 instant UI

  this.applicationService.withdraw(this.job._id).subscribe({
    error: (err) => {
      console.error(err);
      this.isApplied = true; // rollback
    }
  });
}

markAppliedJobs() {
  this.applicationService.getAppliedJobIds().subscribe({
    next: (res: any) => {
      const appliedIds = res.appliedJobIds;

      this.jobs = this.jobs.map(job => ({
        ...job,
        isApplied: appliedIds.includes(job._id)
      }));
    },
    error: (err) => console.error(err)
  });
}

checkIfApplied() {
  if (!this.job?._id) return;

  this.applicationService.getAppliedJobIds().subscribe({
    next: (res: any) => {
      const appliedIds = res.appliedJobIds;

      this.isApplied = appliedIds.includes(this.job._id);
    },
    error: (err) => console.error(err)
  });
}

}
