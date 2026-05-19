import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ChipComponent } from '../../components/chip/chip.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    InputComponent,
    ButtonComponent,
    ChipComponent,
    TitleCasePipe
  ],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {
  // SETTINGS TABS LAYOUT STATE
  activeTab: 'profile' | 'security' | 'notifications' | 'manage' = 'profile';

  // ROLE MODE (Embedded Dual-Mode Form)
  userMode: 'freelancer' | 'client' = 'freelancer';

  // BACKUP STATE FOR DISCARD/ROLLBACK
  originalData: any;

  // ACCOUNT DELETION STATE
  confirmDelete: boolean = false;
  deleteConfirmPassword: string = '';

  // PREFILLED IDENTITY DATA
  prefilledData = {
    fullName: 'Siva Prasad',
    email: 'siva.prasad@example.com',
    username: 'sivaprasad',
    bio: 'Full Stack Engineer passionate about high-performance modern web platforms.'
  };

  // FORM VARIABLES
  gender: string = 'male';
  experienceLevel: string = 'intermediate';
  availabilityType: string = 'full-time';
  clientType: string = 'individual';
  hiringType: string = 'long-term';
  professionalHeadline: string = 'Senior Angular & Node Specialist';
  websiteUrl: string = 'https://sivaprasad.dev';
  industry: string = 'tech';
  country: string = 'IN';
  city: string = 'Hyderabad';
  timezone: string = 'IST';

  // SOCIAL LINKS COLLECTIONS
  savedSocialLinks: any[] = [
    { platform: 'github', url: 'https://github.com/sivaprasad', status: 'Connected' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/sivaprasad', status: 'Connected' }
  ];
  currentLink = { platform: 'twitter', url: '' };

  isEditModalOpen: boolean = false;
  editingLinkIndex: number = -1;
  editingLinkData = { platform: '', url: '' };

  // CATEGORIES & SKILLS COLLECTIONS
  selectedCategories: string[] = ['Web Development', 'UI/UX Design'];
  selectedCategoryInput: string = '';
  skills: string[] = ['Angular', 'TypeScript', 'NodeJS', 'RxJS', 'CSS Grid', 'Bootstrap'];
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

  // LOGICAL HANDLERS
  toggleRole(): void {
    this.userMode = this.userMode === 'freelancer' ? 'client' : 'freelancer';
  }

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
    if (this.currentLink.platform && this.currentLink.url) {
      this.savedSocialLinks.push({ ...this.currentLink, status: 'Connected' });
      this.currentLink = { platform: 'twitter', url: '' };
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

  triggerFileUpload(): void {
    const fileInput = document.getElementById('profilePicInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Profile image updated:', file.name);
    }
  }

  ngOnInit(): void {
    this.backupData();
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
      alert('Account successfully deleted! Redirecting to homepage...');
      console.warn('USER DELETED THE ACCOUNT PERMANENTLY.');
      this.confirmDelete = false;
      this.deleteConfirmPassword = '';
    }
  }

  // GLOBAL SAVE SUBMISSIONS
  saveSettings(): void {
    alert('Settings Saved Successfully!');
    this.backupData(); // Set the new baseline for subsequent discards
    console.log('Saving all account setting data...', {
      activeTab: this.activeTab,
      userMode: this.userMode,
      profileDetails: {
        gender: this.gender,
        experienceLevel: this.experienceLevel,
        availabilityType: this.availabilityType,
        clientType: this.clientType,
        hiringType: this.hiringType,
        selectedCategories: this.selectedCategories,
        skills: this.skills,
        socialLinks: this.savedSocialLinks
      },
      security: this.securityData,
      notifications: this.notificationPreferences
    });
  }
}
