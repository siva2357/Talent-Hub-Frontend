import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let profileServiceSpy: jasmine.SpyObj<ProfileService>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let queryParamsSubject: BehaviorSubject<any>;

  const mockMyProfileResponse = {
    success: true,
    user: { fullName: 'Alex Rivera', role: 'Freelancer', email: 'alex@example.com' },
    profile: {
      basicInformation: { fullName: 'Alex Rivera', shortBio: 'Full Stack Engineer' },
      professionalDetails: { professionalHeadline: 'Senior Angular Engineer' }
    },
    contracts: [{ id: 'c1', status: 'Active' }],
    diaries: [
      { id: 'd1', status: 'completed' },
      { id: 'd2', status: 'completed' },
      { id: 'd3', status: 'active' }
    ],
    portfolio: [{ id: 'p1', title: 'Antigravity UI' }]
  };

  const mockPublicProfileResponse = {
    success: true,
    user: { fullName: 'Sarah Connor', role: 'Client', email: 'sarah@example.com' },
    profile: {
      basicInformation: { fullName: 'Sarah Connor', shortBio: 'Cyberdyne Systems VP' }
    },
    contracts: [],
    diaries: [],
    portfolio: []
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({});

    profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getMyProfile',
      'getProfileById'
    ]);
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getRole']);
    tokenServiceSpy.getRole.and.returnValue('freelancer');

    profileServiceSpy.getMyProfile.and.returnValue(of(structuredClone(mockMyProfileResponse)));
    profileServiceSpy.getProfileById.and.returnValue(of(structuredClone(mockPublicProfileResponse)));

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsSubject.asObservable() }
        },
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('My Profile (Default View)', () => {
    it('should load my profile when no id param in queryParams', () => {
      fixture.detectChanges();

      expect(component.isPublicView).toBeFalse();
      expect(profileServiceSpy.getMyProfile).toHaveBeenCalled();
      expect(component.userData.fullName).toBe('Alex Rivera');
      expect(component.role).toBe('freelancer');
      expect(component.contracts.length).toBe(1);
      expect(component.diaries.length).toBe(3);
      expect(component.portfolio.length).toBe(1);
      expect(component.isLoading).toBeFalse();
    });

    it('should accurately calculate freelancer metrics', () => {
      fixture.detectChanges();

      // 2 completed, 1 active -> total 3 -> jobSuccess = Math.round(2/3 * 100) = 67%
      expect(component.metrics.completed).toBe(2);
      expect(component.metrics.active).toBe(1);
      expect(component.metrics.jobSuccess).toBe(67);
      expect(component.metrics.hiringRisk).toBe('Medium'); // 67 >= 60 -> Medium
    });

    it('should assign Low risk when jobSuccess >= 85', () => {
      const highSuccessResponse = structuredClone(mockMyProfileResponse);
      highSuccessResponse.diaries = [
        { id: 'd1', status: 'completed' },
        { id: 'd2', status: 'completed' },
        { id: 'd3', status: 'completed' },
        { id: 'd4', status: 'completed' },
        { id: 'd5', status: 'completed' },
        { id: 'd6', status: 'completed' },
        { id: 'd7', status: 'completed' },
        { id: 'd8', status: 'completed' },
        { id: 'd9', status: 'completed' },
        { id: 'd10', status: 'active' }
      ]; // 9 / 10 = 90%
      profileServiceSpy.getMyProfile.and.returnValue(of(highSuccessResponse));

      fixture.detectChanges();

      expect(component.metrics.jobSuccess).toBe(90);
      expect(component.metrics.hiringRisk).toBe('Low');
    });

    it('should assign High risk when jobSuccess < 60', () => {
      const lowSuccessResponse = structuredClone(mockMyProfileResponse);
      lowSuccessResponse.diaries = [
        { id: 'd1', status: 'completed' },
        { id: 'd2', status: 'active' },
        { id: 'd3', status: 'active' }
      ]; // 1 / 3 = 33%
      profileServiceSpy.getMyProfile.and.returnValue(of(lowSuccessResponse));

      fixture.detectChanges();

      expect(component.metrics.jobSuccess).toBe(33);
      expect(component.metrics.hiringRisk).toBe('High');
    });
  });

  describe('Public Profile View', () => {
    it('should load profile by id when id param is present', () => {
      queryParamsSubject.next({ id: 'user-777' });
      fixture.detectChanges();

      expect(component.isPublicView).toBeTrue();
      expect(profileServiceSpy.getProfileById).toHaveBeenCalledWith('user-777');
      expect(component.userData.fullName).toBe('Sarah Connor');
      expect(component.role).toBe('client');
      expect(component.metrics.hiringRisk).toBe('Medium'); // 0 total -> Medium
    });
  });

  describe('Error Handling', () => {
    it('should handle profile loading error', () => {
      profileServiceSpy.getMyProfile.and.returnValue(throwError(() => new Error('Server error')));
      spyOn(console, 'error');

      fixture.detectChanges();

      expect(component.isLoading).toBeFalse();
      expect(component.error).toBe('Failed to load profile data.');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
