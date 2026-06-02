import { Contract } from "./contract.model";
import { ClientType } from "../enums/client-type.enum";
import { Gender } from "../enums/gender.enum";
import { Availability } from "../enums/availability.enum";
import { Industry } from "../enums/industry.enum";
import { Country } from "../enums/country.enum";
import { Timezone } from "../enums/timezone.enum";
import { SocialPlatform } from "../enums/social-platform.enum";
import { Category } from "../enums/category.enum";
import { Language } from "../enums/language.enum";
import { Proficiency } from "../enums/proficiency.enum";

export interface Registration {
  id: string;
  email: string;
  fullName: string;
  role: 'Client' | 'Freelancer' | 'Admin';
  profileCompleted: boolean;
  emailVerified: boolean;
  mobileVerification: boolean;
  phoneNumber?: string;
  status: 'active' | 'inactive';
}

export interface Client {
  id: string;
  registrationDetails: Registration;
  role: 'Client';
  status: 'active' | 'inactive';
}

export interface Freelancer {
  id: string;
  registrationDetails: Registration;
  role: 'Freelancer';
  status: 'active' | 'inactive';
}

export interface ProfileBasicInformation {
  profilePhoto: string;
  fullName: string;
  email: string;
  username: string;
  gender: Gender | string;
  professionalHeadline?: string;
  shortBio: string;
}

export interface ProfileProfessionalDetails {
  categories?: (Category | string)[];
  skills?: string[];
  clientType?: ClientType;
  website?: string;
  industry?: Industry | string;
}

export interface ProfileLocation {
  country: Country | string;
  city: string;
  timezone: Timezone | string;
}

export interface ProfileVerification {
  emailAddress: boolean;
  phoneNumber: boolean;
}

export interface ProfileSocialLink {
  platform: SocialPlatform | string;
  profileUrl: string;
}

export interface ProfileLanguage {
  language: Language | string;
  proficiency: Proficiency | string;
}

export interface FreelancerProfile {
  id?: string;
  userId: string;
  basicInformation: ProfileBasicInformation;
  professionalDetails: {
    categories: (Category | string)[];
    skills: string[];
  };
  location: ProfileLocation;
  availability: (Availability | string)[];
  verification: ProfileVerification;
  socialLinks: ProfileSocialLink[];
  languages: ProfileLanguage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientProfile {
  id?: string;
  userId: string;
  basicInformation: ProfileBasicInformation;
  professionalDetails: {
    clientType: ClientType;
    website: string;
    industry: Industry | string;
  };
  location: ProfileLocation;
  verification: ProfileVerification;
  socialLinks: ProfileSocialLink[];
  languages: ProfileLanguage[];
  contracts: Contract[];
  createdAt?: string;
  updatedAt?: string;
}
