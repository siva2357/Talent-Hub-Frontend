/* ================================
   REGISTRATION DETAILS (RESPONSE)
================================ */
export interface RegistrationDetails {
  fullName: string;
  email: string;
  password:string;
  verified: boolean;
  profileCompleted: boolean;

  adminApproved: boolean;
  adminApprovedAt?: string;

  verificationCode?: string;
  verificationCodeValidation?: number;

  forgotPasswordCode?: string;
  forgotPasswordCodeValidation?: number;
  forgotPasswordVerified?: boolean;
}

/* ================================
   RECRUITER (RESPONSE MODEL)
================================ */
export interface Recruiter {
  _id?: string;
  registrationDetails: RegistrationDetails;
  role: 'recruiter';
  lastLoginAt?: string | null;
  lastLogoutAt?: string | null;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

/* ================================
   JOB SEEKER (RESPONSE MODEL)
================================ */
export interface JobSeeker {
  _id?: string;
  registrationDetails: RegistrationDetails;
  role: 'jobSeeker';
  lastLoginAt?: string | null;
  lastLogoutAt?: string | null;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}


export interface AdminProfileHeader {
  userName:string;
  fullName: string;
  profilePicture: { fileName: string; url: string };
}


export interface RecruiterProfileHeader {
  userName:string;
  fullName: string;
profilePicture: { fileName: string;url: string;};
}


export interface JobSeekerProfileHeader {
  userName:string;
  fullName: string;
  profilePicture: { fileName: string; url: string };
}











