import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-seeker-page',
  imports: [FormsModule,ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-seeker-page.html',
  styleUrl: './register-seeker-page.css',
  standalone:true
})
export class RegisterSeekerPage {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signup() {
    if (this.form.invalid) return;
    console.log('Recruiter Signup:', this.form.value);
  }

  signupWithGoogle() {
    console.log('Google Signup Clicked');
  }

}
