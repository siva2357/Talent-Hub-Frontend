import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobSeekerSignupPayload } from '../../../core/models/auth.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register-seeker-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './register-seeker-page.html',
  styleUrl: './register-seeker-page.css'
})
export class RegisterSeekerPage  implements OnInit {

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

  const payload: JobSeekerSignupPayload = {
    registrationDetails: {
      fullName: this.f['fullName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    },
    role: 'jobSeeker'
  };

  this.isLoading = true;

  this.authService.registerJobSeeker(payload).subscribe({
    next: (res) => {
      this.isLoading = false;

      // ✅ STORE TEMP DATA FOR PROFILE FORM
      localStorage.setItem(
        'jobSeekerRegistration',
        JSON.stringify({
          userId: res.result?.userId,
          fullName: res.result?.fullName,
          email: res.result?.email
        })
      );

      this.router.navigate(['sign-up/jobSeeker-profile-form']);
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
