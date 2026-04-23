import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { InputFields } from "../../components/input-fields/input-fields";
import { Buttons } from "../../components/buttons/buttons";
import { LoginRequestDto } from '../../../core/dtos/auth.dto';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, InputFields, Buttons],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

  isLoading = false;
  errorMessage = '';
  loginForm!: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

onLogin() {

  // ✅ Validate form properly
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched(); // 🔥 show field errors
    return;
  }

  // ✅ Start loading
  this.isLoading = true;
  this.errorMessage = '';

  const payload: LoginRequestDto = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  this.authService.login(payload).subscribe({

next: (res) => {
  this.isLoading = false;

  const role = res.role;
  const isProfileCompleted = res.profileCompleted;

  // ✅ STORE ROLE + TOKEN FIRST
  localStorage.setItem('token', res.token);
  localStorage.setItem('role', role);

  if (role === 'admin') {
    this.router.navigate(['user/dashboard']);
    return;
  }

  if (!isProfileCompleted) {
    this.router.navigate(['/profile-form'], {
      queryParams: { role }
    });
    return;
  }

  switch (role) {
    case 'recruiter':
      this.router.navigate(['user/my-dashboard']);
      break;
    case 'jobSeeker':
      this.router.navigate(['user/jobprofile']);
      break;
  }
},

    error: (err) => {
      console.error('Login error:', err);

      // ✅ Stop loading
      this.isLoading = false;

      // ✅ Clean error handling
      this.errorMessage =
        err?.error?.message ||
        err?.message ||
        'Login failed. Please try again.';
    }
  });
}
}
