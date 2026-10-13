import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { OtpVerification } from './otp-verification';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OtpVerification', () => {
  let component: OtpVerification;
  let fixture: ComponentFixture<OtpVerification>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({
      email: 'user@example.com',
      type: 'register'
    });

    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'resendOtp',
      'verifyOtp',
      'verifyResetOtp'
    ]);

    await TestBed.configureTestingModule({
      imports: [OtpVerification],
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

    fixture = TestBed.createComponent(OtpVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization and Query Params', () => {
    it('should initialize with email and type from query params', () => {
      expect(component.email).toBe('user@example.com');
      expect(component.verificationType).toBe('register');
      expect(component.countdown).toBe(45);
    });

    it('should redirect to /login if email is missing', () => {
      queryParamsSubject.next({});
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should format time correctly', () => {
      expect(component.formatTime(45)).toBe('00:45');
      expect(component.formatTime(5)).toBe('00:05');
      expect(component.formatTime(65)).toBe('01:05');
    });

    it('should decrement countdown timer over time', fakeAsync(() => {
      component.startTimer();
      expect(component.countdown).toBe(45);

      tick(1000);
      expect(component.countdown).toBe(44);

      tick(44000);
      expect(component.countdown).toBe(0);

      // Verify timer stops at 0
      tick(2000);
      expect(component.countdown).toBe(0);
    }));
  });

  describe('Resend OTP', () => {
    it('should not resend OTP if countdown is still running', () => {
      const dummyEvent = new MouseEvent('click');
      spyOn(dummyEvent, 'preventDefault');
      component.countdown = 30;

      component.resendOtp(dummyEvent);

      expect(dummyEvent.preventDefault).toHaveBeenCalled();
      expect(authServiceSpy.resendOtp).not.toHaveBeenCalled();
    });

    it('should resend OTP when countdown is 0 and handle success', () => {
      const dummyEvent = new MouseEvent('click');
      component.countdown = 0;
      component.otpDigits = ['1', '2', '3', '4', '5', '6'];

      authServiceSpy.resendOtp.and.returnValue(of({ success: true } as any));

      component.resendOtp(dummyEvent);

      expect(authServiceSpy.resendOtp).toHaveBeenCalledWith({ email: 'user@example.com' });
      expect(component.isResending).toBeFalse();
      expect(component.otpDigits).toEqual(['', '', '', '', '', '']);
      expect(component.countdown).toBe(45);
    });

    it('should handle resend OTP error', () => {
      const dummyEvent = new MouseEvent('click');
      component.countdown = 0;

      authServiceSpy.resendOtp.and.returnValue(throwError(() => ({
        error: { message: 'Too many requests' }
      })));

      component.resendOtp(dummyEvent);

      expect(component.isResending).toBeFalse();
      expect(component.errorMessage).toBe('Too many requests');
    });
  });

  describe('OTP Input Navigation Helpers', () => {
    it('should advance to next input onOtpInput when character entered', () => {
      const nextInput = document.createElement('input');
      spyOn(nextInput, 'focus');

      const currentInput = document.createElement('input');
      Object.defineProperty(currentInput, 'value', { value: '5' });
      Object.defineProperty(currentInput, 'nextElementSibling', { value: nextInput });

      component.onOtpInput({ target: currentInput }, 2);

      expect(nextInput.focus).toHaveBeenCalled();
    });

    it('should focus previous input onOtpKeyDown on Backspace when empty', () => {
      const prevInput = document.createElement('input');
      spyOn(prevInput, 'focus');

      const currentInput = document.createElement('input');
      Object.defineProperty(currentInput, 'previousElementSibling', { value: prevInput });

      component.otpDigits[2] = '';
      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      Object.defineProperty(event, 'target', { value: currentInput });

      component.onOtpKeyDown(event, 2);

      expect(prevInput.focus).toHaveBeenCalled();
    });
  });

  describe('Verify OTP', () => {
    it('should show error if OTP has fewer than 6 digits', () => {
      component.otpDigits = ['1', '2', '3', '', '', ''];
      component.verify();

      expect(component.errorMessage).toBe('Please enter all 6 digits of the OTP.');
      expect(authServiceSpy.verifyOtp).not.toHaveBeenCalled();
      expect(authServiceSpy.verifyResetOtp).not.toHaveBeenCalled();
    });

    it('should verify registration OTP and navigate to /account-verification on success', () => {
      component.verificationType = 'register';
      component.otpDigits = ['1', '2', '3', '4', '5', '6'];

      authServiceSpy.verifyOtp.and.returnValue(of({ success: true } as any));

      component.verify();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.verifyOtp).toHaveBeenCalledWith({
        email: 'user@example.com',
        otp: '123456'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/account-verification'], {
        queryParams: { status: 'success' }
      });
    });

    it('should handle registration OTP error and redirect with error params', () => {
      component.verificationType = 'register';
      component.otpDigits = ['1', '2', '3', '4', '5', '6'];

      authServiceSpy.verifyOtp.and.returnValue(throwError(() => ({
        error: { message: 'OTP expired' }
      })));

      component.verify();

      expect(component.isLoading).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/account-verification'], {
        queryParams: { status: 'error', message: 'OTP expired', email: 'user@example.com' }
      });
    });

    it('should verify forgot-password OTP and navigate to /reset-password on success', () => {
      component.verificationType = 'forgot-password';
      component.otpDigits = ['6', '5', '4', '3', '2', '1'];

      authServiceSpy.verifyResetOtp.and.returnValue(of({ success: true } as any));

      component.verify();

      expect(component.isLoading).toBeFalse();
      expect(authServiceSpy.verifyResetOtp).toHaveBeenCalledWith({
        email: 'user@example.com',
        otp: '654321'
      });
      expect(router.navigate).toHaveBeenCalledWith(['/reset-password'], {
        queryParams: { email: 'user@example.com', otp: '654321' }
      });
    });

    it('should handle forgot-password OTP error', () => {
      component.verificationType = 'forgot-password';
      component.otpDigits = ['6', '5', '4', '3', '2', '1'];

      authServiceSpy.verifyResetOtp.and.returnValue(throwError(() => ({
        error: { message: 'Invalid OTP' }
      })));

      component.verify();

      expect(component.isLoading).toBeFalse();
      expect(component.errorMessage).toBe('Invalid OTP');
    });
  });
});
