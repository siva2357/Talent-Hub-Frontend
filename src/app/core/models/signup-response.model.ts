export interface SignupResponse {
  success: true;
  message: string;
  result: {
    userId: string;
    fullName: string;
    email: string;
    role: 'jobSeeker' | 'recruiter';
  };
}
