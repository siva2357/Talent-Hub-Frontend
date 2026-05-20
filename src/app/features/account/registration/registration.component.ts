import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { RegexPatterns } from '../../../core/regex/patterns';
import { RegisterRequest } from '../../../core/DTOs/auth.dto';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  role: 'Freelancer' | 'Client' = 'Freelancer';
  isLoading = false;
  registrationError: string | null = null;

  registrationForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(RegexPatterns.ALPHABET_ONLY)]],
    email: ['', [Validators.required, Validators.pattern(RegexPatterns.EMAIL)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const queryRole = params['role'];
      if (queryRole === 'client') {
        this.role = 'Client';
      } else {
        this.role = 'Freelancer';
      }
    });
  }

  get fullNameControl() {
    return this.registrationForm.get('fullName');
  }

  get emailControl() {
    return this.registrationForm.get('email');
  }

  get passwordControl() {
    return this.registrationForm.get('password');
  }

  getFullNameError(): string | null {
    if (this.fullNameControl?.touched && this.fullNameControl?.errors) {
      if (this.fullNameControl.errors['required']) return 'Full name is required';
      if (this.fullNameControl.errors['minlength']) return 'Full name must be at least 2 characters';
      if (this.fullNameControl.errors['pattern']) return 'Full name must contain only alphabets';
    }
    return null;
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

  onRegister(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.registrationError = null;

    const payload: RegisterRequest = {
      fullName: this.registrationForm.value.fullName,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      role: this.role
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/account/otp-verification'], {
          queryParams: { mode: 'register', email: payload.email, role: payload.role }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.registrationError = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
