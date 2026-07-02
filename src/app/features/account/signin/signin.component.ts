import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/DTOs/auth.dto';
import { RegexPatterns } from '../../../core/regex/patterns';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signinForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(RegexPatterns.EMAIL)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isLoading = false;
  loginError: string | null = null;

  get emailControl() {
    return this.signinForm.get('email');
  }

  get passwordControl() {
    return this.signinForm.get('password');
  }

  getEmailError(): string | null {
    if (this.emailControl?.touched && this.emailControl?.errors) {
      if (this.emailControl.errors['required']) return 'Email is required';
      if (this.emailControl.errors['pattern']) return 'Please enter a valid email address';
    }
    return null;
  }

  getPasswordError(): string | null {
    if (this.passwordControl?.touched && this.passwordControl?.errors) {
      if (this.passwordControl.errors['required']) return 'Password is required';
      if (this.passwordControl.errors['minlength']) return 'Password must be at least 8 characters long';
    }
    return null;
  }

  onSubmit(): void {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = null;

    const credentials: LoginRequest = this.signinForm.value;

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading = false;
        // Redirect user based on profile status or role
        if (user.role?.toLowerCase() === 'admin') {
          this.router.navigate(['/user/admin/dashboard']);
        } else if (!user.profileCompleted) {
          this.router.navigate(['/account/profile-form']);
        } else {
          const redirect = user.role?.toLowerCase() === 'client' ? '/user/client-dashboard' : '/user/my-dashboard';
          this.router.navigate([redirect]);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Login failed. Please verify your credentials.';
      }
    });
  }
}
