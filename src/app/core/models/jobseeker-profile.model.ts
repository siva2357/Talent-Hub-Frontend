

/* =========================
   JOB SEEKER PROFILE
========================= */
export interface JobSeekerProfile {
  _id?: string;
  userId: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  experiences: Experience[];
  certifications: Certification[];
  languages: Language[];
  skills: string[];
  socialProfiles: SocialProfile[];
  bioDescription: string;
  createdAt: string;
  updatedAt: string;
}
export interface Language {
  _id:string;
  language: string;
  level: string;
}

export interface CompanyIdProof {
  documentName: string;
  documentUrl: string;
}

export interface Experience {
  _id?:string;
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Certification {
  _id?:string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  certificateUrl?: string;
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
