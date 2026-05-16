import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-attendance-overview',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './attendance-overview.component.html',
  styleUrl: './attendance-overview.component.css'
})
export class AttendanceOverviewComponent {
  expandedIndex: number | null = 0;
  isEvidenceModalOpen = false;
  selectedLog: any = null;

  attendanceData = [
    {
      contractTitle: 'Senior Frontend Developer - Angular Expert',
      month: 'May 2026',
      totalHours: '142.5h',
      daysPresent: 20,
      status: 'In Progress',
      id: 'CON-78241',
      logs: [
        {
          date: 'May 15, 2026',
          day: 'Friday',
          sessions: [
            {
              checkIn: '08:00 AM', checkOut: '10:00 AM', hours: 2,
              location: 'Hitech City, Hyderabad', faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
            },
            {
              checkIn: '10:15 AM', checkOut: '12:15 PM', hours: 2,
              location: 'Madhapur, Hyderabad', faceImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
            },
            {
              checkIn: '01:00 PM', checkOut: '03:00 PM', hours: 2,
              location: 'Gachibowli, Hyderabad', faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
            },
            {
              checkIn: '03:15 PM', checkOut: '05:15 PM', hours: 2,
              location: 'Jubilee Hills, Hyderabad', faceImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
            },
            {
              checkIn: '05:30 PM', checkOut: '07:30 PM', hours: 2,
              location: 'Kondapur, Hyderabad', faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
            },
            {
              checkIn: '07:45 PM', checkOut: '09:45 PM', hours: 2,
              location: 'Banjara Hills, Hyderabad', faceImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
            }
          ],
          totalHours: 12,
          status: 'Attended'
        },
        {
          date: 'May 14, 2026',
          day: 'Thursday',
          sessions: [
            {
              checkIn: '09:15 AM',
              checkOut: '02:15 PM',
              hours: 5,
              location: 'Work From Home, Gachibowli',
              faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
            }
          ],
          totalHours: 5,
          status: 'Partially Attended'
        },
        {
          date: 'May 13, 2026',
          day: 'Wednesday',
          sessions: [],
          totalHours: 0,
          status: 'Absent'
        },
        {
          date: 'May 12, 2026',
          day: 'Tuesday',
          sessions: [
            {
              checkIn: '09:30 AM',
              checkOut: '06:00 PM',
              hours: 8.5,
              location: 'Co-working Space, Jubilee Hills',
              faceImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
            }
          ],
          totalHours: 8.5,
          status: 'Attended'
        }
      ]
    }
  ];

  toggleAccordion(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  showEvidence(log: any) {
    this.selectedLog = log;
    this.isEvidenceModalOpen = true;
  }

  closeModal() {
    this.isEvidenceModalOpen = false;
    this.selectedLog = null;
  }

  getBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'attended': return 'badge-success';
      case 'partially attended': return 'badge-warning';
      case 'absent': return 'badge-danger';
      case 'completed': return 'badge-success';
      case 'in progress': return 'badge-info';
      case 'active': return 'badge-primary';
      default: return 'badge-secondary';
    }
  }
}
