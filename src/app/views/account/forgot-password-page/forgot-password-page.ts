import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasswordService } from '../../../core/services/password-service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,ReactiveFormsModule],
  templateUrl: './forgot-password-page.html',
  styleUrls: ['./forgot-password-page.css']
})
export class ForgotPasswordPage  implements OnInit {
  errorMessage: string | undefined;
  successMessage: string | undefined;
  forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private resetPasswordService: PasswordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  sendOtp() {
    this.errorMessage = '';
    this.successMessage = '';

    // Ensure the form is valid before proceeding
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;  // Get the email from the form

    // Send email directly to backend to verify existence
    this.resetPasswordService.sendForgotPasswordCode(email).subscribe(
      (response) => {
        this.successMessage = 'OTP sent successfully. Please check your email.';
        setTimeout(() => {
          this.router.navigate(['reset-otp-verification'], { queryParams: { email } });
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error sending OTP. Please try again.';
      }
    );
  }
}
