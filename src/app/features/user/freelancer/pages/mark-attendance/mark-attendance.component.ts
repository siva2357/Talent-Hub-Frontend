import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../../../core/services/application.service';
import { AttendanceService } from '../../../../../core/services/attendance.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.css'
})
export class MarkAttendanceComponent implements OnInit {
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private attendanceService = inject(AttendanceService);
  private cdr = inject(ChangeDetectorRef);

  currentDate = new Date();
  isCheckedIn = false;
  
  currentSessionStart: string | null = null;
  totalLoggedToday = '0'; // Hours

  activeContracts: any[] = [];
  selectedContractId: string = '';
  todaySessions: any[] = [];
  isLoading = true;
  isPunchingIn = false;
  isPunchingOut = false;

  ngOnInit(): void {
    this.fetchActiveContracts();
  }

  fetchActiveContracts(): void {
    this.isLoading = true;
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        console.log('Freelancer offers received:', res);
        if (res.success && res.offers) {
          this.activeContracts = res.offers.filter((o: any) => o.status === 'Accepted');
          console.log('Accepted active contracts:', this.activeContracts);
          if (this.activeContracts.length > 0) {
            const savedId = this.attendanceService.activeContractId;
            const resolveId = (c: any) => c.contractId || c.id || c._id;
            this.selectedContractId = savedId && this.activeContracts.some(c => resolveId(c) === savedId)
              ? savedId 
              : resolveId(this.activeContracts[0]);
            
            console.log('Resolved selectedContractId:', this.selectedContractId);
            this.onContractChange(this.selectedContractId);
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch active contracts:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onContractChange(contractId: string): void {
    console.log('onContractChange called with:', contractId);
    this.selectedContractId = contractId;
    this.attendanceService.activeContractId = contractId;
    this.loadTodayStatus();
  }

  loadTodayStatus(): void {
    if (!this.selectedContractId) return;

    this.attendanceService.getTodayStatus(this.selectedContractId).subscribe({
      next: (res: any) => {
        console.log('getTodayStatus response received:', res);
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
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to get today status:', err);
        this.cdr.detectChanges();
      }
    });
  }

  get isSelectedContractUpcoming(): boolean {
    if (!this.selectedContractId || this.activeContracts.length === 0) return false;
    const resolveId = (c: any) => c.contractId || c.id || c._id;
    const currentContract = this.activeContracts.find(c => resolveId(c) === this.selectedContractId);
    if (!currentContract || !currentContract.startDate) return false;

    const start = new Date(currentContract.startDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() < start.getTime();
  }

  punchIn() {
    if (!this.selectedContractId || this.isPunchingIn || this.isSelectedContractUpcoming) return;
    this.isPunchingIn = true;

    let locationStr = 'Madhapur, Hyderabad';
    const completeCheckIn = (loc: string) => {
      this.attendanceService.checkIn({
        contractId: this.selectedContractId,
        location: loc,
        faceImage: '',
        faceMatch: true
      }).subscribe({
        next: (res) => {
          this.isPunchingIn = false;
          this.loadTodayStatus();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Check-in failed:', err);
          this.isPunchingIn = false;
          this.cdr.detectChanges();
        }
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationStr = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
          completeCheckIn(locationStr);
        },
        (error) => {
          completeCheckIn(locationStr);
        }
      );
    } else {
      completeCheckIn(locationStr);
    }
  }

  punchOut() {
    if (!this.selectedContractId || this.isPunchingOut || this.isSelectedContractUpcoming) return;
    this.isPunchingOut = true;
    this.attendanceService.checkOut({ contractId: this.selectedContractId }).subscribe({
      next: (res) => {
        this.isPunchingOut = false;
        this.loadTodayStatus();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Check-out failed:', err);
        this.isPunchingOut = false;
        this.cdr.detectChanges();
      }
    });
  }
}
