import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.css',
})
export class OtpVerificationComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  otp: string[] = ['', '', '', '', '', ''];
  mode: 'register' | 'forgot' = 'register';

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'register';
    });
  }

  onVerify(): void {
    if (this.mode === 'forgot') {
      this.router.navigate(['/account/reset-password']);
    } else {
      this.router.navigate(['/account/confirmation']);
    }
  }
}
