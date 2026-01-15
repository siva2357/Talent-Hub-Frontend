import { CompanyDetails } from "./company.modal";

export interface Applicant {
  jobSeekerId: string;
  appliedAt: Date;
  status: 'Pending' | 'Shortlisted' | 'Rejected' | 'Hired';
  offerLetter: boolean;
  interviewScheduled: boolean;
  interviewCompleted: boolean;
}

export interface JobPost {
  _id: string;
  recruiterId: string;

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
  applyByDate: Date;
  postedOn: Date;
  status: 'Pending' | 'Open' | 'Closed';
  totalApplicants: number;
  company: Company;
  applicants?: Applicant[];
  createdAt?: Date;
  updatedAt?: Date;
    saved?: boolean;
  isApplied?: boolean;
  companyDetails: CompanyDetails;
  applicationStatus:string
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
  savedJobId: string;
  jobPostId: string;

  saved: boolean;
  savedAt: Date;

  jobId: string;
  jobTitle: string;
  jobType: string;
  jobCategory: string;

  location: string;
  salary: string;
  vacancy: string;
  experience: string;
  qualification: string;

  applyByDate: Date;
  postedOn: Date;

  company: Company;
}



export interface Company {
  name: string;
  location: string;
  description: string;
  logo: string;
}
