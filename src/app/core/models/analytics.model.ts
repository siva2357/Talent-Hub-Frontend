/* ===============================
   ADMIN STATS – OVERVIEW
================================ */

export interface AdminOverviewStats {
  recruiterCount: number;
  jobSeekerCount: number;
  totalJobs: number;
  totalAssessments: number;
  totalInterviews: number;
  shortlisted: number;
  rejected: number;
}

/* ===============================
   ADMIN STATS – CATEGORY DATA
================================ */

export interface CategoryCount {
  _id: string;     // jobCategory
  count: number;
}

/* ===============================
   ADMIN STATS – FULL RESPONSE
================================ */

export interface AdminStatsResponse {
  overview: AdminOverviewStats;
  analytics: {
    jobsByCategory: CategoryCount[];
    applicationsByCategory: CategoryCount[];
  };
}






export interface RecruiterStatsResponse {
  jobsPosted: number;
  totalApplicants: number;
  assessmentsTaken: number;
  interviewsConducted: number;
  shortlisted: number;
  rejected: number;
}


export interface JobSeekerStatsResponse {
  portfolioCount: number;
  jobsApplied: number;
  assessmentsTaken: number;
  interviewsAttended: number;
  shortlistedJobs: number;
  rejectedJobs: number;
}
