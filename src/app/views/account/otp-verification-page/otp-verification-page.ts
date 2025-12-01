import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './otp-verification-page.html',
  styleUrls: ['./otp-verification-page.css']
})
export class OtpVerificationPage {

  email = "abc12345@gmail.com";       // Example email
  maskedEmail = "";                   // Masked version
  otpInputs = Array(6).fill(0);       // 6 inputs
  otp: string[] = ["", "", "", "", "", ""];

  constructor(private router: Router) {}

  ngOnInit() {
    this.maskEmail();
  }

  maskEmail() {
    const [name, domain] = this.email.split("@");
    const masked = name.substring(0, 3) + "*".repeat(name.length - 3);
    this.maskedEmail = `${masked}@${domain}`;
  }

  // Auto move to next box
  onInput(event: any, index: number) {
    const value = event.target.value;

    if (value && index < 5) {
      const next = document.querySelectorAll<HTMLInputElement>('.otp-input')[index + 1];
      next.focus();
    }
  }

  // Go back on Backspace
  onKeyDown(event: any, index: number) {
    if (event.key === "Backspace" && !this.otp[index] && index > 0) {
      const prev = document.querySelectorAll<HTMLInputElement>('.otp-input')[index - 1];
      prev.focus();
    }
  }

  verify() {
    const enteredOtp = this.otp.join("");
    console.log("Entered OTP: ", enteredOtp);

    // TODO: Call backend to verify OTP
    this.router.navigate(['/confirmation-page']);
  }

  resendOtp() {
    console.log("Resend OTP clicked");
    // TODO: call API to resend OTP
  }
}
