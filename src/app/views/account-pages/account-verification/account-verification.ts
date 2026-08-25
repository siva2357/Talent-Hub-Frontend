import { Component } from '@angular/core';

import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Button } from '../../../library/ui/components/button/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [RouterLink, CommonModule, Button],
  templateUrl: './account-verification.html',
  styleUrl: './account-verification.css'
})
export class AccountVerification {
  isVerified = true;
  errorMessage = '';
  email = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      this.isVerified = params['status'] !== 'error';
      if (!this.isVerified) {
        this.errorMessage = params['message'] || 'Verification failed.';
        this.email = params['email'] || '';
      }
    });
  }

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendOtp(): void {
    if (this.email) {
      this.isLoading = true;
      this.authService.resendOtp({ email: this.email }).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/otp-verification'], { queryParams: { email: this.email } });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to resend OTP.';
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
