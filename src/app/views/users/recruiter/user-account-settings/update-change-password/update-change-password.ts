import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangePassword } from '../../../../../core/models/password.model';
import { PasswordService } from '../../../../../core/services/password-service';

@Component({
  selector: 'app-update-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-change-password.html',
  styleUrl: './update-change-password.css'
})
export class UpdateChangePassword implements OnInit {

  changePasswordForm!: FormGroup;

  isLoading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /* ================= FORM ================= */
  initializeForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(8)]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  /* ================= VALIDATOR ================= */
  passwordMatchValidator(form: FormGroup) {
    const newPass = form.get('newPassword')?.value;
    const confirmPass = form.get('confirmPassword')?.value;
    return newPass && confirmPass && newPass !== confirmPass
      ? { mismatch: true }
      : null;
  }

  /* ================= SUBMIT ================= */
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.changePasswordForm.invalid) return;

    const payload: ChangePassword = {
      oldPassword: this.f['oldPassword'].value,
      newPassword: this.f['newPassword'].value
    };

    this.isLoading = true;

    this.passwordService.changePassword(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password changed successfully. Please login again.';
        localStorage.clear();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.message || 'Failed to update password';
      }
    });
  }

  /* ================= RESET ================= */
  discard(): void {
    this.changePasswordForm.reset();
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
