export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'Client' | 'Freelancer' | 'Admin';
  profileCompleted: boolean;
  mobileVerification: boolean;
  status: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  role?: string;
  profileCompleted?: boolean;
  mobileVerification?: boolean;
  message?: string;
  email?: string; // used for responses like OTP sent
}
