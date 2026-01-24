import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobpostService } from '../../../../core/services/jobpost-service';
import { UserService } from '../../../../core/services/user-service';

@Component({
  selector: 'app-hired-talents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hired-talents.html',
  styleUrl: './hired-talents.css',
})
export class HiredTalents implements OnInit {

  allJobPosts: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private jobPostService: JobpostService,
    private talentService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMyJobPosts();
  }

  /* ===============================
     LOAD RECRUITER JOB POSTS
  ================================ */
  loadMyJobPosts(): void {
    this.loading = true;

    this.jobPostService.getMyJobPosts().subscribe({
      next: (res: any) => {
        const jobs = res.jobs || res;

        this.allJobPosts = jobs.map((job: any) => ({
          ...job,
          shortlistedCandidates: [],
          loadingShortlisted: true
        }));

        this.loadShortlistedForEachJob();
        this.loading = false;
      },
      error: (err:any) => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
  }

  /* ===============================
     LOAD SHORTLISTED PER JOB
  ================================ */
  loadShortlistedForEachJob(): void {
    this.allJobPosts.forEach(job => {
      this.talentService
        .getShortlistedTalents(job._id)
        .subscribe({
          next: (res:any) => {
            job.shortlistedCandidates = res.candidates || [];
            job.loadingShortlisted = false;
          },
          error: () => {
            job.loadingShortlisted = false;
          }
        });
    });
  }


}
