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
import { BucketKey, UploadSection } from '../../../core/enums/upload.enums';
import {
  BasicInformationDto,
  LocationDto,
  VerificationDto,
  SocialLinkDto,
  LanguageDto,
  FreelancerProfileDto,
  ClientProfileDto
} from '../../../core/DTOs/profile.dto';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, ChipComponent, TitleCasePipe, FormsModule],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
})
export class ProfileFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private uploadService = inject(UploadService);
  private router = inject(Router);

  // Photo Upload State
  uploadedProfilePhotoUrl: string | null = null;
  isUploadingPhoto = false;
  photoUploadError: string | null = null;

  userRole: 'freelancer' | 'client' = 'freelancer';
  activeSection: string = 'basic';
  progress: number = 0;
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
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'German', value: 'German' },
    { label: 'Arabic', value: 'Arabic' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Portuguese', value: 'Portuguese' },
    { label: 'Russian', value: 'Russian' },
  ];

  proficiencyOptions = [
    { label: 'Basic', value: 'basic' },
    { label: 'Conversational', value: 'conversational' },
    { label: 'Professional', value: 'professional' },
    { label: 'Native / Bilingual', value: 'native' },
  ];

  isEditModalOpen: boolean = false;
  editingLinkIndex: number = -1;
  editingLinkData = { platform: '', url: '' };

  platformOptions = [
    { label: 'LinkedIn', value: 'linkedin', icon: 'bi-linkedin' },
    { label: 'Twitter / X', value: 'twitter', icon: 'bi-twitter-x' },
    { label: 'GitHub', value: 'github', icon: 'bi-github' },
    { label: 'Portfolio', value: 'portfolio', icon: 'bi-link-45deg' },
    { label: 'Dribbble', value: 'dribbble', icon: 'bi-dribbble' },
    { label: 'Behance', value: 'behance', icon: 'bi-behance' }
  ];

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  availabilityOptions = [
    { label: 'Full Time', value: 'full-time' },
    { label: 'Part Time', value: 'part-time' },
    { label: 'Other', value: 'other' }
  ];

  freelancerSections = [
    { id: 'basic', label: 'Basic Identity', sub: 'Tell us who you are', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your work & expertise', icon: 'bi-briefcase' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'availability', label: 'Availability', sub: 'When you can work', icon: 'bi-clock' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social & Links', sub: 'Your portfolio & profiles', icon: 'bi-link-45deg' },
  ];

  clientSections = [
    { id: 'basic', label: 'Basic Information', sub: 'Tell us about yourself', icon: 'bi-person' },
    { id: 'professional', label: 'Professional Details', sub: 'Your business details', icon: 'bi-briefcase' },
    { id: 'location', label: 'Location', sub: 'Where are you based?', icon: 'bi-geo-alt' },
    { id: 'verification', label: 'Verification', sub: 'Verify your contact details', icon: 'bi-shield-check' },
    { id: 'social', label: 'Social Links', sub: 'Add your social profiles', icon: 'bi-link-45deg' },
  ];

  industryOptions = [
    { label: 'Technology', value: 'tech' },
    { label: 'Healthcare', value: 'health' },
    { label: 'Finance', value: 'finance' },
    { label: 'Education', value: 'edu' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Design', value: 'design' },
    { label: 'Other', value: 'other' }
  ];

  countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'India', value: 'IN' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' }
  ];

  timezoneOptions = [
    { label: '(GMT-05:00) Eastern Time', value: 'ET' },
    { label: '(GMT-08:00) Pacific Time', value: 'PT' },
    { label: '(GMT+05:30) India Standard Time', value: 'IST' },
    { label: '(GMT+00:00) London', value: 'GMT' },
    { label: '(GMT+01:00) Berlin', value: 'CET' }
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
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Development', value: 'Mobile Development' },
    { label: 'UI/UX Design', value: 'UI/UX Design' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Content Writing', value: 'Content Writing' }
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
    if (type === 'availability') this.availabilityType = value;
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

  addSocialLink(): void {
    this.currentLink = { platform: '', url: '' };
  }

  saveSocialLink(): void {
    if (this.currentLink.platform && this.currentLink.url) {
      this.savedSocialLinks.push({ ...this.currentLink, status: 'Connected' });
      this.currentLink = { platform: '', url: '' };
    }
  }

  removeSocialLink(index: number): void {
    this.savedSocialLinks.splice(index, 1);
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
      this.savedSocialLinks.push({ ...this.currentLink, status: 'Connected' });
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
        verification,
        socialLinks
      };

      formData.append('basicInformation', JSON.stringify(freelancerProfile.basicInformation));
      formData.append('professionalDetails', JSON.stringify(freelancerProfile.professionalDetails));
      formData.append('location', JSON.stringify(freelancerProfile.location));
      formData.append('verification', JSON.stringify(freelancerProfile.verification));
      formData.append('socialLinks', JSON.stringify(freelancerProfile.socialLinks));
      formData.append('availability', JSON.stringify(freelancerProfile.availability));
      formData.append('languages', JSON.stringify(languages));
    } else {
      const clientProfile: ClientProfileDto = {
        basicInformation,
        professionalDetails: {
          clientType: this.clientType as any,
          website: this.website,
          industry: this.industry
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
    this.isSendingPhoneOtp = true;
    this.phoneOtpError = null;
    this.phoneOtpSuccessMessage = null;

    // Standardize to include country code if not present (e.g. +91)
    let formattedPhone = this.phoneNumber.trim();
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
