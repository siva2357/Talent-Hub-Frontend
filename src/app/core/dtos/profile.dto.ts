export interface BasicInformation {
  profilePhoto?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  shortBio?: string;
}

export interface LocationInfo {
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
}

export interface SocialLink {
  platform: string;
  profileUrl: string;
}

export interface LanguageInfo {
  language: string;
  proficiency: string;
}

export interface ClientProfileRequest {
  basicInformation: BasicInformation;
  professionalDetails: {
    companyType?: string;
    website?: string;
    industry?: string;
    companyDescription?: string;
  };
  location: LocationInfo;
  socialLinks?: SocialLink[];
  languages?: LanguageInfo[];
}

export interface FreelancerProfileRequest {
  basicInformation: BasicInformation;
  professionalDetails: {
    professionalHeadline?: string;
    skills?: string[];
    technologies?: string[];
    availability?: string;
    preferredJobType?: string;
  };
  location: LocationInfo;
  socialLinks?: SocialLink[];
  languages?: LanguageInfo[];
}
