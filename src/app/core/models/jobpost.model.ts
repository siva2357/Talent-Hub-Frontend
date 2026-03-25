import { ApplicantStatus } from "../enums/applicant-status.enum";



export interface JobCompany {
  name: string;
  location: string;
  description: string;
  logo?: string | null;
}

export interface JobPost {
  _id: string;
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
  applyByDate: string;
  postedOn: string;
  status: 'Open' | 'Closed' | 'Rejected';
  company: JobCompany;
}

export interface RecruiterJobsResponse {
  totalJobs: number;
  jobs: JobPost[];
}

export interface JobDetailResponse {
  jobPost: JobPost;
}


export interface JobApplicant {
  jobSeekerId: string;

  fullName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;

  appliedAt: string;
  status: ApplicantStatus;

  jobMatchScore: number | null;
  matchLevel: 'high' | 'medium' | 'low' | 'no_resume';
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercent: number;
  experienceMatch: 'full' | 'partial' | 'none';
  educationMatch: boolean;
  summary: string;

  assessmentAssigned: boolean;
  assessmentSubmitted: boolean;
  assessmentId: string | null;
  assessmentStatus: 'Assigned' | 'Completed' | null;

  interviewScheduled: boolean;
  interviewCompleted: boolean;
  interviewStatus: 'Scheduled' | 'Completed' | 'Not Completed' | null;

  offerLetter: boolean;
}

export interface JobApplicantsResponse {
  jobPostId: string;
  jobTitle: string;
  totalApplicants: number;
  applicants: JobApplicant[];
}



export interface SavedJobPost {
  id: string;

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

  saved: true;

  companyDetails: {
    name?: string;
    location?: string;
    description?: string;
    logo?: string | null;
  };
}

export interface SavedJobsResponse {
  totalSavedJobs: number;
  savedJobs: SavedJobPost[];
}

export interface AppliedJob {
  _id: string;

  jobId: string;
  jobTitle: string;
  jobType: string;
  jobCategory: string;
  jobDescription: string;

  location: string;
  experience: string;
  qualification: string;
  salary: string;
  vacancy: string;

  postedOn: string;
  applyByDate: string;

  applicationStatus: ApplicantStatus;
  appliedOn: string;

  assessmentAssigned: boolean;
  assessmentSubmitted: boolean;
  interviewScheduled: boolean;
  interviewCompleted: boolean;
  offerLetter: boolean;

  company: JobCompany;
}

export interface AppliedJobsResponse {
  totalAppliedJobs: number;
  appliedJobs: AppliedJob[];
}



export interface JobSeekerJobPost extends JobPost {
  isApplied: boolean;
  saved: boolean;
}
