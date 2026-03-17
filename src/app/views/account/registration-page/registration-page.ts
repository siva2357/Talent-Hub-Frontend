import { SignupRequestDto } from './../../../core/dtos/signup.dto';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';
import { InputFields } from '../../components/input-fields/input-fields';
import { Buttons } from "../../components/buttons/buttons";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFields, Buttons],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.css'
})
export class RegistrationPage implements OnInit {

  form!: FormGroup;
  isLoading = false;
  role: 'jobSeeker' | 'recruiter' = 'jobSeeker';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
     private route: ActivatedRoute
  ) {
    this.initForm();
  }

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.role = params['role'] === 'recruiter' ? 'recruiter' : 'jobSeeker';

    console.log('Selected role:', this.role);
  });
}

  /* ================= FORM ================= */

  initForm() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /* ================= SUBMIT ================= */
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.isLoading = true;

  const payload: SignupRequestDto = {
    role: this.role,
    registrationDetails: this.form.value
  };

  this.authService.register(payload).subscribe({
    next: (res) => {
      console.log('Signup success:', res);

      this.router.navigate(['/register/otp-verification'], {
        queryParams: { email: this.form.value.email, role: this.role }
      });
    },
    error: (err) => {
      console.error('Signup error:', err);
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
}
