import { JobSeekerProfile } from "./jobseeker-profile.model";

export interface Talent {
  userId: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  skills: string[];
  bioDescription: string;
  status: 'active' | 'inactive' | 'blocked';
  saved:boolean
}

export interface TalentListResponse {
  total: number;
  data: Talent[];
}

export interface TalentDetails {
  registrationDetails: {
    fullName: string;
    email: string;
    verified: boolean;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TalentProfileDetails extends JobSeekerProfile {}

export interface TalentFullResponse {
  talentDetails: TalentDetails;
  profileDetails: TalentProfileDetails;
  portfolio: any[]; // replace later with Portfolio model
  stats: {
    totalProjects: number;
  };
}
