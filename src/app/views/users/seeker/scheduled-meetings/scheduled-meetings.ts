import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InterviewService } from '../../../../core/services/interview-service';
import { Interview } from '../../../../core/models/interview.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-scheduled-meetings',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './scheduled-meetings.html',
  styleUrl: './scheduled-meetings.css'
})
export class ScheduledMeetings implements OnInit {

  interviews: Interview[] = [];
  totalInterviews = 0;
  loading = true;

  constructor(private interviewService: InterviewService, private router:Router) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.interviewService.getAllJobSeekerInterviews().subscribe({
      next: (res) => {
        this.interviews = res.interviews;
        this.totalInterviews = res.totalInterviews;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }


joinInterview(interview: Interview): void {
  if (!interview?.meetingJoinUrl) {
    console.error('Missing meeting join URL', interview);
    return;
  }

  // Open external meeting link
  window.open(interview.meetingJoinUrl, '_blank');
}


}
