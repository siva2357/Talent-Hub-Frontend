import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';


@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css'
})
export class RegistrationPage implements OnInit {

  registrationForm!: FormGroup;
  role!: 'recruiter' | 'jobSeeker';
  roleLabel = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.role = this.route.snapshot.queryParamMap.get('role') as
      'recruiter' | 'jobSeeker';

    if (!this.role) {
      this.router.navigate(['/sign-up']);
      return;
    }

    this.roleLabel =
      this.role === 'recruiter' ? 'Recruiter' : 'Job Seeker';

    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

submit(): void {
  if (this.registrationForm.invalid) {
    this.registrationForm.markAllAsTouched();
    return;
  }
  const payload = {
    registrationDetails: this.registrationForm.value,
    role: this.role
  };

  this.authService.register(payload).subscribe({
    next: res => {
      if (!res?.result) return;
      const email = this.registrationForm.value.email;
      this.router.navigate(
        ['register/otp-verification'],
        {
          queryParams: {
            email: email,
            role: this.role
          }
        }
      );
    },
    error: () => {
      // optional: show error toast
    }
  });
}


}
