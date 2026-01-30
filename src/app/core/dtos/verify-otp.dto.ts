export interface VerifyOtpRequestDto {
  email: string;
  providedCode: string;
  role: 'jobSeeker' | 'recruiter';
}
