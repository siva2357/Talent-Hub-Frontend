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
import { Component, inject, OnInit, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { ChipComponent } from '../../components/chip/chip.component';
import { validateSocialLink, RegexPatterns } from '../../../core/regex/patterns';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
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
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  // SETTINGS TABS LAYOUT STATE
  activeTab = signal<'profile' | 'security' | 'notifications' | 'manage' | 'payment'>('profile');

  // ROLE MODE (Embedded Dual-Mode Form)
  get userMode(): 'freelancer' | 'client' {
    return this.authService.currentUser()?.role === 'Client' ? 'client' : 'freelancer';
  }

  get realUserRole(): string {
    return this.authService.currentUser()?.role || 'Freelancer';
  }

  // FORM GROUPS
  profileForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: [{ value: '', disabled: true }, Validators.required],
    username: ['', Validators.required],
    bio: ['', Validators.required],
    gender: ['male', Validators.required],
    experienceLevel: ['intermediate'],
    availabilityType: ['full-time'],
    clientType: ['Individual'],
    hiringType: ['long-term'],
    professionalHeadline: [''],

    websiteUrl: [''],
    industry: [''],
    country: [''],
    city: [''],
    timezone: ['IST']
  });

  securityForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  bankForm: FormGroup = this.fb.group({
    bankName: ['', Validators.required],
    holderName: ['', Validators.required],
    accountNumber: ['', Validators.required],
    ifsc: ['', Validators.required]
  });

  // UI STATE SIGNALS
  isEditModalOpen = signal(false);
  otpSent = signal(false);
  phoneVerified = signal(false);
  emailVerified = signal(false);
  isChangingPassword = signal(false);
  isEditLangModalOpen = signal(false);
  bankAccountLinked = signal(false);
  bankAccountVerified = signal(false);

  // ACCOUNT DELETION STATE
  confirmDelete: boolean = false;
  deleteConfirmPassword: string = '';

  // Phone OTP state
  otpCode: string = '';
  phoneNumber: string = '';
  profilePhotoUrl: string | null = null;

  // SOCIAL LINKS & LANGUAGES
  savedSocialLinks: any[] = [];
  currentLink = { platform: '', profileUrl: '' };
  editingLinkIndex: number = -1;
  editingLinkData = { platform: '', profileUrl: '' };

  savedLanguages: LanguageDto[] = [];
  currentLanguage = { language: '', proficiency: '' };
  editingLangIndex: number = -1;
  editingLangData = { language: '', proficiency: '' };

  bankVerificationStatus: 'unlinked' | 'pending' | 'verified' = 'unlinked';

  // WALLET & AGREEMENTS
  escrowBalance: number = 0;
  depositAmount: number = 0;
  availableBalance: number = 0;
  withdrawAmount: number = 0;
  paymentAgreements: any[] = [];

  // CATEGORIES & SKILLS
  selectedCategories: string[] = [];
  selectedCategoryInput: string = '';
  skills: string[] = [];
  currentSkill: string = '';

  // NOTIFICATIONS
  notificationForm: FormGroup = this.fb.group({
    emailAlerts: [true],
    browserPings: [true],
    smsReceipts: [false],
    marketingEmails: [false],
    securityAlerts: [true]
  });

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
        this.notificationForm.patchValue(JSON.parse(savedNotifs));
      } catch (e) {
        // Keep defaults
      }
    }

    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileService.getMyProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        if (res.success) {
          const u = res.user || {};
          const p = res.profile || {};
          const basic = p.basicInformation || {};

          this.profileForm.patchValue({
            fullName: basic.fullName || u.fullName || '',
            email: basic.email || u.email || '',
            username: basic.username || (u.email ? u.email.split('@')[0] : ''),
            bio: basic.shortBio || '',
            gender: basic.gender || 'male',
            country: p.location?.country || 'IN',
            city: p.location?.city || '',
            timezone: p.location?.timezone || 'IST',
            professionalHeadline: basic.professionalHeadline || '',

            availabilityType: p.availability?.[0] || 'full-time',
            clientType: p.professionalDetails?.clientType ? p.professionalDetails.clientType.charAt(0).toUpperCase() + p.professionalDetails.clientType.slice(1) : 'Individual',
            websiteUrl: p.professionalDetails?.website || '',
            industry: p.professionalDetails?.industry || 'tech'
          });

          this.emailVerified.set(u.emailVerified || false);
          this.phoneVerified.set(u.mobileVerification || p.verification?.phoneNumber || false);
          this.phoneNumber = u.phoneNumber || '';
          this.profilePhotoUrl = basic.profilePhoto || null;
          this.savedLanguages = p.languages || [];

          const pay = p.paymentDetails || {};
          this.bankForm.patchValue({
            bankName: pay.bankName || '',
            holderName: pay.holderName || '',
            accountNumber: pay.accountNumber || '',
            ifsc: pay.ifsc || ''
          });

          this.bankVerificationStatus = pay.status || 'unlinked';
          this.bankAccountLinked.set(this.bankVerificationStatus !== 'unlinked');
          this.bankAccountVerified.set(this.bankVerificationStatus === 'verified');

          this.savedSocialLinks = p.socialLinks || [];
          this.selectedCategories = p.professionalDetails?.categories || [];
          this.skills = p.professionalDetails?.skills || [];

          if (this.userMode === 'freelancer') {
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
    if (type === 'experience') this.profileForm.patchValue({ experienceLevel: value });
    if (type === 'availability') this.profileForm.patchValue({ availabilityType: value });
    if (type === 'clientType') this.profileForm.patchValue({ clientType: value });
    if (type === 'hiringType') this.profileForm.patchValue({ hiringType: value });
    if (type === 'gender') this.profileForm.patchValue({ gender: value });
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
      if (!validateSocialLink(this.currentLink.platform, this.currentLink.profileUrl)) {
        alert(`Please enter a valid ${this.currentLink.platform} URL.`);
        return;
      }
      this.savedSocialLinks.push({ ...this.currentLink });
      this.currentLink = { platform: '', profileUrl: '' };
    }
  }

  removeSocialLink(index: number): void {
    this.savedSocialLinks.splice(index, 1);
  }

  openEditModal(index: number): void {
    this.editingLinkIndex = index;
    this.editingLinkData = { ...this.savedSocialLinks[index] };
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.editingLinkIndex = -1;
  }

  updateSocialLink(): void {
    if (this.editingLinkIndex > -1) {
      if (!validateSocialLink(this.editingLinkData.platform, this.editingLinkData.profileUrl)) {
        alert(`Please enter a valid ${this.editingLinkData.platform} URL.`);
        return;
      }
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
      const index = this.savedLanguages.findIndex(l => l.language === this.currentLanguage.language);
      if (index > -1) {
        this.savedLanguages[index].proficiency = this.currentLanguage.proficiency;
      } else {
        this.savedLanguages.push({ ...this.currentLanguage });
      }
      this.currentLanguage = { language: '', proficiency: '' };
    }
  }

  removeLanguage(index: number): void {
    this.savedLanguages.splice(index, 1);
  }

  openEditLangModal(index: number): void {
    this.editingLangIndex = index;
    this.editingLangData = { ...this.savedLanguages[index] };
    this.isEditLangModalOpen.set(true);
  }

  closeEditLangModal(): void {
    this.isEditLangModalOpen.set(false);
    this.editingLangIndex = -1;
  }

  updateLanguage(): void {
    if (this.editingLangIndex > -1) {
      this.savedLanguages[this.editingLangIndex].proficiency = this.editingLangData.proficiency;
      this.closeEditLangModal();
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
    if (!RegexPatterns.PHONE.test(fullPhone)) {
      alert('Please enter a valid phone number (e.g., +919876543210 or 9876543210).');
      return;
    }
    if (!fullPhone.startsWith('+')) {
      fullPhone = '+91' + fullPhone;
    }
    this.profileService.sendPhoneOTP(fullPhone).subscribe({
      next: (res: any) => {
        alert(res.message || 'OTP sent successfully!');
        this.otpSent.set(true);
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
        this.phoneVerified.set(true);
        this.otpSent.set(false);
        this.otpCode = '';
        this.loadProfileData();
      },
      error: (err: any) => {
        alert(err.error?.message || 'Failed to verify OTP');
      }
    });
  }

  // BACKUP FORM STATE
  originalProfileData: any;
  originalBankData: any;

  backupData(): void {
    this.originalProfileData = this.profileForm.getRawValue();
    this.originalBankData = this.bankForm.getRawValue();
  }

  // ROLLBACK TO BACKUP
  discardChanges(): void {
    if (this.originalProfileData) {
      this.profileForm.reset(this.originalProfileData);
      this.bankForm.reset(this.originalBankData);
      alert('Changes Discarded!');
    }
  }

  // SECURE ACCOUNT DELETION
  deleteAccount(): void {
    if (this.confirmDelete && this.deleteConfirmPassword) {
      this.profileService.deleteProfile().subscribe({
        next: (res: any) => {
          alert('Account and all associated data deleted successfully! Redirecting...');
          this.confirmDelete = false;
          this.deleteConfirmPassword = '';
          this.authService.logout();
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
    if (this.activeTab() === 'security') {
      if (this.securityForm.invalid) {
        alert('Please fill out all password fields correctly. Passwords must match and be at least 8 characters long.');
        return;
      }

      const sForm = this.securityForm.getRawValue();

      const payload = {
        oldPassword: sForm.currentPassword,
        newPassword: sForm.newPassword
      };

      this.isChangingPassword.set(true);

      this.authService.changePassword(payload).subscribe({
        next: (res: any) => {
          this.isChangingPassword.set(false);
          alert('Password updated successfully! Redirecting to login...');
          this.securityForm.reset();
          this.authService.logout();
          this.router.navigate(['/account/signin']);
        },
        error: (err: any) => {
          this.isChangingPassword.set(false);
          alert(err.error?.message || 'Failed to update password');
        }
      });
      return;
    }

    if (this.activeTab() === 'profile') {
      // Build request body for profile update
      const pForm = this.profileForm.getRawValue();

      const basicInfo: any = {
        fullName: pForm.fullName,
        email: pForm.email,
        username: pForm.username,
        gender: pForm.gender,
        shortBio: pForm.bio,
        profilePhoto: this.profilePhotoUrl || ''
      };

      const location = {
        country: pForm.country,
        city: pForm.city,
        timezone: pForm.timezone
      };

      let profDetails: any = {};
      let availability: string[] = [];

      if (this.userMode === 'freelancer') {
        basicInfo.professionalHeadline = pForm.professionalHeadline;
        profDetails = {
          categories: this.selectedCategories,
          skills: this.skills
        };
        availability = [pForm.availabilityType];
      } else {
        profDetails = {
          clientType: pForm.clientType,
          website: pForm.clientType === 'Individual' ? '' : pForm.websiteUrl,
          industry: pForm.clientType === 'Individual' ? '' : pForm.industry
        };
      }

      // Validate and auto-flush any in-progress social link or language
      if (this.currentLink.platform || this.currentLink.profileUrl) {
        if (!this.currentLink.platform) {
          alert('Please select a platform for your in-progress social link.');
          return;
        }
        if (!this.currentLink.profileUrl) {
          alert('Please enter a profile URL for your selected social platform.');
          return;
        }
        if (!validateSocialLink(this.currentLink.platform, this.currentLink.profileUrl)) {
          alert(`Please enter a valid URL for ${this.currentLink.platform}.`);
          return;
        }
        this.savedSocialLinks.push({ ...this.currentLink });
        this.currentLink = { platform: '', profileUrl: '' };
      }

      if (this.currentLanguage.language || this.currentLanguage.proficiency) {
        if (!this.currentLanguage.language) {
          alert('Please select a language.');
          return;
        }
        if (!this.currentLanguage.proficiency) {
          alert('Please select a proficiency level for the language.');
          return;
        }
        const index = this.savedLanguages.findIndex(l => l.language === this.currentLanguage.language);
        if (index > -1) {
          this.savedLanguages[index].proficiency = this.currentLanguage.proficiency;
        } else {
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
      localStorage.setItem('th_notif_prefs', JSON.stringify(this.notificationForm.getRawValue()));
      alert('Notification settings saved successfully!');
      this.backupData();
    }
  }

  // PAYMENT AGREEMENT HANDLERS
  saveBankDetails(): void {
    if (this.bankForm.valid) {
      this.bankAccountLinked.set(true);
      this.bankVerificationStatus = 'pending';
      const bForm = this.bankForm.getRawValue();
      const payload = {
        paymentDetails: {
          bankName: bForm.bankName,
          holderName: bForm.holderName,
          accountNumber: bForm.accountNumber,
          ifsc: bForm.ifsc,
          status: 'pending',
          verified: false
        }
      };
      this.profileService.updateProfile(payload).subscribe({
        next: (res: any) => {
          alert('Bank account details saved. Status: Pending Verification.');
          this.backupData();
        },
        error: (err: any) => {
          alert('Failed to save bank details.');
        }
      });
    } else {
      alert('Please fill out all bank account fields.');
    }
  }

  verifyBankDetails(): void {
    this.bankAccountVerified.set(true);
    this.bankVerificationStatus = 'verified';
    const bForm = this.bankForm.getRawValue();
    const payload = {
      paymentDetails: {
        bankName: bForm.bankName,
        holderName: bForm.holderName,
        accountNumber: bForm.accountNumber,
        ifsc: bForm.ifsc,
        status: 'verified',
        verified: true,
        legalityAccepted: true
      }
    };
    this.profileService.updateProfile(payload).subscribe({
      next: (res: any) => {
        alert('Bank account verification successful! Deposit/Withdrawal panels unlocked.');
        this.backupData();
      },
      error: (err: any) => {
        alert('Failed to verify bank details.');
      }
    });
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
