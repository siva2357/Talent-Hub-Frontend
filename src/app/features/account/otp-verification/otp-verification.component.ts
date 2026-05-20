import { Component, inject, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, FormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OtpVerificationComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otp: string[] = ['', '', '', '', '', ''];
  mode: 'register' | 'forgot' = 'register';
  email: string = '';
  role: string = '';
  isLoading = false;
  verificationError: string | null = null;
  resendSuccessMessage: string | null = null;

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'register';
      this.email = params['email'] || '';
      this.role = params['role'] || '';
    });
  }

  onKeyUp(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Move focus forward if a digit is entered
    if (value && /^[0-9]$/.test(value)) {
      if (index < 5) {
        const nextInput = this.otpInputs.toArray()[index + 1].nativeElement as HTMLInputElement;
        nextInput.focus();
        nextInput.select();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    // Move focus backward on backspace if current is empty
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      if (!input.value && index > 0) {
        const prevInput = this.otpInputs.toArray()[index - 1].nativeElement as HTMLInputElement;
        prevInput.focus();
        prevInput.select();
      }
    }
  }

  onResend(): void {
    if (!this.email) {
      this.verificationError = 'Email address is missing.';
      return;
    }

    this.isLoading = true;
    this.verificationError = null;
    this.resendSuccessMessage = null;

    if (this.mode === 'forgot') {
      this.authService.forgotPassword({ email: this.email }).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.resendSuccessMessage = 'OTP code has been resent to your email.';
        },
        error: (err) => {
          this.isLoading = false;
          this.verificationError = err.error?.message || 'Failed to resend OTP.';
        }
      });
    } else {
      this.isLoading = false;
      this.verificationError = 'For registration, please return and register again to request a new verification code.';
    }
  }

  onVerify(): void {
    const otpCode = this.otp.join('');
    if (otpCode.length !== 6) {
      this.verificationError = 'Please enter all 6 digits of the OTP code.';
      return;
    }

    this.isLoading = true;
    this.verificationError = null;
    this.resendSuccessMessage = null;

    if (this.mode === 'forgot') {
      this.authService.verifyResetOTP({ email: this.email, otp: otpCode }).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['/account/reset-password'], {
            queryParams: { email: this.email, otp: otpCode }
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.verificationError = err.error?.message || 'OTP verification failed.';
        }
      });
    } else {
      this.authService.verifyOTP({ email: this.email, otp: otpCode }).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['/account/confirmation'], {
            queryParams: { role: this.role }
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.verificationError = err.error?.message || 'OTP verification failed.';
        }
      });
    }
  }
}
