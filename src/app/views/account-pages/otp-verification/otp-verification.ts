import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css'
})
export class OtpVerification {
  constructor(private router: Router) {}

  verify(): void {
    this.router.navigate(['/account-verification']);
  }
}
