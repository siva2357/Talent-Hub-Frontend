
export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId:string;
  role: string;       // The role of the user (recruiter, seeker, admin, etc.)
  token?: string;     // Optional field if the backend returns a token (e.g., JWT)
  verified:boolean;
  success:boolean;
  fullName:string;
  profileComplete:boolean;
}

