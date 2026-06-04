import { Component, AfterViewInit, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ChipComponent } from '../../../shared/components/chip/chip.component';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { UploadService } from '../../../core/services/upload.service';
import { BucketKey, UploadSection } from '../../../core/enums/upload.enum';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { Gender } from '../../../core/enums/gender.enum';
import { Availability } from '../../../core/enums/availability.enum';
import { ClientType } from '../../../core/enums/client-type.enum';
import { Industry } from '../../../core/enums/industry.enum';
import { Country } from '../../../core/enums/country.enum';
import { Timezone } from '../../../core/enums/timezone.enum';
import { SocialPlatform } from '../../../core/enums/social-platform.enum';
import { Category } from '../../../core/enums/category.enum';
import { Language } from '../../../core/enums/language.enum';
import { Proficiency } from '../../../core/enums/proficiency.enum';
import { BasicInformationDto, LocationDto, VerificationDto, SocialLinkDto, LanguageDto, FreelancerProfileDto, ClientProfileDto } from '../../../core/DTOs/profile.dto';
import { validateSocialLink, RegexPatterns } from '../../../core/regex/patterns';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, ChipComponent, TitleCasePipe, FormsModule, FileUploadComponent],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
})
export class ProfileFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private uploadService = inject(UploadService);
  private router = inject(Router);

  BucketKey = BucketKey;
  UploadSection = UploadSection;
  ClientType = ClientType;
  clientTypes = Object.values(ClientType);

  // Photo Upload State
  uploadedProfilePhotoUrl: string | null = null;
  isUploadingPhoto = false;
  photoUploadError: string | null = null;

  userRole: 'freelancer' | 'client' = 'freelancer';
  activeSection: string = 'basic';
  get progress(): number {
    const fields: boolean[] = [];

    // Common fields
    fields.push(!!(this.profilePhotoPreview || this.uploadedProfilePhotoUrl));
    fields.push(!!this.username);
    fields.push(!!this.gender);
    fields.push(!!this.shortBio);
    fields.push(!!this.country);
    fields.push(!!this.city);
    fields.push(!!this.timezone);
    fields.push(this.isPhoneVerified);

    if (this.userRole === 'freelancer') {
      fields.push(!!this.professionalHeadline);
      fields.push(this.selectedCategories.length > 0);
      fields.push(this.skills.length > 0);
      fields.push(!!this.availabilityType);
    } else {
      // For Clients
      fields.push(!!this.clientType);
      if (this.clientType !== 'Individual') {
        fields.push(!!this.website);
        fields.push(!!this.industry);
      }
    }

    const completed = fields.filter(Boolean).length;
    const total = fields.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
  isProfessionalDropdownOpen: boolean = false;
  private observer: IntersectionObserver | null = null;

  // PREFILLED DATA
  prefilledData = {
    fullName: '',
    email: ''
  };

  // FORM BINDINGS
  username: string = '';
  gender: string = '';
  professionalHeadline: string = '';
  shortBio: string = '';
  selectedCategories: string[] = [];
  skills: string[] = [];
  currentSkill: string = '';
  clientType: string = 'Individual';
  website: string = '';
  industry: string = '';
  country: string = '';
  city: string = '';
  timezone: string = '';
  availabilityType: string = 'full-time';
  hourlyRate: number = 50;
  phoneNumber: string = '';
  profilePhotoPreview: string | null = null;

  isLoading = false;
  submitError: string | null = null;

  // Phone Verification state
  isPhoneVerified = false;
  showPhoneOtpInput = false;
  phoneOtpCode = '';
  phoneOtpError: string | null = null;
  phoneOtpSuccessMessage: string | null = null;
  isSendingPhoneOtp = false;
  isVerifyingPhone = false;

  savedSocialLinks: any[] = [];
  currentLink = { platform: '', url: '' };

  savedLanguages: LanguageDto[] = [];
  currentLanguage = { language: '', proficiency: '' };

  languageOptions = [
    { label: 'English', value: Language.English },
    { label: 'Hindi', value: Language.Hindi },
    { label: 'Spanish', value: Language.Spanish },
    { label: 'French', value: Language.French },
    { label: 'German', value: Language.German },
    { label: 'Arabic', value: Language.Arabic },
    { label: 'Chinese', value: Language.Chinese },
    { label: 'Japanese', value: Language.Japanese },
    { label: 'Portuguese', value: Language.Portuguese },
    { label: 'Russian', value: Language.Russian },
  ];

  proficiencyOptions = [
    { label: 'Basic', value: Proficiency.Basic },
    { label: 'Conversational', value: Proficiency.Conversational },
    { label: 'Professional', value: Proficiency.Professional },
    { label: 'Native / Bilingual', value: Proficiency.Native },
  ];

  isEditModalOpen: boolean = false;
  editingLinkIndex: number = -1;
  editingLinkData = { platform: '', url: '' };

  platformOptions = [
    { label: 'LinkedIn', value: SocialPlatform.LinkedIn, icon: 'bi-linkedin' },
    { label: 'Twitter / X', value: SocialPlatform.Twitter, icon: 'bi-twitter-x' },
    { label: 'GitHub', value: SocialPlatform.GitHub, icon: 'bi-github' },
    { label: 'Portfolio', value: SocialPlatform.Portfolio, icon: 'bi-link-45deg' },
    { label: 'Dribbble', value: SocialPlatform.Dribbble, icon: 'bi-dribbble' },
    { label: 'Behance', value: SocialPlatform.Behance, icon: 'bi-behance' }
  ];

  genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female },
    { label: 'Other', value: Gender.Other }
  ];

  availabilityOptions = [
    { label: 'Full Time', value: Availability.FullTime },
    { label: 'Part Time', value: Availability.PartTime },
    { label: 'Other', value: Availability.Other }
  ];

  freelancerSections = [
    { id: 'basic', label: 'Basic Identity', sub: 'Tell us who you are', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your work & expertise', icon: 'bi-briefcase' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'availability', label: 'Availability', sub: 'When you can work', icon: 'bi-clock' },
    { id: 'verification', label: 'Verify your contact', sub: 'Verify your contact', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social & Languages', sub: 'Profiles & languages', icon: 'bi-link-45deg' },
  ];

  clientSections = [
    { id: 'basic', label: 'Basic Information', sub: 'Tell us about yourself', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your business details', icon: 'bi-briefcase' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact details', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social & Languages', sub: 'Profiles & languages', icon: 'bi-link-45deg' },
  ];

  industryOptions = [
    { label: 'Technology', value: Industry.Technology },
    { label: 'Healthcare', value: Industry.Healthcare },
    { label: 'Finance', value: Industry.Finance },
    { label: 'Education', value: Industry.Education },
    { label: 'Marketing', value: Industry.Marketing },
    { label: 'Design', value: Industry.Design },
    { label: 'Other', value: Industry.Other }
  ];

  countryOptions = [
    { label: 'United States', value: Country.UnitedStates },
    { label: 'United Kingdom', value: Country.UnitedKingdom },
    { label: 'India', value: Country.India },
    { label: 'Canada', value: Country.Canada },
    { label: 'Australia', value: Country.Australia },
    { label: 'Germany', value: Country.Germany }
  ];

  timezoneOptions = [
    { label: '(GMT-05:00) Eastern Time', value: Timezone.EasternTime },
    { label: '(GMT-08:00) Pacific Time', value: Timezone.PacificTime },
    { label: '(GMT+05:30) India Standard Time', value: Timezone.IndiaTime },
    { label: '(GMT+00:00) London', value: Timezone.LondonTime },
    { label: '(GMT+01:00) Berlin', value: Timezone.BerlinTime }
  ];

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userRole = user.role.toLowerCase() as 'freelancer' | 'client';
      this.prefilledData.fullName = user.fullName;
      this.prefilledData.email = user.email;
      this.isPhoneVerified = user.mobileVerification || false;
      this.phoneNumber = user.phoneNumber || '';
    } else {
      const userJson = localStorage.getItem('th_user');
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          this.userRole = parsedUser.role.toLowerCase() as 'freelancer' | 'client';
          this.prefilledData.fullName = parsedUser.fullName;
          this.prefilledData.email = parsedUser.email;
          this.isPhoneVerified = parsedUser.mobileVerification || false;
          this.phoneNumber = parsedUser.phoneNumber || '';
        } catch (e) {
          this.router.navigate(['/account/signin']);
        }
      } else {
        this.router.navigate(['/account/signin']);
      }
    }

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-15% 0px -45% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => this.observer?.observe(section));
  }

  get currentSections() {
    return this.userRole === 'freelancer' ? this.freelancerSections : this.clientSections;
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // CATEGORIES & SKILLS HANDLING

  categoryOptions = [
    { label: 'Web Development', value: Category.WebDevelopment },
    { label: 'Mobile Development', value: Category.MobileDevelopment },
    { label: 'UI/UX Design', value: Category.UIUXDesign },
    { label: 'Data Science', value: Category.DataScience },
    { label: 'Marketing', value: Category.Marketing },
    { label: 'Content Writing', value: Category.ContentWriting }
  ];

  addCategory(value: any): void {
    if (value && !this.selectedCategories.includes(value)) {
      this.selectedCategories.push(value);
    }
  }

  removeCategory(index: number): void {
    this.selectedCategories.splice(index, 1);
    this.selectedCategories = [...this.selectedCategories];
  }

  removeCategoryByValue(value: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== value);
  }

  getCategoryLabel(value: string): string {
    const opt = this.categoryOptions.find(o => o.value === value);
    return opt ? opt.label : value;
  }

  addSkill(value: string): void {
    const trimmed = value.trim();
    if (trimmed && !this.skills.includes(trimmed)) {
      this.skills.push(trimmed);
      this.currentSkill = '';
    }
  }

  removeSkill(index: number): void {
    this.skills.splice(index, 1);
  }

  setSelection(type: string, value: string): void {
    if (type === 'availability') {
      this.availabilityType = value;
      if (value === 'part-time') {
        this.hourlyRate = 30;
      } else if (value === 'full-time') {
        this.hourlyRate = 50;
      } else {
        this.hourlyRate = 20;
      }
    }
    if (type === 'clientType') {
      this.clientType = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }

  triggerFileUpload(): void {
    const fileInput = document.getElementById('profilePicInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isUploadingPhoto = true;
      this.photoUploadError = null;

      const bucketKey = this.userRole === 'client' ? BucketKey.ClientData : BucketKey.FreelancerData;
      const section = UploadSection.ProfilePhoto;

      this.uploadService.uploadFile(file, bucketKey, section, true).subscribe({
        next: (res) => {
          this.isUploadingPhoto = false;
          if (res.success && res.url) {
            this.uploadedProfilePhotoUrl = res.url;
            this.profilePhotoPreview = res.url;
          }
        },
        error: (err) => {
          this.isUploadingPhoto = false;
          this.photoUploadError = err.error?.message || 'Failed to upload profile photo.';
        }
      });
    }
  }

  onProfilePhotoUploaded(url: string): void {
    this.uploadedProfilePhotoUrl = url;
    this.profilePhotoPreview = url;
  }

  onProfilePhotoRemoved(): void {
    this.uploadedProfilePhotoUrl = null;
    this.profilePhotoPreview = null;
  }

  addSocialLink(): void {
    this.currentLink = { platform: '', url: '' };
  }

  saveSocialLink(): void {
    if (this.currentLink.platform && this.currentLink.url) {
      if (!validateSocialLink(this.currentLink.platform, this.currentLink.url)) {
        alert(`Please enter a valid ${this.currentLink.platform} URL.`);
        return;
      }
      this.savedSocialLinks.push({ ...this.currentLink, status: 'Connected' });
      this.currentLink = { platform: '', url: '' };
    }
  }

  removeSocialLink(index: number): void {
    this.savedSocialLinks.splice(index, 1);
  }

  addLanguage(): void {
    if (this.currentLanguage.language && this.currentLanguage.proficiency) {
      const exists = this.savedLanguages.some(l => l.language === this.currentLanguage.language);
      if (!exists) {
        this.savedLanguages.push({ ...this.currentLanguage });
      }
      this.currentLanguage = { language: '', proficiency: '' };
    }
  }

  removeLanguage(index: number): void {
    this.savedLanguages.splice(index, 1);
  }

  openEditModal(index: number): void {
    this.editingLinkIndex = index;
    this.editingLinkData = { ...this.savedSocialLinks[index] };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingLinkIndex = -1;
  }

  updateSocialLink(): void {
    if (this.editingLinkIndex > -1) {
      if (!validateSocialLink(this.editingLinkData.platform, this.editingLinkData.url)) {
        alert(`Please enter a valid ${this.editingLinkData.platform} URL.`);
        return;
      }
      this.savedSocialLinks[this.editingLinkIndex].url = this.editingLinkData.url;
      this.closeEditModal();
    }
  }

  getPlatformIcon(platform: string): string {
    const option = this.platformOptions.find(o => o.value === platform);
    return option ? option.icon : 'bi-link-45deg';
  }

  onSaveAndContinue(): void {
    this.isLoading = true;
    this.submitError = null;

    const formData = new FormData();

    const basicInformation: BasicInformationDto = {
      fullName: this.prefilledData.fullName,
      email: this.prefilledData.email,
      username: this.username,
      gender: this.gender,
      shortBio: this.shortBio,
      profilePhoto: this.uploadedProfilePhotoUrl || this.profilePhotoPreview || '',
      ...(this.userRole === 'freelancer' ? { professionalHeadline: this.professionalHeadline } : {})
    };

    const location: LocationDto = {
      country: this.country,
      city: this.city,
      timezone: this.timezone
    };

    const verification: VerificationDto = {
      emailAddress: true,
      phoneNumber: this.isPhoneVerified
    };

    // Auto-flush any in-progress social link the user typed but didn't click Add
    if (this.currentLink.platform && this.currentLink.url) {
      if (validateSocialLink(this.currentLink.platform, this.currentLink.url)) {
        this.savedSocialLinks.push({ ...this.currentLink, status: 'Connected' });
      }
      this.currentLink = { platform: '', url: '' };
    }
    // Auto-flush any in-progress language entry
    if (this.currentLanguage.language && this.currentLanguage.proficiency) {
      this.savedLanguages.push({ ...this.currentLanguage });
      this.currentLanguage = { language: '', proficiency: '' };
    }

    const socialLinks: SocialLinkDto[] = this.savedSocialLinks.map(link => ({
      platform: link.platform,
      profileUrl: link.url
    }));

    const languages: LanguageDto[] = this.savedLanguages;

    if (this.userRole === 'freelancer') {
      const freelancerProfile: FreelancerProfileDto = {
        basicInformation,
        professionalDetails: {
          categories: this.selectedCategories,
          skills: this.skills
        },
        location,
        availability: [this.availabilityType],
        hourlyRate: this.hourlyRate,
        verification,
        socialLinks
      };

      formData.append('basicInformation', JSON.stringify(freelancerProfile.basicInformation));
      formData.append('professionalDetails', JSON.stringify(freelancerProfile.professionalDetails));
      formData.append('location', JSON.stringify(freelancerProfile.location));
      formData.append('verification', JSON.stringify(freelancerProfile.verification));
      formData.append('socialLinks', JSON.stringify(freelancerProfile.socialLinks));
      formData.append('availability', JSON.stringify(freelancerProfile.availability));
      formData.append('hourlyRate', this.hourlyRate.toString());
      formData.append('languages', JSON.stringify(languages));
    } else {
      const clientProfile: ClientProfileDto = {
        basicInformation,
        professionalDetails: {
          clientType: this.clientType as any,
          website: this.clientType === 'Individual' ? '' : this.website,
          industry: this.clientType === 'Individual' ? '' : this.industry
        },
        location,
        verification,
        socialLinks
      };

      formData.append('basicInformation', JSON.stringify(clientProfile.basicInformation));
      formData.append('professionalDetails', JSON.stringify(clientProfile.professionalDetails));
      formData.append('location', JSON.stringify(clientProfile.location));
      formData.append('verification', JSON.stringify(clientProfile.verification));
      formData.append('socialLinks', JSON.stringify(clientProfile.socialLinks));
      formData.append('languages', JSON.stringify(languages));
    }

    this.profileService.completeProfile(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (this.userRole === 'freelancer') {
          this.router.navigate(['/user/my-dashboard']);
        } else {
          this.router.navigate(['/user/client-dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.submitError = err.error?.message || 'Failed to submit profile details.';
      }
    });
  }

  sendPhoneOTP(): void {
    if (!this.phoneNumber) {
      this.phoneOtpError = 'Please enter a valid phone number';
      return;
    }
    let formattedPhone = this.phoneNumber.trim();
    if (!RegexPatterns.PHONE.test(formattedPhone)) {
      this.phoneOtpError = 'Please enter a valid phone number (e.g., +919876543210 or 9876543210).';
      return;
    }
    this.isSendingPhoneOtp = true;
    this.phoneOtpError = null;
    this.phoneOtpSuccessMessage = null;

    // Standardize to include country code if not present (e.g. +91)
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    this.profileService.sendPhoneOTP(formattedPhone).subscribe({
      next: (res) => {
        this.isSendingPhoneOtp = false;
        this.showPhoneOtpInput = true;
        this.phoneOtpSuccessMessage = res.message || 'OTP code sent to your phone.';
      },
      error: (err) => {
        this.isSendingPhoneOtp = false;
        this.phoneOtpError = err.error?.message || 'Failed to send SMS OTP code.';
      }
    });
  }

  verifyPhoneOTP(): void {
    if (!this.phoneOtpCode || this.phoneOtpCode.length !== 6) {
      this.phoneOtpError = 'Please enter a valid 6-digit OTP';
      return;
    }
    this.isVerifyingPhone = true;
    this.phoneOtpError = null;

    let formattedPhone = this.phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
    }

    this.profileService.verifyPhoneOTP(formattedPhone, this.phoneOtpCode).subscribe({
      next: (res) => {
        this.isVerifyingPhone = false;
        this.isPhoneVerified = true;
        this.showPhoneOtpInput = false;
        this.phoneOtpCode = '';
        this.phoneOtpSuccessMessage = 'Mobile verified successfully!';
      },
      error: (err) => {
        this.isVerifyingPhone = false;
        this.phoneOtpError = err.error?.message || 'Invalid verification code.';
      }
    });
  }
}
