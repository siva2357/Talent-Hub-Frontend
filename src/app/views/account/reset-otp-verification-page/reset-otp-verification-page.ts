import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-reset-otp-verification-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './reset-otp-verification-page.html',
  styleUrls: ['./reset-otp-verification-page.css']
})
export class ResetOtpVerificationPage {

    constructor( private router:Router){

  }

  otp = Array(6).fill('');
  otpInputs = Array(6).fill(0);
  maskedEmail = 'abc****@gmail.com';

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (value.length === 1 && index < 5) {
      const next = document.getElementById('otp-' + (index + 1));
      next?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && index > 0 && !this.otp[index]) {
      const prev = document.getElementById('otp-' + (index - 1));
      prev?.focus();
    }
  }

  verify() {
    const code = this.otp.join('');
    console.log('Verify OTP:', code);
    // After success navigate:
    this.router.navigate(['/reset-password']);
  }

  resendOtp() {
    console.log('Resend OTP clicked');
  }
}
