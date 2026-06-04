import { Router, ActivatedRoute } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegexPatterns } from '../../../core/regex/patterns';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [InputComponent, ButtonComponent, FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  otp: string = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.otp = params['otp'] || '';
    });
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all password fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!RegexPatterns.STRONG_PASSWORD.test(this.newPassword)) {
      this.errorMessage = 'Password must be at least 8 characters long, contain an uppercase, a lowercase, a number, and a special character.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.resetPassword({
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Password reset successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/account/signin']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password. Please check your network or try again.';
      }
    });
  }
}
