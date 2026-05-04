import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Buttons } from "../../components/buttons/buttons";
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-otp-verification-page',
  standalone: true,
  imports: [CommonModule, Buttons, FormsModule],
  templateUrl: './reset-otp-verification-page.html',
  styleUrls: ['./reset-otp-verification-page.css']
})
export class ResetOtpVerificationPage {
  otp: string[] = ['', '', '', '', '', ''];
  isLoading = false;
  errorMsg = '';

  constructor(private router: Router) {}

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

  verifyCode() {
    const code = this.otp.join('');
    if (code.length === 6) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/reset-password']);
      }, 1500);
    } else {
      this.errorMsg = 'Please enter a 6-digit code';
    }
  }
}
