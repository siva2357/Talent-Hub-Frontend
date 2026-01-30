import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InterviewService } from '../../../../core/services/interview-service';
import { Interview } from '../../../../core/models/interview.model';

@Component({
  selector: 'app-scheduled-meetings',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './scheduled-meetings.html',
  styleUrl: './scheduled-meetings.css',
})
export class ScheduledMeetings implements OnInit {

  loading = true;
  interviews: (Interview & {
    profilePhoto?: string | null;
  })[] = [];


  constructor(
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.interviewService.getAllRecruiterInterviews().subscribe({
      next: res => {
        this.interviews = res.meetings;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }



  duration(start: Date, end: Date): string {
    const mins =
      (new Date(end).getTime() - new Date(start).getTime()) / 60000;
    return `${mins} mins`;
  }
}
