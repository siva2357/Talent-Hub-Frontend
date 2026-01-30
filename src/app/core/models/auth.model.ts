export interface LoginResponse {
  success: true;
  message: string;
  token: string;
  role: 'admin' | 'recruiter' | 'jobSeeker';
  userId: string;
  fullName: string;
  email: string;
  profileImage: string | null;
  profileCompleted: boolean;
}


export interface LogoutResponse {
  success: true;
  message: string;
}
