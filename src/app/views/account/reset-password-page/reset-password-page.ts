import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFields } from "../../components/input-fields/input-fields";
import { Buttons } from "../../components/buttons/buttons";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, InputFields, Buttons, CommonModule],
  templateUrl: './reset-password-page.html',
  styleUrls: ['./reset-password-page.css']
})
export class ResetPasswordPage {
  resetForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.resetForm.valid) {
      console.log('Resetting password...');
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
