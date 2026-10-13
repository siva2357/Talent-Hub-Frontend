import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPassword } from './forgot-password';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['forgotPassword']);

    await TestBed.configureTestingModule({
      imports: [ForgotPassword],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email and invalid state', () => {
    expect(component.forgotPasswordForm).toBeDefined();
    expect(component.forgotPasswordForm.controls['email'].value).toBe('');
    expect(component.forgotPasswordForm.invalid).toBeTrue();
  });

  describe('Form Validation', () => {
    it('should validate email requirements and pattern', () => {
      const emailCtrl = component.forgotPasswordForm.controls['email'];

      emailCtrl.setValue('');
      emailCtrl.markAsTouched();
      expect(emailCtrl.hasError('required')).toBeTrue();
      expect(component.getErrorMessage('email')).toBe('Please enter your email address.');
      expect(component.getValidationState('email')).toBe('error');

      emailCtrl.setValue('invalid-email-address');
      expect(emailCtrl.hasError('pattern')).toBeTrue();
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email address.');

      emailCtrl.setValue('user@domain.com');
      expect(emailCtrl.valid).toBeTrue();
      expect(component.getValidationState('email')).toBe('success');
      expect(component.getErrorMessage('email')).toBe('');
    });

    it('should return none validation state for untouched fields', () => {
      expect(component.getValidationState('email')).toBe('none');
      expect(component.getValidationState('nonExistentField')).toBe('none');
      expect(component.getErrorMessage('nonExistentField')).toBe('');
    });
  });

  describe('sendResetCode', () => {
    it('should not call service if form is invalid and marks controls touched', () => {
      component.sendResetCode();

      expect(authServiceSpy.forgotPassword).not.toHaveBeenCalled();
      expect(component.forgotPasswordForm.controls['email'].touched).toBeTrue();
    });

    it('should call authService.forgotPassword and navigate on success', () => {
      component.forgotPasswordForm.setValue({ email: 'test@example.com' });
      authServiceSpy.forgotPassword.and.returnValue(of({ success: true } as any));

      component.sendResetCode();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.forgotPassword).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(router.navigate).toHaveBeenCalledWith(['/otp-verification'], {
        queryParams: { email: 'test@example.com', type: 'forgot-password' }
      });
    });

    it('should handle service error with error message', () => {
      component.forgotPasswordForm.setValue({ email: 'test@example.com' });
      authServiceSpy.forgotPassword.and.returnValue(throwError(() => ({
        error: { message: 'Email not found' }
      })));

      component.sendResetCode();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Email not found');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle service error with fallback message', () => {
      component.forgotPasswordForm.setValue({ email: 'test@example.com' });
      authServiceSpy.forgotPassword.and.returnValue(throwError(() => new Error('Server error')));

      component.sendResetCode();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Failed to send reset code. Please try again.');
    });
  });
});
