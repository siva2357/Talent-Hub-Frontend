import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [Login],
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

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an empty and invalid form', () => {
    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.controls.email.value).toBe('');
    expect(component.loginForm.controls.password.value).toBe('');
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  describe('Form Validation', () => {
    it('should validate email requirements and format', () => {
      const emailCtrl = component.loginForm.controls.email;

      emailCtrl.setValue('');
      expect(emailCtrl.hasError('required')).toBeTrue();

      emailCtrl.setValue('invalid-email');
      expect(emailCtrl.hasError('email')).toBeTrue();

      emailCtrl.setValue('test@example.com');
      expect(emailCtrl.valid).toBeTrue();
    });

    it('should validate password pattern requirements', () => {
      const passwordCtrl = component.loginForm.controls.password;

      passwordCtrl.setValue('');
      expect(passwordCtrl.hasError('required')).toBeTrue();

      passwordCtrl.setValue('weakpass');
      expect(passwordCtrl.hasError('pattern')).toBeTrue();

      passwordCtrl.setValue('Pass1234');
      expect(passwordCtrl.hasError('pattern')).toBeTrue();

      passwordCtrl.setValue('Valid@123');
      expect(passwordCtrl.valid).toBeTrue();
    });

    it('should correctly return validation state', () => {
      const emailCtrl = component.loginForm.controls.email;

      expect(component.getValidationState('email')).toBe('none');

      emailCtrl.markAsTouched();
      emailCtrl.setValue('');
      expect(component.getValidationState('email')).toBe('error');

      emailCtrl.setValue('user@example.com');
      expect(component.getValidationState('email')).toBe('success');
    });

    it('should correctly return appropriate error messages', () => {
      const emailCtrl = component.loginForm.controls.email;
      const passwordCtrl = component.loginForm.controls.password;

      expect(component.getErrorMessage('email')).toBe('');

      emailCtrl.markAsTouched();
      emailCtrl.setValue('');
      expect(component.getErrorMessage('email')).toBe('Email is required');

      emailCtrl.setValue('bad-email');
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');

      passwordCtrl.markAsTouched();
      passwordCtrl.setValue('');
      expect(component.getErrorMessage('password')).toBe('Password is required');

      passwordCtrl.setValue('weak');
      expect(component.getErrorMessage('password')).toBe(
        'Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special character'
      );

      passwordCtrl.setValue('Valid@123');
      expect(component.getErrorMessage('password')).toBe('');
    });
  });

  describe('Login Submission', () => {
    it('should not submit if form is invalid and mark controls as touched', () => {
      expect(component.loginForm.invalid).toBeTrue();

      component.login();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
      expect(component.loginForm.controls.email.touched).toBeTrue();
      expect(component.loginForm.controls.password.touched).toBeTrue();
    });

    it('should call authService.login and navigate to /dashboard for admin', () => {
      component.loginForm.setValue({
        email: 'admin@example.com',
        password: 'AdminPassword@123'
      });

      authServiceSpy.login.and.returnValue(of({
        success: true,
        role: 'admin',
        profileCompleted: false
      } as any));

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.login).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'AdminPassword@123'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to /profile-form if role is client/freelancer and profile is incomplete', () => {
      component.loginForm.setValue({
        email: 'client@example.com',
        password: 'ClientPassword@123'
      });

      authServiceSpy.login.and.returnValue(of({
        success: true,
        role: 'client',
        profileCompleted: false
      } as any));

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/profile-form']);
    });

    it('should navigate to /dashboard if role is non-admin and profile is completed', () => {
      component.loginForm.setValue({
        email: 'freelancer@example.com',
        password: 'FreelancerPassword@123'
      });

      authServiceSpy.login.and.returnValue(of({
        success: true,
        role: 'freelancer',
        profileCompleted: true
      } as any));

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle unsuccessfull response (success: false)', () => {
      component.loginForm.setValue({
        email: 'user@example.com',
        password: 'UserPassword@123'
      });

      authServiceSpy.login.and.returnValue(of({
        success: false,
        message: 'Invalid email or password'
      } as any));

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Invalid email or password');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle default error message when response.success is false without message', () => {
      component.loginForm.setValue({
        email: 'user@example.com',
        password: 'UserPassword@123'
      });

      authServiceSpy.login.and.returnValue(of({
        success: false
      } as any));

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Login failed.');
    });

    it('should handle HTTP error with backend message', () => {
      component.loginForm.setValue({
        email: 'user@example.com',
        password: 'UserPassword@123'
      });

      authServiceSpy.login.and.returnValue(
        throwError(() => ({ error: { message: 'Account locked' } }))
      );

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Account locked');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle HTTP error with fallback message', () => {
      component.loginForm.setValue({
        email: 'user@example.com',
        password: 'UserPassword@123'
      });

      authServiceSpy.login.and.returnValue(throwError(() => new Error('Network error')));

      component.login();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Login failed. Please check your credentials.');
    });
  });
});
