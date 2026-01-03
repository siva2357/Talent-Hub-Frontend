import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { JobpostService } from '../../../../core/services/jobpost-service';

@Component({
  selector: 'app-applicants-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicants-list-page.html',
  styleUrl: './applicants-list-page.css',
})
export class ApplicantsListPage implements OnInit {

  jobPostId!: string;
  applicants: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private jobpostService: JobpostService,
    private router:Router
  ) {}

  /* =========================
     Lifecycle
  ========================== */
ngOnInit(): void {
  this.jobPostId = this.route.snapshot.paramMap.get('jobId')!;
  this.fetchApplicants();
}


  /* =========================
     Fetch Applicants
  ========================== */
  fetchApplicants(): void {
    this.jobpostService.getJobApplicants(this.jobPostId).subscribe({
      next: (res) => {
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

goBack(): void {
  this.router.navigate([
    'recruiter/job-applications'
  ]);
}

}
