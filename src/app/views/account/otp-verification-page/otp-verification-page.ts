import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-otp-verification-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './otp-verification-page.html',
  styleUrls: ['./otp-verification-page.css']
})
export class OtpVerificationPage {

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email');
      const role = params.get('role');

      if (!email || !role) {
        this.router.navigate(['/login']);
        return;
      }

      this.email = email;
      this.role = role;
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

  this.authService.verifyOtp({
    email: this.email,
    providedCode,
    role: this.role as 'jobSeeker' | 'recruiter'
  }).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['/confirmation-page']);
    },
    error: () => {
      this.loading = false;
      this.errorMessage = 'Invalid or expired OTP';
    }
  });
}


}
