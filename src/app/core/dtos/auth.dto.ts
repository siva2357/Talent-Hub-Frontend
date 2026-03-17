export interface RegistrationPayload {
  registrationDetails: {
    fullName: string;
    email: string;
    password: string;
  };
  role: 'recruiter' | 'jobSeeker';
}

export interface RegistrationResponse {
  success: boolean;
  message?: string;
  result?: {
    userId: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface LoginRequestDto {
  email: string;
  password: string;
}



