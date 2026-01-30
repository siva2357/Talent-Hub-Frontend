import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

  loginDetails: FormGroup;
  isLoading = false;
  submitted = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginDetails = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        ]
      ]
    });
  }

  get f() {
    return this.loginDetails.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginDetails.invalid) {
      this.loginDetails.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginDetails.value).subscribe({
      next: (response) => {
        this.isLoading = false;

        // 🔁 Navigation only (NO auth logic)
        switch (response.role) {
          case 'recruiter':
            this.router.navigate(
              response.profileCompleted
                ? ['recruiter']
                : ['recruiter-profile-form']
            );
            break;

          case 'jobSeeker':
            this.router.navigate(
              response.profileCompleted
                ? ['jobSeeker']
                : ['jobSeeker-profile-form']
            );
            break;

          case 'admin':
            this.router.navigate(['admin']);
            break;
        }
      },
      error: () => {
        // ❌ Error UI handled by ErrorInterceptor
        this.isLoading = false;
      }
    });
  }

  goToSignupPage(): void {
    this.router.navigate(['sign-up']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }
}
