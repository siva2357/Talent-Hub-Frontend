/* ================= NESTED MODELS ================= */

import { ProjectDetails } from "./portfolio.model";

export interface Language {
  _id?:string;
  language: string;
  proficiency: string;
}

export interface Experience {
  _id?:string;
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

export interface CurrentExperience {
  _id?:string;
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface Certification {
  _id?:string;
  name: string;
  issuedBy: string;
  issuedDate: string; // ISO date
  certificateUrl?: string;
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
  _id?:string;
  platform: SocialPlatform;
  link: string;
}

/* ================= MAIN PROFILE ================= */

export interface JobSeekerProfile {
  _id?:string;
  userId: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';

  currentExperience: CurrentExperience;

  experiences: Experience[];
  certifications: Certification[];
  languages: Language[];
  skills: string[];
  socialProfiles: SocialProfile[];

  bioDescription: string;

  createdAt: string;
  updatedAt: string;
}


export interface JobSeekerProfileResponse {
  profile: JobSeekerProfile;
  portfolios: JobSeekerPortfolio[];
}

export interface JobSeekerPortfolio {
  projectDetails: ProjectDetails; // replace with real portfolio model later
  createdAt: string;
  updatedAt: string;
}



export interface JobSeekerBasicProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  bioDescription: string;
}


export interface JobSeekerImage {
  profilePhoto: string;
}
