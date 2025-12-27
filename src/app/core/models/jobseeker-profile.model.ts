

/* =========================
   JOB SEEKER PROFILE
========================= */
export interface JobSeekerProfile {
  _id?: string;

  userId: string; // JobSeeker _id

  /* PROFILE PHOTO */
  profilePhoto?: string;

  /* BASIC DETAILS */
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';

  /* EXPERIENCE */
  experiences: Experience[];

  /* CERTIFICATIONS */
  certifications: Certification[];

  /* LANGUAGES */
  languages: Language[];

  /* SKILLS */
  skills: string[];

  /* SOCIAL PROFILES */
  socialProfiles: SocialProfile[];

  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   LANGUAGE
========================= */
export interface Language {
  language: string;
  level: string;
}

/* =========================
   COMPANY ID PROOF
========================= */
export interface CompanyIdProof {
  documentName: string;
  documentUrl: string;
}


/* =========================
   EXPERIENCE
========================= */
export interface Experience {
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

/* =========================
   CERTIFICATION
========================= */
export interface Certification {
  name: string;
  issuedBy: string;
  issuedDate: string;
  certificateUrl?: string;
}

/* =========================
   SOCIAL PROFILE
========================= */
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
