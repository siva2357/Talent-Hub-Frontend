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
import { LanguageDto } from '../../../core/DTOs/profile.dto';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  activeTab: 'profile' | 'security' | 'notifications' | 'manage' | 'payment' = 'profile';

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
  profilePhotoUrl: string | null = null;

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
  clientType: string = 'Individual';
  hiringType: string = 'long-term';
  professionalHeadline: string = '';
  hourlyRate: number = 50;
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

  // LANGUAGES COLLECTIONS
  savedLanguages: LanguageDto[] = [];
  currentLanguage = { language: '', proficiency: '' };

  // BANK ACCOUNT LINKING & VERIFICATION STATE
  bankAccountLinked: boolean = false;
  bankAccountVerified: boolean = false;
  bankVerificationStatus: 'unlinked' | 'pending' | 'verified' = 'unlinked';
  bankDetails = {
    bankName: '',
    holderName: '',
    accountNumber: '',
    ifsc: ''
  };

  // CLIENT WALLET ESCROW STATE
  escrowBalance: number = 0;
  depositAmount: number = 0;

  // FREELANCER WALLET EARNINGS STATE
  availableBalance: number = 0;
  withdrawAmount: number = 0;

  // SIMULATED AGREEMENTS DATA
  paymentAgreements: any[] = [];

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

  categoryOptions = [
    { label: 'Web Development', value: Category.WebDevelopment },
    { label: 'Mobile Development', value: Category.MobileDevelopment },
    { label: 'UI/UX Design', value: Category.UIUXDesign },
    { label: 'Data Science', value: Category.DataScience },
    { label: 'Marketing', value: Category.Marketing },
    { label: 'Content Writing', value: Category.ContentWriting }
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
    { label: 'Russian', value: Language.Russian }
  ];

  proficiencyOptions = [
    { label: 'Basic', value: Proficiency.Basic },
    { label: 'Conversational', value: Proficiency.Conversational },
    { label: 'Professional', value: Proficiency.Professional },
    { label: 'Native / Bilingual', value: Proficiency.Native }
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
          this.profilePhotoUrl = basic.profilePhoto || null;
          this.savedLanguages = p.languages || [];

          this.gender = basic.gender || 'male';
          this.country = p.location?.country || 'IN';
          this.city = p.location?.city || '';
          this.timezone = p.location?.timezone || 'IST';
          this.savedSocialLinks = p.socialLinks || [];
          this.selectedCategories = p.professionalDetails?.categories || [];
          this.skills = p.professionalDetails?.skills || [];

          if (this.userMode === 'freelancer') {
            this.professionalHeadline = basic.professionalHeadline || '';
            this.hourlyRate = p.hourlyRate || 50;
            this.availabilityType = p.availability?.[0] || 'full-time';

            // Mock Freelancer initial balances and agreements
            this.availableBalance = 32500;
            this.paymentAgreements = [
              {
                id: 'ag-1',
                partyName: 'Acme Corp',
                projectName: 'Enterprise API Integration',
                budget: 65000,
                status: 'Awaiting Your Signature',
                date: '2026-05-28'
              },
              {
                id: 'ag-2',
                partyName: 'Dev.io',
                projectName: 'Angular Component Library Styling',
                budget: 35000,
                status: 'Completed',
                date: '2026-04-10'
              }
            ];
          } else {
            const loadedType = p.professionalDetails?.clientType || 'Individual';
            this.clientType = loadedType.charAt(0).toUpperCase() + loadedType.slice(1);
            this.websiteUrl = p.professionalDetails?.website || '';
            this.industry = p.professionalDetails?.industry || 'tech';

            // Mock Client initial balances and agreements
            this.escrowBalance = 75000;
            this.paymentAgreements = [
              {
                id: 'ag-101',
                partyName: 'Sophia Chen',
                projectName: 'Responsive Dashboard Development',
                budget: 45000,
                fundedAmount: 45000,
                status: 'Signed & Active',
                date: '2026-05-12'
              },
              {
                id: 'ag-102',
                partyName: 'Alex Rivera',
                projectName: 'Angular Architecture Consulting',
                budget: 30000,
                fundedAmount: 0,
                status: 'Pending Client Signature',
                date: '2026-06-01'
              }
            ];
          }

          this.backupData();
        }
      },
      error: (err: any) => {
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

  // LANGUAGES ACTIONS
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
        next: (res: any) => {
          alert('Profile photo updated successfully!');
          this.loadProfileData();
        },
        error: (err: any) => {
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
      next: (res: any) => {
        alert(res.message || 'OTP sent successfully!');
        this.otpSent = true;
      },
      error: (err: any) => {
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
      next: (res: any) => {
        alert(res.message || 'Phone verified successfully!');
        this.phoneVerified = true;
        this.otpSent = false;
        this.otpCode = '';
        this.loadProfileData();
      },
      error: (err: any) => {
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
      savedLanguages: this.savedLanguages,
      selectedCategories: this.selectedCategories,
      skills: this.skills,
      securityData: this.securityData,
      notificationPreferences: this.notificationPreferences,
      profilePhotoUrl: this.profilePhotoUrl,
      hourlyRate: this.hourlyRate
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
      this.savedLanguages = data.savedLanguages || [];
      this.selectedCategories = data.selectedCategories;
      this.skills = data.skills;
      this.securityData = data.securityData;
      this.notificationPreferences = data.notificationPreferences;
      this.profilePhotoUrl = data.profilePhotoUrl;
      this.hourlyRate = data.hourlyRate || 50;
      alert('Changes Discarded!');
    }
  }

  // SECURE ACCOUNT DELETION
  deleteAccount(): void {
    if (this.confirmDelete && this.deleteConfirmPassword) {
      this.profileService.deleteProfile().subscribe({
        next: (res: any) => {
          alert('Account profile deleted successfully! Redirecting...');
          this.confirmDelete = false;
          this.deleteConfirmPassword = '';
          this.router.navigate(['/']);
        },
        error: (err: any) => {
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
        next: (res: any) => {
          alert('Password updated successfully!');
          this.securityData.currentPassword = '';
          this.securityData.newPassword = '';
          this.securityData.confirmPassword = '';
        },
        error: (err: any) => {
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
        shortBio: this.prefilledData.bio,
        profilePhoto: this.profilePhotoUrl || ''
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
          website: this.clientType === 'Individual' ? '' : this.websiteUrl,
          industry: this.clientType === 'Individual' ? '' : this.industry
        };
      }

      // Auto-flush any in-progress social link or language
      if (this.currentLink.platform && this.currentLink.profileUrl) {
        this.savedSocialLinks.push({ ...this.currentLink });
        this.currentLink = { platform: 'linkedin', profileUrl: '' };
      }
      if (this.currentLanguage.language && this.currentLanguage.proficiency) {
        const exists = this.savedLanguages.some(l => l.language === this.currentLanguage.language);
        if (!exists) {
          this.savedLanguages.push({ ...this.currentLanguage });
        }
        this.currentLanguage = { language: '', proficiency: '' };
      }

      const cleanedSocialLinks = this.savedSocialLinks.map((link: any) => ({
        platform: link.platform,
        profileUrl: link.profileUrl || link.url || ''
      }));

      const cleanedLanguages = this.savedLanguages.map((lang: any) => ({
        language: lang.language,
        proficiency: lang.proficiency
      }));

      const payload = {
        basicInformation: basicInfo,
        professionalDetails: profDetails,
        location,
        socialLinks: cleanedSocialLinks,
        languages: cleanedLanguages,
        availability: this.userMode === 'freelancer' ? availability : undefined,
        hourlyRate: this.userMode === 'freelancer' ? Number(this.hourlyRate) : undefined
      };

      this.profileService.updateProfile(payload).subscribe({
        next: (res: any) => {
          alert('Settings Saved Successfully!');
          this.backupData();
        },
        error: (err: any) => {
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

  // PAYMENT AGREEMENT HANDLERS
  saveBankDetails(): void {
    if (this.bankDetails.bankName && this.bankDetails.holderName && this.bankDetails.accountNumber && this.bankDetails.ifsc) {
      this.bankAccountLinked = true;
      this.bankVerificationStatus = 'pending';
      alert('Bank account details saved. Status: Pending Verification.');
    } else {
      alert('Please fill out all bank account fields.');
    }
  }

  verifyBankDetails(): void {
    this.bankAccountVerified = true;
    this.bankVerificationStatus = 'verified';
    alert('Bank account verification successful! Deposit/Withdrawal panels unlocked.');
  }

  depositFunds(): void {
    const amt = Number(this.depositAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }
    this.escrowBalance += amt;
    alert(`Successfully deposited ₹ ${amt} to Escrow Wallet!`);
    this.depositAmount = 0;
  }

  withdrawFunds(): void {
    const amt = Number(this.withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid withdrawal amount.');
      return;
    }
    if (amt > this.availableBalance) {
      alert('Insufficient available balance for withdrawal.');
      return;
    }
    this.availableBalance -= amt;
    alert(`Successfully withdrew ₹ ${amt} to linked bank account!`);
    this.withdrawAmount = 0;
  }

  signAgreement(id: string): void {
    const agreement = this.paymentAgreements.find(a => a.id === id);
    if (agreement) {
      if (agreement.status === 'Awaiting Your Signature') {
        agreement.status = 'Signed & Active';
        alert('Successfully signed the payment agreement. Please download the payment agreement for future references.');
      } else if (agreement.status === 'Pending Client Signature') {
        if (agreement.budget > this.escrowBalance) {
          alert('Insufficient funds in Escrow Balance. Please deposit funds first.');
          return;
        }
        agreement.status = 'Signed & Active';
        agreement.fundedAmount = agreement.budget;
        this.escrowBalance -= agreement.budget;
        alert('Successfully signed and funded the agreement. Please download the payment agreement for future references.');
      }
    }
  }

  releaseEscrow(id: string): void {
    const agreement = this.paymentAgreements.find(a => a.id === id);
    if (agreement) {
      agreement.status = 'Completed';
      alert('Funds successfully released to the freelancer!');
    }
  }

  downloadAgreement(id: string): void {
    window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
  }
}
