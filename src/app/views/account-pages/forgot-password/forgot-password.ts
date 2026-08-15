import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  constructor(private router: Router) {}

  sendResetCode(): void {
    // Routes to otp-verification as the subtitle implies an OTP will be sent
    this.router.navigate(['/otp-verification']);
  }
}
