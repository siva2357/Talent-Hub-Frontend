
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/enums/role.enum';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputField,
    Button
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  registerForm!: FormGroup;

  role: UserRole | null = null;

  errorMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.initializeRole();
    this.initializeForm();
  }

  /**
   * Gets the selected role from the signup query parameter.
   * Redirects back to role selection when the role is missing or invalid.
   */
  private initializeRole(): void {
    const roleParam = this.route.snapshot.queryParamMap
      .get('role')
      ?.toLowerCase();

    if (roleParam === 'client') {
      this.role = UserRole.Client;
      return;
    }

    if (roleParam === 'freelancer') {
      this.role = UserRole.Freelancer;
      return;
    }

    this.router.navigate(['/signup']);
  }

  /**
   * Creates the registration form and its validation rules.
   */
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
          )
        ]
      ]
    });
  }

  /**
   * Returns the visual validation state for an input field.
   */
  getValidationState(
    field: string
  ): 'none' | 'success' | 'error' {
    const control = this.registerForm.get(field);

    if (!control || (!control.dirty && !control.touched)) {
      return 'none';
    }

    return control.invalid ? 'error' : 'success';
  }

  /**
   * Returns the appropriate validation message for an input field.
   */
  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);

    if (
      !control ||
      !control.errors ||
      (!control.dirty && !control.touched)
    ) {
      return '';
    }

    if (control.errors['required']) {
      return this.getRequiredMessage(field);
    }

    if (control.errors['minlength']) {
      return 'Name must be at least 3 characters long';
    }

    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }

    if (control.errors['pattern']) {
      return 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character';
    }

    return 'Invalid input';
  }

  /**
   * Returns the required validation message for a field.
   */
  private getRequiredMessage(field: string): string {
    switch (field) {
      case 'fullName':
        return 'Full name is required';

      case 'email':
        return 'Email is required';

      case 'password':
        return 'Password is required';

      default:
        return 'This field is required';
    }
  }

  /**
   * Validates and submits the registration form.
   */
  createAccount(): void {
    if (!this.role) {
      this.errorMessage =
        'Role is missing. Please restart signup.';
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      ...this.registerForm.value,
      role: this.role
    };

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.router.navigate(
            ['/otp-verification'],
            {
              queryParams: {
                email: payload.email
              }
            }
          );
        }
      },

      error: (err) => {
        this.isLoading = false;

        this.errorMessage =
          err.error?.message ||
          'Registration failed. Please try again.';
      }
    });
  }
}

