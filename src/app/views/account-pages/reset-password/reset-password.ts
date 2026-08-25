import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';
import { InputValidation } from '../../../library/ui/components/input-field/input-field';

export const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  
  if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
    confirmPassword.setErrors({ ...confirmPassword.errors, passwordMismatch: true });
    return { passwordMismatch: true };
  }
  
  if (confirmPassword && confirmPassword.errors && confirmPassword.errors['passwordMismatch']) {
    delete confirmPassword.errors['passwordMismatch'];
    if (!Object.keys(confirmPassword.errors).length) {
      confirmPassword.setErrors(null);
    }
  }
  
  return null;
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, InputField, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  resetPasswordForm!: FormGroup;
  email: string = '';
  otp: string = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      if (params['email'] && params['otp']) {
        this.email = params['email'];
        this.otp = params['otp'];
      } else {
        this.router.navigate(['/forgot-password']);
      }
    });
  }

  getValidationState(fieldName: string): InputValidation {
    const control = this.resetPasswordForm.get(fieldName);
    if (!control || !control.touched) return 'none';
    return control.valid ? 'success' : 'error';
  }

  getErrorMessage(fieldName: string): string {
    const control = this.resetPasswordForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['minlength']) return `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
    if (control.errors['maxlength']) return `Maximum length is ${control.errors['maxlength'].requiredLength} characters.`;
    if (control.errors['passwordMismatch']) return 'Passwords do not match.';
    
    return 'Invalid input.';
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const resetData = {
      email: this.email,
      otp: this.otp,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }
}
