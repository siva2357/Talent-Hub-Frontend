

/* ================= CREATE ================= */

import { Language, SocialProfile } from "../models/recruiter-profile.model";

export interface CreateRecruiterProfileDTO {
  profilePhoto: string;
  logo: string; // maps to companyLogo

  mobile: string;
  gender: 'Male' | 'Female' | 'Other';

  companyName: string;
  companyLocation: string;
  companyDescription: string;

  sector: string;
  designation: string;
  yearsOfExperience: number;

  languages?: Language[];
  skills?: string[];
  socialProfiles?: SocialProfile[];

  bioDescription: string;
}

/* ================= BASIC UPDATE ================= */

export interface UpdateRecruiterBasicDTO {
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  bioDescription: string;
}

/* ================= IMAGE UPDATE ================= */

export interface UpdateRecruiterImageDTO {
  profilePhoto: string;
}

/* ================= PROFESSIONAL UPDATE ================= */

export interface UpdateRecruiterProfessionalDTO {
  companyName: string;
  companyLocation: string;
  companyDescription: string;

  sector: string;
  designation: string;
  yearsOfExperience: number;

  languages: Language[];
  skills: string[];
  socialProfiles: SocialProfile[];
}
