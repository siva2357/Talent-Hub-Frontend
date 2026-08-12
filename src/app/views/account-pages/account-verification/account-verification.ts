import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './account-verification.html',
  styleUrl: './account-verification.css'
})
export class AccountVerification {
  // Toggle this to see success vs failure UI
  isVerified = true;

  constructor(private router: Router) {}

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }
}
