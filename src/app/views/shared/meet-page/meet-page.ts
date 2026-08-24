import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-meet-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meet-page.html',
  styleUrl: './meet-page.css'
})
export class MeetPage implements OnInit {
  mode: 'meeting' | 'interview' = 'meeting';
  interviews: any[] = [];
  isLoading = true;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.getInterviews().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.interviews = res.interviews;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching interviews', err);
      }
    });
  }

  isUpcoming(interviewDate: string): boolean {
    return new Date(interviewDate) > new Date();
  }

  formatDate(dateString: string): { day: string, month: string, time: string } {
    const d = new Date(dateString);
    return {
      day: d.getDate().toString(),
      month: d.toLocaleString('default', { month: 'short' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
}
