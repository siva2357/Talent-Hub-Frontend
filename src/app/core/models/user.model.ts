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

export interface FreelancerCardData {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  completedProjects?: number;
  status: string;
  joinedDate?: string;
  title?: string;
  profileImage?: string;
  [key: string]: any;
}

export interface ClientCardData {
  id: string;
  name: string;
  clientName?: string;
  email: string;
  phoneNumber?: string;
  projectsCount?: number;
  status: string;
  joinedDate?: string;
  industry?: string;
  profileImage?: string;
  [key: string]: any;
}
