import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getMyProfile']);
    mockAuthService = {
      currentUser: signal({ role: 'Freelancer', email: 'test@test.com' })
    };

    mockProfileService.getMyProfile.and.returnValue(of({
      success: true,
      user: { id: 1, name: 'Test User' },
      profile: { id: 1, title: 'Developer' } as any,
      contracts: [{ _id: '1', title: 'Contract 1' } as any],
      diaries: []
    }));

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: mockProfileService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch profile data on init and update signals', () => {
    expect(mockProfileService.getMyProfile).toHaveBeenCalled();
    expect(component.user()?.name).toBe('Test User');
    expect(component.profile()?.title).toBe('Developer');
    expect(component.contracts().length).toBe(1);
    expect(component.isLoading()).toBeFalse();
  });

  it('should handle error when fetching profile', () => {
    mockProfileService.getMyProfile.and.returnValue(throwError(() => new Error('Error')));
    component.getProfile();
    expect(component.isLoading()).toBeFalse();
  });

  it('should identify as freelancer if role is Freelancer', () => {
    expect(component.isFreelancer()).toBeTrue();
    expect(component.isClient()).toBeFalse();
  });

  it('should identify as client if role is Client', () => {
    mockAuthService.currentUser.set({ role: 'Client' });
    fixture.detectChanges();
    expect(component.isClient()).toBeTrue();
    expect(component.isFreelancer()).toBeFalse();
  });

  it('should open and close portfolio detail', () => {
    const item = { title: 'Test Item' };
    component.openPortfolioDetail(item);
    expect(component.selectedPortfolioItem()).toEqual(item);

    component.closePortfolioDetail();
    expect(component.selectedPortfolioItem()).toBeNull();
  });
});
