import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { PasswordService } from '../../../core/services/password-service';
@Component({
  selector: 'app-reset-otp-verification-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './reset-otp-verification-page.html',
  styleUrls: ['./reset-otp-verification-page.css']
})
export class ResetOtpVerificationPage {


  email!: string;
  role!: string;

  maskedEmail = '';
  otpInputs = Array(6).fill(0);
  otp: string[] = ['', '', '', '', '', ''];

  loading = false;
  errorMessage = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resetPasswordService: PasswordService,
  ) {}


    ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email');
      const role = params.get('role');

      this.email = email!;
      this.role = role!;
      this.maskEmail();
    });
  }


  /* ================= MASK EMAIL ================= */
  maskEmail(): void {
    const [name, domain] = this.email.split('@');
    const visible = name.slice(0, 3);
    const masked = '*'.repeat(Math.max(name.length - 3, 0));
    this.maskedEmail = `${visible}${masked}@${domain}`;
  }

  /* ================= OTP INPUT HANDLING ================= */
  onInput(event: any, index: number): void {
    if (event.target.value && index < 5) {
      document
        .querySelectorAll<HTMLInputElement>('.otp-input')
        [index + 1]?.focus();
    }
  }


  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      document
        .querySelectorAll<HTMLInputElement>('.otp-input')
        [index - 1]?.focus();
    }
  }

    /* ================= VERIFY OTP ================= */
  verify(): void {
    const providedCode = this.otp.join('');

    if (providedCode.length !== 6) return;

    this.loading = true;
    this.errorMessage = '';

this.resetPasswordService.verifyForgotPasswordCode(
  providedCode,
  this.email,
).subscribe({
  next: () => {
    this.loading = false;
    this.router.navigate(['/reset-password'], {
            queryParams: { email: this.email }
          });
  },
  error: () => {
    this.loading = false;
    this.errorMessage = 'Invalid or expired OTP';
  }
});

  }


  resendOtp() {
    console.log('Resend OTP clicked');
  }
}
