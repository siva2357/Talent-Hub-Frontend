import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './forgot-password-page.html',
  styleUrls: ['./forgot-password-page.css']
})
export class ForgotPasswordPage {

  constructor( private router:Router){

  }
  email = '';

  sendOtp() {
    if (!this.email) return;
    console.log('OTP sent to:', this.email);
    // redirect after send
    this.router.navigate(['/reset-otp-verification'], { state: { email: this.email } });
  }
}
