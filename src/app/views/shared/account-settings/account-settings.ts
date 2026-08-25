import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';

// UI Components
import { InputField, InputOption, InputValidation } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { FileUpload } from '../../../library/shared/components/file-upload/file-upload';
import { FilePreview } from '../../../library/shared/components/file-preview/file-preview';

export const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
    return { passwordMismatch: true };
  }

  if (confirmPassword && confirmPassword.errors && confirmPassword.errors['passwordMismatch']) {
    delete confirmPassword.errors['passwordMismatch'];
    if (!Object.keys(confirmPassword.errors).length) {
      confirmPassword.setErrors(null);
    }
  }

  return null;
};

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField, Button, FileUpload, FilePreview],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css'
})
export class AccountSettings implements OnInit {
  role: string = ''
  activeTab: string = 'profile';

  accountSettingsForm!: FormGroup;
  changePasswordForm!: FormGroup;

  userData: any = null;
  profileData: any = null;
  isLoading: boolean = true;
  error: string = '';
  isSaving: boolean = false;
  isSavingPassword: boolean = false;

  // Dropdown options
  genderOptions: InputOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  availabilityOptions: InputOption[] = [
    { label: 'Full Time (40hrs/wk)', value: 'Full Time (40hrs/wk)' },
    { label: 'Part Time (20hrs/wk)', value: 'Part Time (20hrs/wk)' },
    { label: 'As needed', value: 'As needed' }
  ];

  preferredJobTypeOptions: InputOption[] = [
    { label: 'Long-term contract', value: 'Long-term contract' },
    { label: 'Short-term project', value: 'Short-term project' },
    { label: 'Hourly work', value: 'Hourly work' }
  ];

  socialMediaPlatformOptions: InputOption[] = [
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'GitHub', value: 'GitHub' },
    { label: 'Twitter', value: 'Twitter' },
    { label: 'Portfolio Website', value: 'Portfolio Website' }
  ];

  languageOptions: InputOption[] = [
    { label: 'English', value: 'English' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'German', value: 'German' },
    { label: 'Hindi', value: 'Hindi' }
  ];

  proficiencyOptions: InputOption[] = [
    { label: 'Basic', value: 'Basic' },
    { label: 'Conversational', value: 'Conversational' },
    { label: 'Fluent', value: 'Fluent' },
    { label: 'Native or Bilingual', value: 'Native or Bilingual' }
  ];

  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() { }

  ngOnInit() {
    this.role = this.tokenService.getRole()?.toLowerCase() || '';
    this.initForms();
    this.loadProfileData();
  }

  initForms() {
    this.accountSettingsForm = this.fb.group({
      basicInformation: this.fb.group({
        profilePhoto: [''],
        profilePhotoFile: [null], // To store actual file if newly uploaded
        fullName: ['', [Validators.required]],
        email: [{ value: '', disabled: true }],
        phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9+() -]*$')]],
        gender: ['', [Validators.required]],
        shortBio: ['', [Validators.required]]
      }),
      professionalDetails: this.fb.group({
        companyType: [''],
        website: ['', [Validators.pattern('https?://.+')]],
        industry: [''],
        companyDescription: [''],
        professionalHeadline: [''],
        skills: [''],
        technologies: [''],
        availability: [''],
        preferredJobType: ['']
      }),
      location: this.fb.group({
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
      socialLinks: this.fb.array([]),
      languages: this.fb.array([])
    });

    // Make role-specific fields required
    const profDetails = this.accountSettingsForm.get('professionalDetails');
    if (this.role === 'client') {
      profDetails?.get('companyType')?.setValidators([Validators.required]);
      profDetails?.get('website')?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
      profDetails?.get('industry')?.setValidators([Validators.required]);
      profDetails?.get('companyDescription')?.setValidators([Validators.required]);
    } else {
      profDetails?.get('professionalHeadline')?.setValidators([Validators.required]);
      profDetails?.get('skills')?.setValidators([Validators.required]);
      profDetails?.get('technologies')?.setValidators([Validators.required]);
      profDetails?.get('availability')?.setValidators([Validators.required]);
      profDetails?.get('preferredJobType')?.setValidators([Validators.required]);
    }
    profDetails?.updateValueAndValidity();

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).*$')
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  get socialLinks() {
    return this.accountSettingsForm.get('socialLinks') as FormArray;
  }

  get languages() {
    return this.accountSettingsForm.get('languages') as FormArray;
  }

  addSocialLink(platform: string = '', profileUrl: string = '') {
    this.socialLinks.push(this.fb.group({
      platform: [platform, Validators.required],
      profileUrl: [profileUrl, [Validators.required, Validators.pattern('https?://.+')]]
    }));
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  addLanguage(language: string = '', proficiency: string = '') {
    this.languages.push(this.fb.group({
      language: [language, Validators.required],
      proficiency: [proficiency, Validators.required]
    }));
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  loadProfileData() {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.user;
          this.profileData = res.profile;
          this.role = this.userData.role.toLowerCase();

          // Patch form
          this.accountSettingsForm.patchValue({
            basicInformation: {
              profilePhoto: this.profileData.basicInformation?.profilePhoto,
              fullName: this.profileData.basicInformation?.fullName,
              email: this.profileData.basicInformation?.email,
              phoneNumber: this.profileData.basicInformation?.phoneNumber,
              gender: this.profileData.basicInformation?.gender,
              shortBio: this.profileData.basicInformation?.shortBio
            },
            professionalDetails: {
              ...this.profileData.professionalDetails
            },
            location: {
              ...this.profileData.location
            }
          });

          // Populate FormArrays
          this.socialLinks.clear();
          if (this.profileData.socialLinks && this.profileData.socialLinks.length > 0) {
            this.profileData.socialLinks.forEach((link: any) => {
              this.addSocialLink(link.platform, link.profileUrl);
            });
          }

          this.languages.clear();
          if (this.profileData.languages && this.profileData.languages.length > 0) {
            this.profileData.languages.forEach((lang: any) => {
              this.addLanguage(lang.language, lang.proficiency);
            });
          }
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching profile:', err);
        this.error = 'Failed to load profile data.';
        this.isLoading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  onFileSelected(file: File) {
    this.accountSettingsForm.get('basicInformation.profilePhotoFile')?.setValue(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.accountSettingsForm.get('basicInformation.profilePhoto')?.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onFileRemoved() {
    this.accountSettingsForm.get('basicInformation.profilePhotoFile')?.setValue(null);
    this.accountSettingsForm.get('basicInformation.profilePhoto')?.setValue('');
  }

  // Helper for generic validation
  getValidationState(formGroup: string, fieldName: string): InputValidation {
    const control = formGroup ? this.accountSettingsForm.get(`${formGroup}.${fieldName}`) : this.accountSettingsForm.get(fieldName);
    if (!control || !control.touched) return 'none';
    return control.valid ? 'success' : 'error';
  }

  getErrorMessage(formGroup: string, fieldName: string): string {
    const control = formGroup ? this.accountSettingsForm.get(`${formGroup}.${fieldName}`) : this.accountSettingsForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['pattern']) return 'Invalid format.';
    return 'Invalid input.';
  }

  // Helper for array validation
  getArrayValidationState(arrayName: string, index: number, fieldName: string): InputValidation {
    const array = this.accountSettingsForm.get(arrayName) as FormArray;
    const control = array.at(index)?.get(fieldName);
    if (!control || !control.touched) return 'none';
    return control.valid ? 'success' : 'error';
  }

  getArrayErrorMessage(arrayName: string, index: number, fieldName: string): string {
    const array = this.accountSettingsForm.get(arrayName) as FormArray;
    const control = array.at(index)?.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'Required.';
    if (control.errors['pattern']) return 'Invalid URL.';
    return 'Invalid input.';
  }

  // Password validation
  getPasswordValidationState(fieldName: string): InputValidation {
    const control = this.changePasswordForm.get(fieldName);
    if (!control || !control.touched) return 'none';
    return control.valid ? 'success' : 'error';
  }

  getPasswordErrorMessage(fieldName: string): string {
    const control = this.changePasswordForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['pattern']) return 'Must include at least one number and one symbol.';
    if (control.errors['passwordMismatch']) return 'Passwords do not match.';
    return 'Invalid input.';
  }

  saveProfileChanges() {
    if (this.accountSettingsForm.invalid) {
      this.accountSettingsForm.markAllAsTouched();
      alert('Please correct the validation errors before submitting.');
      return;
    }

    this.isSaving = true;

    // Create FormData
    const formData = new FormData();
    const formValue = this.accountSettingsForm.getRawValue(); // gets disabled values too

    const photoFile = formValue.basicInformation.profilePhotoFile;
    if (photoFile) {
      formData.append('profilePhoto', photoFile);
    }

    let professionalDetailsPayload: any = {};
    if (this.role === 'client') {
      professionalDetailsPayload = {
        companyType: formValue.professionalDetails.companyType,
        website: formValue.professionalDetails.website,
        industry: formValue.professionalDetails.industry,
        companyDescription: formValue.professionalDetails.companyDescription
      };
    } else {
      professionalDetailsPayload = {
        professionalHeadline: formValue.professionalDetails.professionalHeadline,
        skills: formValue.professionalDetails.skills,
        technologies: formValue.professionalDetails.technologies,
        availability: formValue.professionalDetails.availability,
        preferredJobType: formValue.professionalDetails.preferredJobType
      };
    }

    const profilePayload = {
      basicInformation: {
        fullName: formValue.basicInformation.fullName,
        email: formValue.basicInformation.email,
        phoneNumber: formValue.basicInformation.phoneNumber,
        gender: formValue.basicInformation.gender,
        shortBio: formValue.basicInformation.shortBio
      },
      professionalDetails: professionalDetailsPayload,
      location: formValue.location,
      socialLinks: formValue.socialLinks,
      languages: formValue.languages
    };

    formData.append('basicInformation', JSON.stringify(profilePayload.basicInformation));
    formData.append('professionalDetails', JSON.stringify(profilePayload.professionalDetails));
    formData.append('location', JSON.stringify(profilePayload.location));
    formData.append('socialLinks', JSON.stringify(profilePayload.socialLinks));
    formData.append('languages', JSON.stringify(profilePayload.languages));

    this.profileService.updateProfile(formData).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res.success) {
          alert('Profile updated successfully!');
          this.loadProfileData(); // Reload to reset file inputs and state
        } else {
          alert(res.message || 'Error updating profile');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error('Error updating profile:', err);
        alert('Failed to update profile.');
      }
    });
  }

  updatePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.isSavingPassword = true;
    const { oldPassword, newPassword } = this.changePasswordForm.value;

    this.authService.changePassword({ oldPassword, newPassword }).subscribe({
      next: (res: any) => {
        this.isSavingPassword = false;
        if (res.success) {
          alert('Password changed successfully. Please log in again with your new password.');
          this.changePasswordForm.reset();
          this.authService.logout();
        } else {
          alert(res.message || 'Failed to change password');
        }
      },
      error: (err: any) => {
        this.isSavingPassword = false;
        alert(err.error?.message || 'Error changing password');
      }
    });
  }

  deleteAccount() {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      this.profileService.deleteProfile().subscribe({
        next: (res: any) => {
          if (res.success) {
            this.tokenService.clearAll();
            this.router.navigate(['/login']);
          } else {
            alert('Failed to delete account');
          }
        },
        error: (err: any) => {
          console.error(err);
          alert('Error deleting account');
        }
      });
    }
  }
}
