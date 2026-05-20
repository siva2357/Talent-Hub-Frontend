

export interface Registration {
  id: string;
  email: string;
  fullName: string;
  role: 'Client' | 'Freelancer';
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
  gender: string;
  professionalHeadline?: string;
  shortBio: string;
}

export interface ProfileProfessionalDetails {
  categories?: string[];
  skills?: string[];
  clientType?: 'Individual' | 'Startup' | 'Agency' | 'Business';
  website?: string;
  industry?: string;
}

export interface ProfileLocation {
  country: string;
  city: string;
  timezone: string;
}

export interface ProfileVerification {
  emailAddress: boolean;
  phoneNumber: boolean;
}

export interface ProfileSocialLink {
  platform: string;
  profileUrl: string;
}

export interface ProfileLanguage {
  language: string;
  proficiency: string;
}

export interface FreelancerProfile {
  id?: string;
  userId: string;
  basicInformation: ProfileBasicInformation;
  professionalDetails: {
    categories: string[];
    skills: string[];
  };
  location: ProfileLocation;
  availability: string[];
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
    clientType: 'Individual' | 'Startup' | 'Agency' | 'Business';
    website: string;
    industry: string;
  };
  location: ProfileLocation;
  verification: ProfileVerification;
  socialLinks: ProfileSocialLink[];
  languages: ProfileLanguage[];
  createdAt?: string;
  updatedAt?: string;
}
