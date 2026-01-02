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
