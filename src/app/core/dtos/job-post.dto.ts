export interface CreateJobPostDTO {
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
  applyByDate: string; // ISO
}


export interface UpdateJobPostDTO {
  jobTitle?: string;
  jobType?: string;
  jobCategory?: string;
  experience?: string;
  qualification?: string;
  jobDescription?: string;
  salary?: string;
  vacancy?: string;
  location?: string;
  applyByDate?: string;
}

