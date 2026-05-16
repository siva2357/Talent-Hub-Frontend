import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.css'
})
export class MarkAttendanceComponent implements OnInit {
  currentDate = new Date();
  isCheckedIn = false;
  
  // Mock current session
  currentSessionStart: string | null = null;
  totalLoggedToday = '4.5'; // Hours

  // Today's session history
  todaySessions = [
    {
      id: 1,
      checkIn: '08:00 AM',
      checkOut: '10:30 AM',
      duration: '2.5',
      location: 'Hitech City, Hyderabad',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    },
    {
      id: 2,
      checkIn: '11:00 AM',
      checkOut: '01:00 PM',
      duration: '2.0',
      location: 'Madhapur, Hyderabad',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user just returned from successful capture
    // In a real app, this would be handled via a service or URL params
  }

  punchIn() {
    this.router.navigate(['/user/capture-attendance']);
  }

  punchOut() {
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    this.todaySessions.unshift({
      id: Date.now(),
      checkIn: this.currentSessionStart || '---',
      checkOut: checkOutTime,
      duration: '0.0', 
      location: 'Current Location',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    });

    this.isCheckedIn = false;
    this.currentSessionStart = null;
  }
}
