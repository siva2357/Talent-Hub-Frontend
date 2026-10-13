import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, Button],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerification implements OnInit, OnDestroy {
  email: string = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  errorMessage = '';
  isLoading = false;
  
  countdown: number = 45;
  countdownTimer: any;
  isResending = false;
  verificationType: 'register' | 'forgot-password' = 'register';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
        if (params['type']) {
          this.verificationType = params['type'];
        }
        this.startTimer();
      } else {
        // If no email, redirect back to login
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  startTimer(): void {
    this.countdown = 45;
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    
    this.countdownTimer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  resendOtp(event: Event): void {
    event.preventDefault();
    if (this.countdown > 0 || this.isResending) return;
    
    this.isResending = true;
    this.authService.resendOtp({ email: this.email }).subscribe({
      next: (res) => {
        this.isResending = false;
        if (res.success) {
          this.errorMessage = '';
          this.startTimer();
          // Clear current OTP digits
          this.otpDigits = ['', '', '', '', '', ''];
        }
      },
      error: (err) => {
        this.isResending = false;
        this.errorMessage = err.error?.message || 'Failed to resend OTP.';
      }
    });
  }

  // Handle typing in OTP inputs (auto advance)
  onOtpInput(event: any, index: number): void {
    const value = event.target.value;
    if (value && index < 5) {
      const nextInput = event.target.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  // Handle backspace to go to previous input
  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const currentInput = event.target as HTMLInputElement;
      const prevInput = currentInput.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  verify(): void {
    const otp = this.otpDigits.join('');
    if (otp.length !== 6) {
      this.errorMessage = 'Please enter all 6 digits of the OTP.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.verificationType === 'forgot-password') {
      this.authService.verifyResetOtp({ email: this.email, otp }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/reset-password'], { queryParams: { email: this.email, otp } });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Invalid OTP. Please try again.';
        }
      });
    } else {
      this.authService.verifyOtp({ email: this.email, otp }).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.router.navigate(['/account-verification'], { queryParams: { status: 'success' } });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.router.navigate(['/account-verification'], { queryParams: { status: 'error', message: err.error?.message, email: this.email } });
        }
      });
    }
  }
}
