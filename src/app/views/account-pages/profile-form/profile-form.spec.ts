import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileForm } from './profile-form';
import { TokenService } from '../../../core/services/token.service';
import { ProfileService } from '../../../core/services/profile.service';
import { MasterDataService } from '../../../core/services/master-data.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileForm', () => {
  let component: ProfileForm;
  let fixture: ComponentFixture<ProfileForm>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let masterDataServiceSpy: jasmine.SpyObj<MasterDataService>;
  let router: Router;

  const mockMasterData = {
    Gender: [{ key: 'male', value: 'Male' }],
    CompanyTypes: [{ key: 'startup', value: 'Startup' }],
    Industries: [{ key: 'tech', value: 'Technology' }],
    Availability: [{ key: 'full_time', value: 'Full Time' }],
    SocialMediaPlatforms: [{ key: 'github', value: 'GitHub' }],
    Languages: [{ key: 'en', value: 'English' }],
    LanguageProficiency: [{ key: 'fluent', value: 'Fluent' }],
    Countries: [{ key: 'us', value: 'United States' }],
    States: [{ key: 'ca', value: 'California' }],
    Cities: [{ key: 'sf', value: 'San Francisco' }]
  };

  const createComponentWithRole = async (role: string | null) => {
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getRole']);
    tokenServiceSpy.getRole.and.returnValue(role);

    profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getMyProfile',
      'completeProfile'
    ]);
    profileServiceSpy.getMyProfile.and.returnValue(of({
      success: true,
      user: { fullName: 'John Doe', email: 'john@example.com' }
    }));
    profileServiceSpy.completeProfile.and.returnValue(of({ success: true }));

    masterDataServiceSpy = jasmine.createSpyObj('MasterDataService', ['getAllMasterData']);
    masterDataServiceSpy.getAllMasterData.and.returnValue(of({
      success: true,
      data: mockMasterData
    }));

    await TestBed.configureTestingModule({
      imports: [ProfileForm],
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: MasterDataService, useValue: masterDataServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ProfileForm);
    component = fixture.componentInstance;
    if (role !== null) {
      fixture.detectChanges();
    } else {
      component.ngOnInit();
    }
  };

  describe('Unauthenticated User', () => {
    it('should navigate to /login when tokenService returns no role', async () => {
      await createComponentWithRole(null);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Client Profile Form Initialization', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should initialize client role and form structure', () => {
      expect(component.role).toBe('client');
      expect(component.profileForm.get('professionalDetails.companyType')).toBeDefined();
      expect(component.profileForm.get('professionalDetails.website')).toBeDefined();
      expect(component.profileForm.get('professionalDetails.industry')).toBeDefined();
      expect(component.profileForm.get('professionalDetails.companyDescription')).toBeDefined();
    });

    it('should pre-fill basic information from getMyProfile', () => {
      const basicInfo = component.profileForm.get('basicInformation')?.value;
      expect(basicInfo.fullName).toBe('John Doe');
      expect(basicInfo.email).toBe('john@example.com');
    });

    it('should populate master data options', () => {
      expect(component.genderOptions.length).toBe(1);
      expect(component.genderOptions[0]).toEqual({ label: 'Male', value: 'male' });
      expect(component.companyTypeOptions.length).toBe(1);
      expect(component.industryOptions.length).toBe(1);
    });

    it('should generate proper timeline steps for client', () => {
      const steps = component.timelineSteps;
      expect(steps[0].title).toBe('Basic information');
      expect(steps[0].status).toBe('active');
      expect(steps[1].title).toBe('Company Information');
    });
  });

  describe('Freelancer Profile Form Initialization', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should initialize freelancer specific professional fields', () => {
      expect(component.role).toBe('freelancer');
      expect(component.profileForm.get('professionalDetails.professionalHeadline')).toBeDefined();
      expect(component.profileForm.get('professionalDetails.skills')).toBeDefined();
      expect(component.profileForm.get('professionalDetails.technologies')).toBeDefined();
      expect(component.profileForm.get('professionalDetails.availability')).toBeDefined();
    });

    it('should generate proper timeline steps for freelancer', () => {
      const steps = component.timelineSteps;
      expect(steps[1].title).toBe('Professional information');
    });
  });

  describe('Step Navigation', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should increment step with nextStep up to step 4', () => {
      expect(component.currentStep).toBe(1);

      component.nextStep();
      expect(component.currentStep).toBe(2);

      component.nextStep();
      expect(component.currentStep).toBe(3);

      component.nextStep();
      expect(component.currentStep).toBe(4);

      component.nextStep();
      expect(component.currentStep).toBe(4); // Capped at 4
    });

    it('should decrement step with prevStep down to step 1', () => {
      component.currentStep = 3;

      component.prevStep();
      expect(component.currentStep).toBe(2);

      component.prevStep();
      expect(component.currentStep).toBe(1);

      component.prevStep();
      expect(component.currentStep).toBe(1); // Min 1
    });

    it('should handle onTimelineStepClicked', () => {
      component.currentStep = 3;

      // Allow clicking previous step (step 2, index 1)
      component.onTimelineStepClicked(1);
      expect(component.currentStep).toBe(2);

      // Block clicking future step (step 4, index 3)
      component.onTimelineStepClicked(3);
      expect(component.currentStep).toBe(2);
    });
  });

  describe('Social and Language Form Arrays', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should add and remove social links', () => {
      expect(component.socialLinks.length).toBe(0);

      component.newSocialPlatform = 'github';
      component.newSocialUrl = 'https://github.com/test';
      component.addSocial();

      expect(component.socialLinks.length).toBe(1);
      expect(component.socialLinks.at(0).value).toEqual({
        platform: 'github',
        profileUrl: 'https://github.com/test'
      });
      expect(component.newSocialPlatform).toBe('');
      expect(component.newSocialUrl).toBe('');

      component.removeSocial(0);
      expect(component.socialLinks.length).toBe(0);
    });

    it('should add and remove languages', () => {
      expect(component.languages.length).toBe(0);

      component.newLanguage = 'English';
      component.newProficiency = 'Fluent';
      component.addLanguage();

      expect(component.languages.length).toBe(1);
      expect(component.languages.at(0).value).toEqual({
        language: 'English',
        proficiency: 'Fluent'
      });

      component.removeLanguage(0);
      expect(component.languages.length).toBe(0);
    });

    it('should update skills from string input', () => {
      component.updateSkills('Angular, TypeScript, Jasmine');
      expect(component.profileForm.get('professionalDetails.skills')?.value).toEqual([
        'Angular',
        'TypeScript',
        'Jasmine'
      ]);
    });

    it('should update technologies from event target value', () => {
      component.updateTechnologies({ target: { value: 'Node, Express, MongoDB' } });
      expect(component.profileForm.get('professionalDetails.technologies')?.value).toEqual([
        'Node',
        'Express',
        'MongoDB'
      ]);
    });
  });

  describe('Photo Upload & Edit Actions', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should set photo on upload complete', () => {
      component.onUploadComplete('https://cdn.example.com/avatar.jpg');
      expect(component.profileForm.get('basicInformation.profilePhoto')?.value).toBe(
        'https://cdn.example.com/avatar.jpg'
      );
      expect(component.previewUrl).toBeNull();
    });

    it('should handle upload error', () => {
      component.onUploadError('File size exceeds limit');
      expect(component.errorMessage).toBe('File size exceeds limit');
      expect(component.previewUrl).toBeNull();
    });

    it('should clear photo on edit photo', () => {
      component.profileForm.get('basicInformation.profilePhoto')?.setValue('existing.jpg');
      component.onEditPhoto();
      expect(component.profileForm.get('basicInformation.profilePhoto')?.value).toBe('');
      expect(component.previewUrl).toBeNull();
    });
  });

  describe('Profile Submission', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should submit profile and change to success step 5', () => {
      component.submitProfile();

      expect(component.isLoading).toBeFalse();
      expect(profileServiceSpy.completeProfile).toHaveBeenCalled();
      expect(component.currentStep).toBe(5);
    });

    it('should handle profile submit error', () => {
      profileServiceSpy.completeProfile.and.returnValue(throwError(() => ({
        error: { message: 'Submission failed' }
      })));

      component.submitProfile();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Submission failed');
    });

    it('should navigate to /dashboard when goToDashboard is called', () => {
      component.goToDashboard();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Validation State & Error Messages', () => {
    beforeEach(async () => {
      await createComponentWithRole('freelancer');
    });

    it('should return none validation state for untouched fields', () => {
      expect(component.getValidationState('fullName')).toBe('none');
    });

    it('should return correct error message for empty required field', () => {
      const nameCtrl = component.profileForm.get('basicInformation.fullName');
      nameCtrl?.setValue('');
      nameCtrl?.markAsTouched();

      expect(component.getValidationState('fullName')).toBe('error');
      expect(component.getErrorMessage('fullName')).toBe('Full Name is required');
    });
  });
});
