/* ================================
   SIGNUP PAYLOAD (REQUEST)
================================ */
export interface RecruiterSignupPayload {
  registrationDetails: {
    fullName: string;
    email: string;
    password: string;
  };
  role: 'recruiter';
}

export interface JobSeekerSignupPayload {
  registrationDetails: {
    fullName: string;
    email: string;
    password: string;
  };
  role: 'jobSeeker';
}
