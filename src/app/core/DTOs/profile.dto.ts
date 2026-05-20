export interface BasicInformationDto {
  fullName?: string;
  email?: string;
  username?: string;
  gender?: string;
  professionalHeadline?: string;
  shortBio?: string;
  profilePhoto?: string;
}

export interface ProfessionalDetailsDto {
  categories?: string[];
  skills?: string[];
  clientType?: 'Individual' | 'Startup' | 'Agency' | 'Business';
  website?: string;
  industry?: string;
}

export interface LocationDto {
  country?: string;
  city?: string;
  timezone?: string;
}

export interface VerificationDto {
  emailAddress?: boolean;
  phoneNumber?: boolean;
}

export interface SocialLinkDto {
  platform: string;
  profileUrl: string;
}

export interface LanguageDto {
  language: string;
  proficiency: string;
}

export interface FreelancerProfileDto {
  basicInformation?: BasicInformationDto;
  professionalDetails?: ProfessionalDetailsDto;
  location?: LocationDto;
  availability?: string[];
  verification?: VerificationDto;
  socialLinks?: SocialLinkDto[];
  languages?: LanguageDto[];
}

export interface ClientProfileDto {
  basicInformation?: BasicInformationDto;
  professionalDetails?: ProfessionalDetailsDto;
  location?: LocationDto;
  verification?: VerificationDto;
  socialLinks?: SocialLinkDto[];
  languages?: LanguageDto[];
}
