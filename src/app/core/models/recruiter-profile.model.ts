export interface RecruiterProfile {
  _id?: string;
  userId: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string
  gender: 'Male' | 'Female' | 'Other';
  companyId: string;
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
  _id:string
  language: string;
  level: string;
}

export interface SocialProfile {
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
