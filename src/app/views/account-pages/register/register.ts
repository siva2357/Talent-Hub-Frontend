import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/enums/role.enum';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, InputField, Button],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  role!: UserRole;
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Attempt to get role from query params
    this.route.queryParams.subscribe(params => {
      const roleParam = params['role']?.toLowerCase();
      if (roleParam === 'client') {
        this.role = UserRole.Client;
      } else if (roleParam === 'freelancer') {
        this.role = UserRole.Freelancer;
      } else {
        // Redirect to signup if no valid role
        this.router.navigate(['/signup']);
      }
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
    });
  }

  getValidationState(field: string): 'none' | 'success' | 'error' {
    const control = this.registerForm.get(field);
    if (!control || (!control.dirty && !control.touched)) return 'none';
    return control.invalid ? 'error' : 'success';
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (!control || !control.errors || (!control.dirty && !control.touched)) return '';

    if (control.errors['required']) {
      if (field === 'fullName') return 'Full name is required';
      if (field === 'email') return 'Email is required';
      if (field === 'password') return 'Password is required';
    }

    if (control.errors['minlength']) {
      return 'Name must be at least 3 characters long';
    }

    if (control.errors['pattern']) {
      return field === 'email'
        ? 'Please enter a valid email address'
        : 'Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special character';
    }

    return 'Invalid input';
  }

  createAccount(): void {
    if (!this.role) {
      this.errorMessage = 'Role is missing. Please restart signup.';
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.get('termsCheck')?.invalid) {
        this.errorMessage = 'You must agree to the Terms of Service and Privacy Policy.';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      ...this.registerForm.value,
      role: this.role
    };

    // Remove termsCheck from payload as backend doesn't expect it
    delete payload.termsCheck;

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Pass email to otp-verification page
          this.router.navigate(['/otp-verification'], { queryParams: { email: payload.email } });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
