export interface Assessment {
  _id: string;
  jobPostId: string;
  jobSeekerId: string;
  assessmentLink: string;
  status: 'Assigned' | 'Completed';
  assignedAt?: string;
  completedAt?: string;
}

export interface MyAssessment {
  _id: string;
  assessmentLink: string;
  status: 'Assigned' | 'Completed';
  createdAt: string;

  jobPostId: {
    jobId: string;
    jobTitle: string;
    jobDescription: string;
    jobCategory: string;
    jobType: string;
    location: string;
    company: {
      name: string;
      logo?: string;
    };
  };
}
