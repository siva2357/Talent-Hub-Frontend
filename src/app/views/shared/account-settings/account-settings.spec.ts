import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AccountSettings, passwordMatchValidator } from './account-settings';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';
import { AuthService } from '../../../core/services/auth.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccountSettings', () => {
  let component: AccountSettings;
  let fixture: ComponentFixture<AccountSettings>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let masterDataServiceSpy: jasmine.SpyObj<MasterDataService>;
  let router: Router;

  const mockProfile = {
    basicInformation: {
      profilePhoto: 'https://cdn.example.com/photo.jpg',
      fullName: 'Bruce Wayne',
      email: 'bruce@wayne.com',
      phoneNumber: '+1234567890',
      gender: 'Male',
      shortBio: 'Billionaire philanthropist'
    },
    professionalDetails: {
      companyType: 'Enterprise',
      website: 'https://wayne.com',
      industry: 'Defense',
      companyDescription: 'High tech enterprise'
    },
    location: {
      city: 'Gotham',
      state: 'New Jersey',
      country: 'USA'
    },
    socialLinks: [
      { platform: 'Twitter', profileUrl: 'https://twitter.com/wayne' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' }
    ]
  };

  const mockMasterData = {
    Gender: [{ key: 'm', value: 'Male' }],
    CompanyTypes: [{ key: 'ent', value: 'Enterprise' }],
    Industries: [{ key: 'def', value: 'Defense' }],
    Availability: [{ key: 'ft', value: 'Full Time' }],
    SocialMediaPlatforms: [{ key: 'tw', value: 'Twitter' }],
    Languages: [{ key: 'en', value: 'English' }],
    LanguageProficiency: [{ key: 'nat', value: 'Native' }],
    Countries: [{ key: 'us', value: 'USA' }],
    States: [{ key: 'nj', value: 'New Jersey' }],
    Cities: [{ key: 'got', value: 'Gotham' }],
    ContractTypes: [{ key: 'fixed', value: 'Fixed Price' }]
  };

  const createComponentWithRole = async (role: string) => {
    profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getMyProfile',
      'updateProfile',
      'deleteProfile'
    ]);
    tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'getRole',
      'clearAll'
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'changePassword',
      'logout'
    ]);
    masterDataServiceSpy = jasmine.createSpyObj('MasterDataService', [
      'getAllMasterData'
    ]);

    tokenServiceSpy.getRole.and.returnValue(role);
    profileServiceSpy.getMyProfile.and.returnValue(of({
      success: true,
      user: { fullName: 'Bruce Wayne', email: 'bruce@wayne.com', role },
      profile: structuredClone(mockProfile)
    }));
    masterDataServiceSpy.getAllMasterData.and.returnValue(of({
      success: true,
      data: mockMasterData
    }));

    await TestBed.configureTestingModule({
      imports: [AccountSettings],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MasterDataService, useValue: masterDataServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(AccountSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Initialization (Client Role)', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should create the component and load client profile data', () => {
      expect(component).toBeTruthy();
      expect(component.role).toBe('client');
      expect(component.isLoading).toBeFalse();
      expect(component.accountSettingsForm.get('basicInformation.fullName')?.value).toBe('Bruce Wayne');
      expect(component.accountSettingsForm.get('professionalDetails.companyType')?.value).toBe('Enterprise');
      expect(component.socialLinks.length).toBe(1);
      expect(component.languages.length).toBe(1);
    });

    it('should populate master data options', () => {
      expect(component.genderOptions.length).toBe(1);
      expect(component.companyTypeOptions.length).toBe(1);
      expect(component.industryOptions.length).toBe(1);
    });

    it('should navigate to dashboard on goBack', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should switch tabs', () => {
      expect(component.activeTab).toBe('profile');
      component.setTab('security');
      expect(component.activeTab).toBe('security');
    });
  });

  describe('Initialization (Freelancer Role)', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should apply freelancer validation rules', () => {
      expect(component.role).toBe('freelancer');
      const profDetails = component.accountSettingsForm.get('professionalDetails');
      expect(profDetails?.get('professionalHeadline')?.validator).toBeDefined();
      expect(profDetails?.get('skills')?.validator).toBeDefined();
    });
  });

  describe('FormArray Operations', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should add and remove social links', () => {
      expect(component.socialLinks.length).toBe(1);

      component.addSocialLink('GitHub', 'https://github.com/wayne');
      expect(component.socialLinks.length).toBe(2);

      component.removeSocialLink(0);
      expect(component.socialLinks.length).toBe(1);
      expect(component.socialLinks.at(0).value.platform).toBe('GitHub');
    });

    it('should add and remove languages', () => {
      expect(component.languages.length).toBe(1);

      component.addLanguage('Spanish', 'Conversational');
      expect(component.languages.length).toBe(2);

      component.removeLanguage(0);
      expect(component.languages.length).toBe(1);
      expect(component.languages.at(0).value.language).toBe('Spanish');
    });
  });

  describe('File Handling', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should handle file selection and preview', () => {
      const mockFile = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
      component.onFileSelected(mockFile);

      expect(component.accountSettingsForm.get('basicInformation.profilePhotoFile')?.value).toBe(mockFile);
    });

    it('should clear file on remove', () => {
      component.onFileRemoved();

      expect(component.accountSettingsForm.get('basicInformation.profilePhotoFile')?.value).toBeNull();
      expect(component.accountSettingsForm.get('basicInformation.profilePhoto')?.value).toBe('');
    });
  });

  describe('passwordMatchValidator', () => {
    it('should return null when passwords match', () => {
      const group = new FormGroup({
        newPassword: new FormControl('Pass123!'),
        confirmPassword: new FormControl('Pass123!')
      });

      expect(passwordMatchValidator(group)).toBeNull();
    });

    it('should return error when passwords mismatch', () => {
      const group = new FormGroup({
        newPassword: new FormControl('Pass123!'),
        confirmPassword: new FormControl('Different123!')
      });

      expect(passwordMatchValidator(group)).toEqual({ passwordMismatch: true });
    });
  });

  describe('Validation Helpers', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should return validation state and messages for basic fields', () => {
      const nameCtrl = component.accountSettingsForm.get('basicInformation.fullName');
      nameCtrl?.setValue('');
      nameCtrl?.markAsTouched();

      expect(component.getValidationState('basicInformation', 'fullName')).toBe('error');
      expect(component.getErrorMessage('basicInformation', 'fullName')).toBe('This field is required.');
    });

    it('should return validation state and messages for password fields', () => {
      const newPassCtrl = component.changePasswordForm.get('newPassword');
      newPassCtrl?.setValue('short');
      newPassCtrl?.markAsTouched();

      expect(component.getPasswordValidationState('newPassword')).toBe('error');
      expect(component.getPasswordErrorMessage('newPassword')).toBe('Minimum length is 8 characters.');
    });

    it('should return validation state and messages for array controls', () => {
      component.socialLinks.at(0).get('platform')?.setValue('');
      component.socialLinks.at(0).get('platform')?.markAsTouched();

      expect(component.getArrayValidationState('socialLinks', 0, 'platform')).toBe('error');
      expect(component.getArrayErrorMessage('socialLinks', 0, 'platform')).toBe('Required.');
    });
  });

  describe('Save Profile Changes', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
      spyOn(window, 'alert');
    });

    it('should alert if accountSettingsForm is invalid', () => {
      component.accountSettingsForm.get('basicInformation.fullName')?.setValue('');

      component.saveProfileChanges();

      expect(profileServiceSpy.updateProfile).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Please correct the validation errors before submitting.');
    });

    it('should update profile and alert on success', () => {
      profileServiceSpy.updateProfile.and.returnValue(of({ success: true }));

      component.saveProfileChanges();

      expect(component.isSaving).toBeFalse();
      expect(profileServiceSpy.updateProfile).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!');
    });

    it('should handle update profile error', () => {
      profileServiceSpy.updateProfile.and.returnValue(throwError(() => new Error('Server error')));
      spyOn(console, 'error');

      component.saveProfileChanges();

      expect(component.isSaving).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith('Failed to update profile.');
    });
  });

  describe('Update Password', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
      spyOn(window, 'alert');
    });

    it('should not submit if changePasswordForm is invalid', () => {
      component.changePasswordForm.setValue({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      component.updatePassword();

      expect(authServiceSpy.changePassword).not.toHaveBeenCalled();
      expect(component.changePasswordForm.touched).toBeTrue();
    });

    it('should submit valid password change and logout on success', () => {
      component.changePasswordForm.setValue({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword2@',
        confirmPassword: 'NewPassword2@'
      });

      authServiceSpy.changePassword.and.returnValue(of({ success: true }));

      component.updatePassword();

      expect(component.isSavingPassword).toBeFalse();
      expect(authServiceSpy.changePassword).toHaveBeenCalledWith({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword2@'
      });
      expect(window.alert).toHaveBeenCalledWith('Password changed successfully. Please log in again with your new password.');
      expect(authServiceSpy.logout).toHaveBeenCalled();
    });

    it('should handle change password error', () => {
      component.changePasswordForm.setValue({
        oldPassword: 'WrongPassword',
        newPassword: 'NewPassword2@',
        confirmPassword: 'NewPassword2@'
      });

      authServiceSpy.changePassword.and.returnValue(throwError(() => ({
        error: { message: 'Incorrect old password' }
      })));

      component.updatePassword();

      expect(component.isSavingPassword).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith('Incorrect old password');
    });
  });

  describe('Delete Account', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
      spyOn(window, 'alert');
    });

    it('should not delete account if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteAccount();

      expect(profileServiceSpy.deleteProfile).not.toHaveBeenCalled();
    });

    it('should delete account, clear tokens, and redirect to /login on confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      profileServiceSpy.deleteProfile.and.returnValue(of({ success: true }));

      component.deleteAccount();

      expect(profileServiceSpy.deleteProfile).toHaveBeenCalled();
      expect(tokenServiceSpy.clearAll).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle delete account error', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      profileServiceSpy.deleteProfile.and.returnValue(throwError(() => new Error('Error')));
      spyOn(console, 'error');

      component.deleteAccount();

      expect(window.alert).toHaveBeenCalledWith('Error deleting account');
    });
  });
});
