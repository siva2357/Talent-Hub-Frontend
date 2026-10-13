import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/enums/role.enum';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let mockActivatedRoute: any;

  const createComponentWithRole = async (roleParam: string | null) => {
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: convertToParamMap(roleParam ? { role: roleParam } : {})
      }
    };

    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Role Initialization', () => {
    it('should set role to Client when query param is client', async () => {
      await createComponentWithRole('client');
      expect(component.role).toBe(UserRole.Client);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should set role to Freelancer when query param is freelancer', async () => {
      await createComponentWithRole('freelancer');
      expect(component.role).toBe(UserRole.Freelancer);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to /signup when role param is missing or invalid', async () => {
      await createComponentWithRole('invalid-role');
      expect(component.role).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/signup']);
    });
  });

  describe('Form Validation & Error Messages', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should initialize with invalid form', () => {
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should validate fullName field', () => {
      const nameCtrl = component.registerForm.controls['fullName'];

      nameCtrl.setValue('');
      nameCtrl.markAsTouched();
      expect(nameCtrl.hasError('required')).toBeTrue();
      expect(component.getErrorMessage('fullName')).toBe('Full name is required');
      expect(component.getValidationState('fullName')).toBe('error');

      nameCtrl.setValue('Jo');
      expect(nameCtrl.hasError('minlength')).toBeTrue();
      expect(component.getErrorMessage('fullName')).toBe('Name must be at least 3 characters long');

      nameCtrl.setValue('John Doe');
      expect(nameCtrl.valid).toBeTrue();
      expect(component.getValidationState('fullName')).toBe('success');
    });

    it('should validate email field', () => {
      const emailCtrl = component.registerForm.controls['email'];

      emailCtrl.setValue('');
      emailCtrl.markAsTouched();
      expect(emailCtrl.hasError('required')).toBeTrue();
      expect(component.getErrorMessage('email')).toBe('Email is required');

      emailCtrl.setValue('invalid-email');
      expect(emailCtrl.hasError('email')).toBeTrue();
      expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');

      emailCtrl.setValue('user@example.com');
      expect(emailCtrl.valid).toBeTrue();
    });

    it('should validate password field', () => {
      const passCtrl = component.registerForm.controls['password'];

      passCtrl.setValue('');
      passCtrl.markAsTouched();
      expect(passCtrl.hasError('required')).toBeTrue();
      expect(component.getErrorMessage('password')).toBe('Password is required');

      passCtrl.setValue('weak');
      expect(passCtrl.hasError('pattern')).toBeTrue();
      expect(component.getErrorMessage('password')).toBe(
        'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character'
      );

      passCtrl.setValue('Secure@123');
      expect(passCtrl.valid).toBeTrue();
    });

    it('should return none for untouched or unknown fields', () => {
      expect(component.getValidationState('fullName')).toBe('none');
      expect(component.getValidationState('unknownField')).toBe('none');
      expect(component.getErrorMessage('unknownField')).toBe('');
    });
  });

  describe('Account Creation Submission', () => {
    beforeEach(async () => {
      await createComponentWithRole('client');
    });

    it('should not submit if form is invalid and marks controls touched', () => {
      expect(component.registerForm.invalid).toBeTrue();
      component.createAccount();

      expect(authServiceSpy.register).not.toHaveBeenCalled();
      expect(component.registerForm.controls['fullName'].touched).toBeTrue();
    });

    it('should not submit if role is missing', () => {
      component.role = null;
      component.createAccount();

      expect(component.errorMessage).toBe('Role is missing. Please restart signup.');
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should call authService.register and navigate to /otp-verification on success', () => {
      component.registerForm.setValue({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password@123'
      });

      authServiceSpy.register.and.returnValue(of({
        success: true
      } as any));

      component.createAccount();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.register).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password@123',
        role: UserRole.Client
      });
      expect(router.navigate).toHaveBeenCalledWith(['/otp-verification'], {
        queryParams: { email: 'jane@example.com' }
      });
    });

    it('should handle registration error with custom message', () => {
      component.registerForm.setValue({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password@123'
      });

      authServiceSpy.register.and.returnValue(throwError(() => ({
        error: { message: 'Email already exists' }
      })));

      component.createAccount();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Email already exists');
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should handle registration error with fallback message', () => {
      component.registerForm.setValue({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'Password@123'
      });

      authServiceSpy.register.and.returnValue(throwError(() => new Error('Unknown error')));

      component.createAccount();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Registration failed. Please try again.');
    });
  });
});
