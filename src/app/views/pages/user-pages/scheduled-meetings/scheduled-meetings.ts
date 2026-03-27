import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewService } from '../../../../core/services/interview-service';

@Component({
  selector: 'app-scheduled-meetings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-meetings.html',
  styleUrl: './scheduled-meetings.css',
})
export class ScheduledMeetings  {

  meetings: any[] = [];
  totalMeetings: number = 0;

  constructor(private talentService: InterviewService) {}

 ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.talentService.getAllJobSeekerInterviews().subscribe({
      next: (res) => {
        this.meetings = res.meetings;
        this.totalMeetings = res.totalMeetings;
      },
      error: (err) => {
        console.error('Error fetching meetings', err);
      }
    });
  }


}
