import { Component } from '@angular/core';

import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-verification',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './account-verification.html',
  styleUrl: './account-verification.css'
})
export class AccountVerification {
  isVerified = true;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.isVerified = params['status'] !== 'error';
      if (!this.isVerified) {
        this.errorMessage = params['message'] || 'Verification failed.';
      }
    });
  }

  continueToLogin(): void {
    this.router.navigate(['/login']);
  }
}
