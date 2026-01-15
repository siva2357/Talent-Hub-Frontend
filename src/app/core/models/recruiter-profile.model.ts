export interface RecruiterProfile {
  _id?: string;
  userId: string;
  profilePhoto: string;
  companyLogo: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: string;
  companyName: string;
  companyLocation: string;
  companyDescription: string;
  sector: string;
  designation: string;
  yearsOfExperience: number;
  languages: Language[];
  skills: string[];
  bioDescription: string;
  socialProfiles: SocialProfile[];
  createdAt?: string;
  updatedAt?: string;
}


export interface Language {
  _id?: string;
  language: string;
  level: string;
}


export interface SocialProfile {
  _id?: string;
  platform:
    | 'LinkedIn'
    | 'GitHub'
    | 'Portfolio'
    | 'Twitter / X'
    | 'Instagram'
    | 'Facebook'
    | 'Dribbble'
    | 'Behance';
  link: string;
}

export interface RecruiterJobPost {
  _id: string;
  jobId: string;
  jobTitle: string;
  jobCategory: string;
  jobDescription: string;
  status: 'Open' | 'Closed' | 'Rejected';
  totalApplicants: number;
  postedOn: string;
}


export interface RecruiterProfileResponse {
  profile: RecruiterProfile;
  jobs: RecruiterJobPost[];
}
