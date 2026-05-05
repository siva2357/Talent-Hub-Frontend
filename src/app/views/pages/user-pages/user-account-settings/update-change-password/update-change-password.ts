import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth-service';
import { InputFields } from '../../../../components/input-fields/input-fields';
import { Buttons } from '../../../../components/buttons/buttons';

@Component({
  selector: 'app-update-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFields, Buttons],
  templateUrl: './update-change-password.html',
  styleUrl: './update-change-password.css'
})
export class UpdateChangePassword {
  form: FormGroup;
  isSaving = false;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  updatePassword() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const { oldPassword, newPassword } = this.form.value;

    this.authService.changePassword({ oldPassword, newPassword }).subscribe({
      next: () => {
        this.isSaving = false;
        this.form.reset();
        alert('Password changed successfully');
      },
      error: () => {
        this.isSaving = false;
        alert('Error changing password. Please verify your old password.');
      }
    });
  }
}
