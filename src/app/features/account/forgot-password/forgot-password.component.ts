import { RouterLink, Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegexPatterns } from '../../../core/regex/patterns';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent, FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  onSubmit(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    if (!RegexPatterns.EMAIL.test(this.email.trim())) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'OTP code sent successfully!';
        setTimeout(() => {
          this.router.navigate(['/account/otp-verification'], {
            queryParams: { mode: 'forgot', email: this.email }
          });
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to request password reset OTP. Please check your email.';
      }
    });
  }
}
