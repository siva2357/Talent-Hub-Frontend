/* ================= SUB MODELS ================= */

export interface Language {
  _id:string;
  language: string;
  proficiency: string;
}

export type SocialPlatform =
  | 'LinkedIn'
  | 'GitHub'
  | 'Portfolio'
  | 'Twitter / X'
  | 'Instagram'
  | 'Facebook'
  | 'Dribbble'
  | 'Behance';

export interface SocialProfile {
   _id:string;
  platform: SocialPlatform;
  link: string;
}

/* ================= MAIN PROFILE ================= */

export interface RecruiterProfile {
   _id:string;
  userId: string;

  profilePhoto: string;
  companyLogo: string;

  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';

  companyName: string;
  companyLocation: string;
  companyDescription: string;

  sector: string;
  designation: string;
  yearsOfExperience: number;

  languages: Language[];
  skills: string[];
  socialProfiles: SocialProfile[];

  bioDescription: string;

  createdAt: string;
  updatedAt: string;
}


export interface RecruiterJobSummary {
   _id:string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  jobCategory: string;
  totalApplicants: number;
  status: string;
  postedOn: string;
}


export interface RecruiterProfileWithJobsResponse {
  profile: RecruiterProfile;
  jobs: RecruiterJobSummary[];
}

/* ================= BASIC PROFILE ================= */

export interface RecruiterBasicProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  bioDescription: string;
}

/* ================= IMAGE ================= */

export interface RecruiterImage {
  profilePhoto: string;
}


export interface RecruiterProfessionalProfile {
  companyName: string;
  companyLocation: string;
  companyDescription: string;
  sector: string;
  designation: string;
  yearsOfExperience: number;
  languages: Language[];
  skills: string[];
  socialProfiles:SocialProfile[];
}

export interface UpdateRecruiterResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
