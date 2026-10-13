import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPassword, passwordMatchValidator } from './reset-password';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({
      email: 'test@example.com',
      otp: '123456'
    });

    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    await TestBed.configureTestingModule({
      imports: [ResetPassword],
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

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Query Parameters Handling', () => {
    it('should extract email and otp from query params', () => {
      expect(component.email).toBe('test@example.com');
      expect(component.otp).toBe('123456');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to /forgot-password if email or otp is missing', () => {
      queryParamsSubject.next({});
      expect(router.navigate).toHaveBeenCalledWith(['/forgot-password']);
    });
  });

  describe('passwordMatchValidator', () => {
    it('should return null when passwords match', () => {
      const group = new FormGroup({
        newPassword: new FormControl('secret123'),
        confirmPassword: new FormControl('secret123')
      });

      const result = passwordMatchValidator(group);
      expect(result).toBeNull();
      expect(group.get('confirmPassword')?.hasError('passwordMismatch')).toBeFalse();
    });

    it('should return passwordMismatch error when passwords differ', () => {
      const group = new FormGroup({
        newPassword: new FormControl('secret123'),
        confirmPassword: new FormControl('mismatch123')
      });

      const result = passwordMatchValidator(group);
      expect(result).toEqual({ passwordMismatch: true });
      expect(group.get('confirmPassword')?.hasError('passwordMismatch')).toBeTrue();
    });
  });

  describe('Form Validation & Error Messages', () => {
    it('should validate newPassword requirements', () => {
      const newPassCtrl = component.resetPasswordForm.controls['newPassword'];

      newPassCtrl.setValue('');
      newPassCtrl.markAsTouched();
      expect(newPassCtrl.hasError('required')).toBeTrue();
      expect(component.getErrorMessage('newPassword')).toBe('This field is required.');
      expect(component.getValidationState('newPassword')).toBe('error');

      newPassCtrl.setValue('short');
      expect(newPassCtrl.hasError('minlength')).toBeTrue();
      expect(component.getErrorMessage('newPassword')).toBe('Minimum length is 8 characters.');

      newPassCtrl.setValue('ValidPassword123');
      expect(newPassCtrl.valid).toBeTrue();
      expect(component.getValidationState('newPassword')).toBe('success');
    });

    it('should validate confirmPassword mismatch', () => {
      const newPassCtrl = component.resetPasswordForm.controls['newPassword'];
      const confirmPassCtrl = component.resetPasswordForm.controls['confirmPassword'];

      newPassCtrl.setValue('ValidPassword123');
      confirmPassCtrl.setValue('DifferentPassword');
      confirmPassCtrl.markAsTouched();

      expect(component.resetPasswordForm.hasError('passwordMismatch')).toBeTrue();
      expect(component.getErrorMessage('confirmPassword')).toBe('Passwords do not match.');

      confirmPassCtrl.setValue('ValidPassword123');
      expect(component.resetPasswordForm.valid).toBeTrue();
      expect(component.getErrorMessage('confirmPassword')).toBe('');
    });

    it('should return none for untouched or unknown fields', () => {
      expect(component.getValidationState('newPassword')).toBe('none');
      expect(component.getValidationState('nonExistentField')).toBe('none');
      expect(component.getErrorMessage('nonExistentField')).toBe('');
    });
  });

  describe('resetPassword Submission', () => {
    it('should not call service if form is invalid and marks controls touched', () => {
      component.resetPassword();

      expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
      expect(component.resetPasswordForm.touched).toBeTrue();
    });

    it('should call authService.resetPassword and navigate to /login on success', () => {
      component.resetPasswordForm.setValue({
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123'
      });

      authServiceSpy.resetPassword.and.returnValue(of({ success: true } as any));

      component.resetPassword();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.resetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'NewPassword123'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle service error with error message', () => {
      component.resetPasswordForm.setValue({
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123'
      });

      authServiceSpy.resetPassword.and.returnValue(throwError(() => ({
        error: { message: 'Invalid or expired OTP' }
      })));

      component.resetPassword();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Invalid or expired OTP');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle service error with fallback message', () => {
      component.resetPasswordForm.setValue({
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123'
      });

      authServiceSpy.resetPassword.and.returnValue(throwError(() => new Error('Network error')));

      component.resetPassword();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Failed to reset password. Please try again.');
    });
  });
});
