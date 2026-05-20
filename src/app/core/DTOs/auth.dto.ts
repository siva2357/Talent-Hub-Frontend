export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
  role: 'Client' | 'Freelancer';
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  role: 'Client' | 'Freelancer';
  profileCompleted: boolean;
  mobileVerification: boolean;
}
