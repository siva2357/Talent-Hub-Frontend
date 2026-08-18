import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerification implements OnInit {
  email: string = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        // If no email, redirect back to login
        this.router.navigate(['/login']);
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

    this.authService.verifyOtp({ email: this.email, otp }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/account-verification'], { queryParams: { status: 'success' } });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.router.navigate(['/account-verification'], { queryParams: { status: 'error', message: err.error?.message } });
      }
    });
  }
}
