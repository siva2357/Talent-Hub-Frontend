export interface Language {
  language: string;
  proficiency: string;
}

export interface Experience {
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

export interface CurrentExperience {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface Certification {
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
  platform: SocialPlatform;
  link: string;
}



export interface CreateJobSeekerProfileDTO {
  profilePhoto: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  currentExperience: CurrentExperience;
  experiences?: Experience[];
  certifications?: Certification[];
  languages?: Language[];
  skills?: string[];
  socialProfiles?: SocialProfile[];
  bioDescription: string;
}

/* ================= BASIC PROFILE UPDATE ================= */

export interface UpdateJobSeekerBasicDTO {
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
}

/* ================= PROFILE IMAGE UPDATE ================= */

export interface UpdateJobSeekerImageDTO {
  profilePhoto: string;
}

/* ================= PROFESSIONAL UPDATE ================= */

export interface UpdateJobSeekerProfessionalDTO {
  currentExperience: CurrentExperience;
  experiences: Experience[];
  certifications: Certification[];
  languages: Language[];
  skills: string[];
  socialProfiles: SocialProfile[];
}
