import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ChipComponent } from '../../components/chip/chip.component';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    ChipComponent
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  // SETTINGS TABS LAYOUT STATE
  activeTab: 'profile' | 'security' | 'notifications' | 'manage' = 'profile';

  // ROLE MODE (Embedded Dual-Mode Form)
  get userMode(): 'freelancer' | 'client' {
    return this.authService.currentUser()?.role === 'Client' ? 'client' : 'freelancer';
  }

  get realUserRole(): string {
    return this.authService.currentUser()?.role || 'Freelancer';
  }

  // BACKUP STATE FOR DISCARD/ROLLBACK
  originalData: any;

  // ACCOUNT DELETION STATE
  confirmDelete: boolean = false;
  deleteConfirmPassword: string = '';

  // Phone OTP state
  otpCode: string = '';
  otpSent: boolean = false;
  phoneVerified: boolean = false;
  emailVerified: boolean = false;
  phoneNumber: string = '';

  // PREFILLED IDENTITY DATA
  prefilledData = {
    fullName: '',
    email: '',
    username: '',
    bio: ''
  };

  // FORM VARIABLES
  gender: string = 'male';
  experienceLevel: string = 'intermediate';
  availabilityType: string = 'full-time';
  clientType: string = 'individual';
  hiringType: string = 'long-term';
  professionalHeadline: string = '';
  websiteUrl: string = '';
  industry: string = '';
  country: string = '';
  city: string = '';
  timezone: string = 'IST';

  // SOCIAL LINKS COLLECTIONS
  savedSocialLinks: any[] = [];
  currentLink = { platform: 'linkedin', profileUrl: '' };

  isEditModalOpen: boolean = false;
  editingLinkIndex: number = -1;
  editingLinkData = { platform: '', profileUrl: '' };

  // CATEGORIES & SKILLS COLLECTIONS
  selectedCategories: string[] = [];
  selectedCategoryInput: string = '';
  skills: string[] = [];
  currentSkill: string = '';

  // SECURITY FORM FIELDS
  securityData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  };

  // NOTIFICATION SWITCH PREFERENCES
  notificationPreferences = {
    emailAlerts: true,
    browserPings: true,
    smsReceipts: false,
    marketingEmails: false,
    securityAlerts: true
  };

  // DROPDOWN OPTIONS DATA
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

  categoryOptions = [
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Development', value: 'Mobile Development' },
    { label: 'UI/UX Design', value: 'UI/UX Design' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Content Writing', value: 'Content Writing' }
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
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' }
  ];

  timezoneOptions = [
    { label: '(GMT+05:30) India Standard Time', value: 'IST' },
    { label: '(GMT-05:00) Eastern Time', value: 'ET' },
    { label: '(GMT-08:00) Pacific Time', value: 'PT' },
    { label: '(GMT+00:00) London Time', value: 'GMT' },
    { label: '(GMT+01:00) Berlin Time', value: 'CET' }
  ];

  ngOnInit(): void {

    // Load notification preferences from localStorage
    const savedNotifs = localStorage.getItem('th_notif_prefs');
    if (savedNotifs) {
      try {
        this.notificationPreferences = JSON.parse(savedNotifs);
      } catch (e) {
        // Keep defaults
      }
    }

    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          const u = res.user || {};
          const p = res.profile || {};
          const basic = p.basicInformation || {};

          this.prefilledData = {
            fullName: basic.fullName || u.fullName || '',
            email: basic.email || u.email || '',
            username: basic.username || (u.email ? u.email.split('@')[0] : ''),
            bio: basic.shortBio || ''
          };

          this.emailVerified = u.emailVerified || false;
          this.phoneVerified = u.mobileVerification || p.verification?.phoneNumber || false;
          this.phoneNumber = u.phoneNumber || '';

          this.gender = basic.gender || 'male';
          this.country = p.location?.country || 'IN';
          this.city = p.location?.city || '';
          this.timezone = p.location?.timezone || 'IST';
          this.savedSocialLinks = p.socialLinks || [];
          this.selectedCategories = p.professionalDetails?.categories || [];
          this.skills = p.professionalDetails?.skills || [];

          if (this.userMode === 'freelancer') {
            this.professionalHeadline = basic.professionalHeadline || '';
            this.availabilityType = p.availability?.[0] || 'full-time';
          } else {
            this.clientType = p.professionalDetails?.clientType || 'individual';
            this.websiteUrl = p.professionalDetails?.website || '';
            this.industry = p.professionalDetails?.industry || 'tech';
          }

          this.backupData();
        }
      },
      error: (err) => {
        console.error('Failed to load profile data:', err);
      }
    });
  }

  // LOGICAL HANDLERS

  setSelection(type: string, value: string): void {
    if (type === 'experience') this.experienceLevel = value;
    if (type === 'availability') this.availabilityType = value;
    if (type === 'clientType') this.clientType = value;
    if (type === 'hiringType') this.hiringType = value;
    if (type === 'gender') this.gender = value;
  }

  // CATEGORIES & SKILLS MODIFIERS
  addCategory(value: any): void {
    if (value && !this.selectedCategories.includes(value)) {
      this.selectedCategories.push(value);
      this.selectedCategoryInput = ''; // Reset select value on selection
    }
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

  // SOCIAL LINKS ACTIONS
  saveSocialLink(): void {
    if (this.currentLink.platform && this.currentLink.profileUrl) {
      this.savedSocialLinks.push({ ...this.currentLink });
      this.currentLink = { platform: 'linkedin', profileUrl: '' };
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
      this.savedSocialLinks[this.editingLinkIndex].profileUrl = this.editingLinkData.profileUrl;
      this.closeEditModal();
    }
  }

  getPlatformIcon(platform: string): string {
    const option = this.platformOptions.find(o => o.value === platform);
    return option ? option.icon : 'bi-link-45deg';
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
      const formData = new FormData();
      formData.append('profilePhoto', file);
      
      // Upload new photo directly
      this.profileService.updateProfile(formData).subscribe({
        next: (res) => {
          alert('Profile photo updated successfully!');
          this.loadProfileData();
        },
        error: (err) => {
          alert('Failed to upload profile photo');
        }
      });
    }
  }

  sendOtp(): void {
    if (!this.phoneNumber) {
      alert('Please enter a valid phone number');
      return;
    }
    let fullPhone = this.phoneNumber.trim();
    if (!fullPhone.startsWith('+')) {
      fullPhone = '+91' + fullPhone;
    }
    this.profileService.sendPhoneOTP(fullPhone).subscribe({
      next: (res) => {
        alert(res.message || 'OTP sent successfully!');
        this.otpSent = true;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to send OTP');
      }
    });
  }

  verifyOtp(): void {
    if (!this.otpCode) {
      alert('Please enter the OTP');
      return;
    }
    let fullPhone = this.phoneNumber.trim();
    if (!fullPhone.startsWith('+')) {
      fullPhone = '+91' + fullPhone;
    }
    this.profileService.verifyPhoneOTP(fullPhone, this.otpCode).subscribe({
      next: (res) => {
        alert(res.message || 'Phone verified successfully!');
        this.phoneVerified = true;
        this.otpSent = false;
        this.otpCode = '';
        this.loadProfileData();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to verify OTP');
      }
    });
  }

  // BACKUP FORM STATE
  backupData(): void {
    this.originalData = JSON.parse(JSON.stringify({
      prefilledData: this.prefilledData,
      gender: this.gender,
      experienceLevel: this.experienceLevel,
      availabilityType: this.availabilityType,
      clientType: this.clientType,
      hiringType: this.hiringType,
      professionalHeadline: this.professionalHeadline,
      websiteUrl: this.websiteUrl,
      industry: this.industry,
      country: this.country,
      city: this.city,
      timezone: this.timezone,
      savedSocialLinks: this.savedSocialLinks,
      selectedCategories: this.selectedCategories,
      skills: this.skills,
      securityData: this.securityData,
      notificationPreferences: this.notificationPreferences
    }));
  }

  // ROLLBACK TO BACKUP
  discardChanges(): void {
    if (this.originalData) {
      const data = JSON.parse(JSON.stringify(this.originalData));
      this.prefilledData = data.prefilledData;
      this.gender = data.gender;
      this.experienceLevel = data.experienceLevel;
      this.availabilityType = data.availabilityType;
      this.clientType = data.clientType;
      this.hiringType = data.hiringType;
      this.professionalHeadline = data.professionalHeadline;
      this.websiteUrl = data.websiteUrl;
      this.industry = data.industry;
      this.country = data.country;
      this.city = data.city;
      this.timezone = data.timezone;
      this.savedSocialLinks = data.savedSocialLinks;
      this.selectedCategories = data.selectedCategories;
      this.skills = data.skills;
      this.securityData = data.securityData;
      this.notificationPreferences = data.notificationPreferences;
      alert('Changes Discarded!');
    }
  }

  // SECURE ACCOUNT DELETION
  deleteAccount(): void {
    if (this.confirmDelete && this.deleteConfirmPassword) {
      this.profileService.deleteProfile().subscribe({
        next: (res) => {
          alert('Account profile deleted successfully! Redirecting...');
          this.confirmDelete = false;
          this.deleteConfirmPassword = '';
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete profile');
        }
      });
    }
  }

  // GLOBAL SAVE SUBMISSIONS
  saveSettings(): void {
    if (this.activeTab === 'security') {
      if (!this.securityData.currentPassword || !this.securityData.newPassword || !this.securityData.confirmPassword) {
        alert('Please fill all password fields');
        return;
      }
      if (this.securityData.newPassword !== this.securityData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      
      this.authService.changePassword({
        oldPassword: this.securityData.currentPassword,
        newPassword: this.securityData.newPassword
      }).subscribe({
        next: (res) => {
          alert('Password updated successfully!');
          this.securityData.currentPassword = '';
          this.securityData.newPassword = '';
          this.securityData.confirmPassword = '';
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to update password');
        }
      });
      return;
    }

    if (this.activeTab === 'profile') {
      // Build request body for profile update
      const basicInfo: any = {
        fullName: this.prefilledData.fullName,
        email: this.prefilledData.email,
        username: this.prefilledData.username,
        gender: this.gender,
        shortBio: this.prefilledData.bio
      };

      const location = {
        country: this.country,
        city: this.city,
        timezone: this.timezone
      };

      let profDetails: any = {};
      let availability: string[] = [];

      if (this.userMode === 'freelancer') {
        basicInfo.professionalHeadline = this.professionalHeadline;
        profDetails = {
          categories: this.selectedCategories,
          skills: this.skills
        };
        availability = [this.availabilityType];
      } else {
        profDetails = {
          clientType: this.clientType,
          website: this.websiteUrl,
          industry: this.industry
        };
      }

      const payload = {
        basicInformation: basicInfo,
        professionalDetails: profDetails,
        location,
        socialLinks: this.savedSocialLinks,
        availability: this.userMode === 'freelancer' ? availability : undefined
      };

      this.profileService.updateProfile(payload).subscribe({
        next: (res) => {
          alert('Settings Saved Successfully!');
          this.backupData();
        },
        error: (err) => {
          console.error('Failed to save profile settings:', err);
          alert(err.error?.message || 'Failed to save settings');
        }
      });
    } else {
      // Save notification preferences in local storage so it is persistent
      localStorage.setItem('th_notif_prefs', JSON.stringify(this.notificationPreferences));
      alert('Notification settings saved successfully!');
      this.backupData();
    }
  }
}
