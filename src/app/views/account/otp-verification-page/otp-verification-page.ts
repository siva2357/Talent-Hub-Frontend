import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth-service';
import { VerifyOtpRequestDto } from '../../../core/dtos/verify-otp.dto';
import { Buttons } from "../../components/buttons/buttons";

@Component({
  selector: 'app-otp-verification-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Buttons],
  templateUrl: './otp-verification-page.html',
  styleUrls: ['./otp-verification-page.css']
})
export class OtpVerificationPage implements OnInit {

  otp: string[] = ['', '', '', '', '', ''];
  email: string = '';
  errorMsg: string = '';
  isLoading = false;
role: 'jobSeeker' | 'recruiter' = 'jobSeeker';
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.email = params['email'] || '';
    this.role = params['role'] === 'recruiter' ? 'recruiter' : 'jobSeeker';

    console.log('OTP Role:', this.role);
  });
}

  /* ================= OTP INPUT ================= */

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (value.length > 1) {
      this.otp[index] = value.charAt(0);
    }

    if (value && index < 5) {
      const next = document.querySelectorAll('.otp-input')[index + 1] as HTMLElement;
      next?.focus();
    }
  }

  onBackspace(event: any, index: number) {
    if (!event.target.value && index > 0) {
      const prev = document.querySelectorAll('.otp-input')[index - 1] as HTMLElement;
      prev?.focus();
    }
  }

  getOtpCode(): string {
    return this.otp.join('');
  }

  /* ================= VERIFY ================= */

  verifyOtp() {
    const code = this.getOtpCode();

    if (code.length !== 6) {
      this.errorMsg = 'Please enter valid 6-digit OTP';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    const payload: VerifyOtpRequestDto = {
      email: this.email,
      providedCode: code,
      role: this.role
    };

    this.authService.verifyOtp(payload).subscribe({
      next: (res) => {
        console.log('OTP verified:', res);

        this.router.navigate(['/confirmation-page']);
      },
      error: () => {
        this.errorMsg = 'Invalid or expired OTP';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /* ================= RESEND ================= */

  resendOtp() {
    this.authService.resendOtp({
      email: this.email,
    }).subscribe({
      next: () => {
        this.errorMsg = '';
        alert('OTP resent successfully');
      },
      error: () => {
        this.errorMsg = 'Failed to resend OTP';
      }
    });
  }
}
