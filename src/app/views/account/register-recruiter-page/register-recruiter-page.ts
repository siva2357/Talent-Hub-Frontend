import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { RecruiterSignupPayload } from '../../../core/models/auth.dto';


@Component({
  selector: 'app-register-recruiter-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register-recruiter-page.html',
  styleUrl: './register-recruiter-page.css'
})
export class RegisterRecruiterPage implements OnInit {

  registrationForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,

  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

submit(): void {
  if (this.registrationForm.invalid) {
    this.registrationForm.markAllAsTouched();
    return;
  }

  const payload: RecruiterSignupPayload = {
    registrationDetails: {
      fullName: this.f['fullName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    },
    role: 'recruiter'
  };

  this.isLoading = true;

  this.authService.registerRecruiter(payload).subscribe({
    next: (res) => {
      this.isLoading = false;

      // ✅ STORE TEMP DATA FOR PROFILE FORM
      localStorage.setItem(
        'recruiterRegistration',
        JSON.stringify({
          userId: res.result?.userId,
          fullName: res.result?.fullName,
          email: res.result?.email
        })
      );

      this.router.navigate(['sign-up/recruiter-profile-form']);
    },
    error: () => {
      this.isLoading = false;
    }
  });
}

  login(): void {
    this.router.navigate(['login']);
  }

  forgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }
}
