import { UserRole } from '../enums/role.enum';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword?: string;
}
