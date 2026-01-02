export interface Applicant {
  jobSeekerId: string;
  appliedAt: Date;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Hired';
  offerLetter: boolean;
  interviewScheduled: boolean;
  interviewCompleted: boolean;
}

export interface JobPost {
  _id?: string;
  recruiterId?: string;
  companyId: string;
  jobId: string;
  jobTitle: string;
  jobType: string;
  jobCategory: string;
  experience: string;
  qualification: string;
  jobDescription: string;
  salary: string;
  vacancy: string;
  location: string;
  postedOn: Date;
  applyByDate: Date;
  status?: 'Pending' | 'Open' | 'Closed' | 'Rejected';
  verifiedByAdmin?: boolean;
  adminReviewedOn?: Date;
  applicants?: Applicant[];
  totalApplicants?: number;
  savedBy?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}


export interface AppliedJobsResponse {
  totalAppliedJobs: number;
  appliedJobs: JobPost[];
}

export interface SavedJobs {
  totalJobPosts: number;
  savedJobPosts: SavedJobPost[];
}


export interface SavedJobPost {
   jobPostId: string;
  saved: boolean;
  savedAt: string;
  savedJobId: string;
  jobId: string;
  jobTitle: string;
  jobType: string;
  jobCategory: string;
  location: string;
  salary: string;
  vacancy: string;
  experience: string;
  qualification: string;
  applyByDate: string;
  postedOn: string;
  companyDetails: {
    companyLogo: {
      fileName: string;
      url: string;
    };
    companyId: string;
    companyName: string;
    companyAddress: string;
  };
}
