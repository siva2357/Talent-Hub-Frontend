import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../../core/services/analytics-service';
import { CommonModule } from '@angular/common';
import { RecruiterOverallStats } from '../../../../core/models/analytics.model';

declare var bootstrap: any; // ✅ FIX: Bootstrap modal

@Component({
  selector: 'app-analytics-performance-page',
  templateUrl: './analytics-performance-page.html',
  styleUrl: './analytics-performance-page.css',
  standalone: true,
  imports: [CommonModule]
})
export class AnalyticsPerformancePage implements OnInit {

  jobs: any[] = [];
  applicants: any[] = [];

  selectedJobId: string | null = null;
  selectedApplicant: any = null;

  // INLINE / MODAL REPORTS
  assessmentReport: any = null;
  interviewReport: any = null;

  // MODAL REPORT (TRANSFORMED)
  report: any = null;

  loading = false;
  errorMessage = '';
  reportLoading = false;
overallStats!: RecruiterOverallStats;
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadRecruiterJobs();
    this.loadOverallAnalytics()
  }


  loadOverallAnalytics() {
  this.analyticsService.getOverallAnalytics()
    .subscribe(res => {
      this.overallStats = res.stats;
    });
}

  /* =========================
     LOAD JOBS
  ========================= */
  loadRecruiterJobs(): void {
    this.loading = true;

    this.analyticsService.getRecruiterAnalyticsJobs().subscribe({
      next: (res) => {
        this.jobs = res.jobs || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err;
        this.loading = false;
      }
    });
  }

  /* =========================
     LOAD APPLICANTS
  ========================= */
  loadApplicants(jobPostId: string): void {
    this.selectedJobId = jobPostId;
    this.selectedApplicant = null;
    this.assessmentReport = null;
    this.interviewReport = null;

    this.analyticsService.getJobAnalyticsApplicants(jobPostId).subscribe({
      next: (res) => {
        this.applicants = res.applicants || [];
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  /* ===============================
     OPEN ASSESSMENT MODAL
  =============================== */
  openAssessmentReport(applicant: any): void {
    if (!this.selectedJobId) return;

    this.selectedApplicant = applicant;
    this.report = null;
    this.reportLoading = true;

    const modalEl = document.getElementById('assessmentReportModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    this.analyticsService
      .getApplicantAssessmentReport(this.selectedJobId, applicant.jobSeekerId)
      .subscribe({
        next: (res) => {
          this.report = this.transformAssessment(res.assessment);
          this.reportLoading = false;
        },
        error: () => {
          this.reportLoading = false;
        }
      });
  }

  /* ===============================
     CLOSE ASSESSMENT MODAL
  =============================== */
  closeReportModal(): void {
    const modalEl = document.getElementById('assessmentReportModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();

    this.report = null;
    this.selectedApplicant = null;
  }

  /* ===============================
     OPEN INTERVIEW MODAL
  =============================== */
  openInterviewReport(applicant: any): void {
    if (!this.selectedJobId) return;

    this.analyticsService
      .getApplicantInterviewReport(this.selectedJobId, applicant.jobSeekerId)
      .subscribe(res => {
        this.interviewReport = res.interview;
      });
  }

  /* ===============================
     TRANSFORM RAW ASSESSMENT
  =============================== */
  transformAssessment(raw: any) {
    if (!raw) return null;

    const totalMcq = raw.mcqReport.length;
    const correctMcq = raw.mcqReport.filter((q: any) => q.isCorrect).length;

    const totalCodingCases = raw.codingReport.length;
    const passedCases = raw.codingReport.filter((t: any) => t.passed).length;

    return {
      job: {
        jobTitle: raw.jobTitle,
        jobCategory: raw.jobCategory
      },

      jobSeeker: this.selectedApplicant,

      summary: {
        overallPercentage: Math.round(
          ((correctMcq + passedCases) /
            (totalMcq + totalCodingCases)) * 100
        ),
        eligibleForInterview: correctMcq >= Math.ceil(totalMcq * 0.6)
      },

      sections: {
        mcq: {
          totalQuestions: totalMcq,
          correct: correctMcq,
          percentage: Math.round((correctMcq / totalMcq) * 100),
          passed: correctMcq >= Math.ceil(totalMcq * 0.6),
          questions: raw.mcqReport
        },

        coding: {
          totalTestCases: totalCodingCases,
          score: passedCases,
          percentage: Math.round((passedCases / totalCodingCases) * 100),
          passed: passedCases >= Math.ceil(totalCodingCases * 0.6),
          questions: this.groupCoding(raw)
        }
      }
    };
  }

  /* ===============================
     GROUP CODING TEST CASES
  =============================== */
  groupCoding(raw: any) {
    return raw.codingSubmission.map((sub: any) => {
      const cases = raw.codingReport.filter(
        (c: any) => c.questionId === sub.questionId
      );

      return {
        questionId: sub.questionId,
        passedTestCases: cases.filter((c: any) => c.passed).length,
        totalTestCases: cases.length,
        testCases: cases
      };
    });
  }

  /* =========================
     HIRE
  ========================= */
  hireApplicant(applicant: any): void {
    if (!this.selectedJobId) return;

    if (!confirm('Are you sure you want to HIRE this candidate?')) return;

    this.analyticsService
      .hireApplicant(this.selectedJobId, applicant.jobSeekerId)
      .subscribe(() => {
        this.loadApplicants(this.selectedJobId!);
      });
  }

  /* =========================
     REJECT
  ========================= */
  rejectApplicant(applicant: any): void {
    if (!this.selectedJobId) return;

    if (!confirm('Are you sure you want to REJECT this candidate?')) return;

    this.analyticsService
      .rejectApplicant(this.selectedJobId, applicant.jobSeekerId)
      .subscribe(() => {
        this.loadApplicants(this.selectedJobId!);
      });
  }
}
