import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { InputField } from '../../../library/ui/components/input-field/input-field';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, InputField, Button],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getValidationState(field: string): 'none' | 'success' | 'error' {
    const control = this.loginForm.get(field);
    if (!control || (!control.dirty && !control.touched)) return 'none';
    return control.invalid ? 'error' : 'success';
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (!control || !control.errors || (!control.dirty && !control.touched)) return '';

    if (control.errors['required']) {
      return field === 'email' ? 'Email is required' : 'Password is required';
    }

    if (control.errors['pattern']) {
      return field === 'email' 
        ? 'Please enter a valid email address' 
        : 'Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special character';
    }

    return 'Invalid input';
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          const role = response.role?.toLowerCase();
          
          if (role !== 'admin' && !response.profileCompleted) {
            this.router.navigate(['/profile-form']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
