import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountVerification } from './account-verification';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AccountVerification', () => {
  let component: AccountVerification;
  let fixture: ComponentFixture<AccountVerification>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({
      status: 'success'
    });

    authServiceSpy = jasmine.createSpyObj('AuthService', ['resendOtp']);

    await TestBed.configureTestingModule({
      imports: [AccountVerification],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsSubject.asObservable() }
        },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(AccountVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component with verified status', () => {
    expect(component).toBeTruthy();
    expect(component.isVerified).toBeTrue();
    expect(component.errorMessage).toBe('');
  });

  it('should handle error status from query params', () => {
    queryParamsSubject.next({
      status: 'error',
      message: 'Token expired',
      email: 'user@example.com'
    });

    expect(component.isVerified).toBeFalse();
    expect(component.errorMessage).toBe('Token expired');
    expect(component.email).toBe('user@example.com');
  });

  it('should use default error message if error message query param is omitted', () => {
    queryParamsSubject.next({
      status: 'error',
      email: 'user@example.com'
    });

    expect(component.isVerified).toBeFalse();
    expect(component.errorMessage).toBe('Verification failed.');
  });

  it('should navigate to /login when continueToLogin is called', () => {
    component.continueToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  describe('resendOtp', () => {
    it('should navigate to /login if email is not present', () => {
      component.email = '';
      component.resendOtp();

      expect(authServiceSpy.resendOtp).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call authService.resendOtp and navigate to /otp-verification on success', () => {
      component.email = 'user@example.com';
      authServiceSpy.resendOtp.and.returnValue(of({ success: true } as any));

      component.resendOtp();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.resendOtp).toHaveBeenCalledWith({ email: 'user@example.com' });
      expect(router.navigate).toHaveBeenCalledWith(['/otp-verification'], {
        queryParams: { email: 'user@example.com' }
      });
    });

    it('should handle resend OTP error with backend error message', () => {
      component.email = 'user@example.com';
      authServiceSpy.resendOtp.and.returnValue(throwError(() => ({
        error: { message: 'Too many requests. Please wait.' }
      })));

      component.resendOtp();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Too many requests. Please wait.');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle resend OTP error with fallback error message', () => {
      component.email = 'user@example.com';
      authServiceSpy.resendOtp.and.returnValue(throwError(() => new Error('Server offline')));

      component.resendOtp();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Failed to resend OTP.');
    });
  });
});
