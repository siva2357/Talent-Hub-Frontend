export interface SignupRequestDto {
  role: 'jobSeeker' | 'recruiter'; // ✅ add this
  registrationDetails: {
    fullName: string;
    email: string;
    password: string;
  };
}
