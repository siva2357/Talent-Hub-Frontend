
/* =========================
   RECRUITER PROFILE
========================= */
export interface RecruiterProfile {
  _id?: string;

  userId: string; // Recruiter _id

  /* PROFILE PHOTO */
  profilePhoto?: string;

  /* BASIC DETAILS */
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';

  /* COMPANY DETAILS */
  companyId: string;
  companyLocation?: string;
  companyDescription?: string;
  companyIdProofs: CompanyIdProof[];

  /* PROFESSIONAL DETAILS */
  sector: string;
  designation: string;
  yearsOfExperience: number;

  /* LANGUAGES */
  languages: Language[];

  /* SKILLS */
  skills: string[];

  /* JOB DESCRIPTION */
  jobDescription: string;

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
