import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFields } from "../../components/input-fields/input-fields";
import { Buttons } from "../../components/buttons/buttons";

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, InputFields, Buttons],
  templateUrl: './forgot-password-page.html',
  styleUrls: ['./forgot-password-page.css']
})
export class ForgotPasswordPage {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      console.log('Sending reset code to:', this.forgotForm.value.email);
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }
}
