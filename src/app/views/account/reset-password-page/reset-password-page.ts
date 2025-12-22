import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule ],
  templateUrl: './reset-password-page.html',
  styleUrls: ['./reset-password-page.css']
})
export class ResetPasswordPage {

  form: FormGroup;

  constructor(private fb: FormBuilder, private router:Router) {
    this.form = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  resetPassword() {
    if (this.form.invalid) return;

    const { newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Password Reset:", newPassword);

    // redirect to login
    this.router.navigate(['/login']);
  }
}
