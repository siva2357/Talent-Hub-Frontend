import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { AttendanceService } from '../../../../../core/services/attendance.service';

@Component({
  selector: 'app-capture-attendance',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './capture-attendance.component.html',
  styleUrl: './capture-attendance.component.css'
})
export class CaptureAttendanceComponent {
  private router = inject(Router);
  private attendanceService = inject(AttendanceService);

  isVerifying = false;
  captureSuccess = false;

  capture() {
    this.isVerifying = true;
    
    // Get location coordinates or default mock location
    let locationStr = 'Madhapur, Hyderabad';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationStr = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
          this.proceedVerification(locationStr);
        },
        (error) => {
          this.proceedVerification(locationStr);
        }
      );
    } else {
      this.proceedVerification(locationStr);
    }
  }

  proceedVerification(locationStr: string) {
    // Simulate AI Verification
    setTimeout(() => {
      this.isVerifying = false;
      this.captureSuccess = true;
      
      // Save verification data to service state
      this.attendanceService.lastCapturedInfo = {
        faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        location: locationStr,
        faceMatch: true
      };
      
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
