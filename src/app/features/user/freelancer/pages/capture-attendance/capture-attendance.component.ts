import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-capture-attendance',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './capture-attendance.component.html',
  styleUrl: './capture-attendance.component.css'
})
export class CaptureAttendanceComponent {
  isVerifying = false;
  captureSuccess = false;

  constructor(private router: Router) {}

  capture() {
    this.isVerifying = true;
    
    // Simulate AI Verification
    setTimeout(() => {
      this.isVerifying = false;
      this.captureSuccess = true;
      
      // Navigate back after success
      setTimeout(() => {
        this.router.navigate(['/user/mark-attendance']);
      }, 2000);
    }, 3000);
  }

  cancel() {
    this.router.navigate(['/user/mark-attendance']);
  }
}
