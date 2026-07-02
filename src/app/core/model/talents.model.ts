import { ApiListResponse } from "./api-list-response";
import { ApiResponse } from "./api-response";
import { Portfolio } from "./portfolio.model";

export interface FreelancerListResponse extends ApiListResponse<Freelancer> {
  success: boolean;
}


export interface Language {
  _id: string;
  language: string;
  proficiency: string;
}


export interface SocialLink {
  _id?: string;
  platform: string;
  profileUrl: string;
}

export interface ProfileLanguage {
  _id?: string;
  language: string;
  proficiency: string;
}


export interface Freelancer {
  _id: string;
  userId: string;
  profilePhoto: string;
  fullName: string;
  email: string;
  gender: string;
  professionalHeadline: string;
  categories: string[];
  skills: string[];
  country: string;
  city: string;
  timezone: string;
  availability: string[];
  hourlyRate: number;
  socialLinks: SocialLink[];
  languages: Language[];
  createdAt: string;
  updatedAt: string;
  activeContracts: number;
  completedContracts: number;
  status: string;
}


export interface TalentProfilePayload {
  success: boolean;
  profile: TalentProfile;
  portfolio: Portfolio[];
  diaries?: any[];
}

export type TalentProfileResponse =
  ApiResponse<TalentProfilePayload>;


export interface TalentProfile {
  _id: string;
  userId: string;

  profilePhoto: string;
  fullName: string;
  email: string;
  username: string;
  gender: string;

  professionalHeadline: string;
  shortBio: string;

  categories: string[];
  skills: string[];

  country: string;
  city: string;
  timezone: string;

  availability: string[];
  hourlyRate: number;

  socialLinks: SocialLink[];
  languages: ProfileLanguage[];

  activeContracts: number;
  completedContracts: number;

  status: 'active' | 'inactive';

  createdAt: string;
  updatedAt: string;

  __v?: number;
}

