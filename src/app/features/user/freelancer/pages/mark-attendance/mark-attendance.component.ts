import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../../core/services/application.service';
import { AttendanceService } from '../../../../../core/services/attendance.service';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.css'
})
export class MarkAttendanceComponent implements OnInit {
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private attendanceService = inject(AttendanceService);

  currentDate = new Date();
  isCheckedIn = false;
  
  currentSessionStart: string | null = null;
  totalLoggedToday = '0'; // Hours

  activeContracts: any[] = [];
  selectedContractId: string = '';
  todaySessions: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchActiveContracts();
  }

  fetchActiveContracts(): void {
    this.isLoading = true;
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        if (res.success && res.offers) {
          this.activeContracts = res.offers.filter((o: any) => o.status === 'Accepted');
          if (this.activeContracts.length > 0) {
            const savedId = this.attendanceService.activeContractId;
            this.selectedContractId = savedId && this.activeContracts.some(c => c.id === savedId)
              ? savedId 
              : this.activeContracts[0].id;
            
            this.onContractChange(this.selectedContractId);
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch active contracts:', err);
        this.isLoading = false;
      }
    });
  }

  onContractChange(contractId: string): void {
    this.selectedContractId = contractId;
    this.attendanceService.activeContractId = contractId;
    this.loadTodayStatus();
  }

  loadTodayStatus(): void {
    if (!this.selectedContractId) return;

    // Check if we have pending capture details to commit for this contract
    const captureInfo = this.attendanceService.lastCapturedInfo;
    if (captureInfo) {
      this.attendanceService.checkIn({
        contractId: this.selectedContractId,
        location: captureInfo.location,
        faceImage: captureInfo.faceImage,
        faceMatch: captureInfo.faceMatch
      }).subscribe({
        next: (res) => {
          this.attendanceService.lastCapturedInfo = null; // Clear state
          this.loadTodayStatus();
        },
        error: (err) => {
          console.error('Check-in failed:', err);
          this.attendanceService.lastCapturedInfo = null;
        }
      });
      return;
    }

    this.attendanceService.getTodayStatus(this.selectedContractId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.isCheckedIn = res.isCheckedIn;
          this.totalLoggedToday = res.totalLoggedToday.toString();
          
          if (res.currentSessionStart) {
            const date = new Date(res.currentSessionStart);
            this.currentSessionStart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else {
            this.currentSessionStart = null;
          }
          
          this.todaySessions = (res.sessions || []).map((s: any) => {
            const formatTime = (t: any) => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---';
            const calcHrs = (s.checkIn && s.checkOut) 
              ? parseFloat(((new Date(s.checkOut).getTime() - new Date(s.checkIn).getTime()) / (1000 * 60 * 60)).toFixed(2)) 
              : 0;
            return {
              id: s._id,
              checkIn: formatTime(s.checkIn),
              checkOut: formatTime(s.checkOut),
              duration: calcHrs.toString(),
              location: s.location,
              image: s.faceImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
            };
          }).reverse();
        }
      },
      error: (err) => {
        console.error('Failed to get today status:', err);
      }
    });
  }

  punchIn() {
    if (!this.selectedContractId) return;
    this.attendanceService.activeContractId = this.selectedContractId;
    this.router.navigate(['/user/capture-attendance']);
  }

  punchOut() {
    if (!this.selectedContractId) return;
    this.attendanceService.checkOut({ contractId: this.selectedContractId }).subscribe({
      next: (res) => {
        this.loadTodayStatus();
      },
      error: (err) => {
        console.error('Check-out failed:', err);
      }
    });
  }
}
