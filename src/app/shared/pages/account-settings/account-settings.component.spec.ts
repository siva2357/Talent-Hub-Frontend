import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountSettingsComponent } from './account-settings.component';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent;
  let fixture: ComponentFixture<AccountSettingsComponent>;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getMyProfile', 'updateProfile']);
    mockAuthService = {
      currentUser: signal({ role: 'Freelancer', email: 'test@test.com' }),
      logout: jasmine.createSpy('logout'),
      changePassword: jasmine.createSpy('changePassword').and.returnValue(of({ success: true }))
    };

    mockProfileService.getMyProfile.and.returnValue(of({
      success: true,
      user: { id: 1, name: 'Test User' },
      profile: { id: 1 } as any,
      contracts: []
    }));

    await TestBed.configureTestingModule({
      imports: [AccountSettingsComponent],
      providers: [
        provideRouter([]),
        { provide: ProfileService, useValue: mockProfileService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
