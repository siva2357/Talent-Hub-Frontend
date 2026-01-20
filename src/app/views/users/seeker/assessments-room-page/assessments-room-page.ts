import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AssessmentService } from '../../../../core/services/assessment-service';

@Component({
  selector: 'app-assessments-room-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assessments-room-page.html',
  styleUrl: './assessments-room-page.css'
})
export class AssessmentsRoomPage implements OnInit {

  assessments: any[] = [];
  loading = true;

  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assessmentService.getMyAssessments().subscribe({
      next: res => {
        this.assessments = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }


markAsCompleted(assessmentId: string): void {
  if (!confirm('Are you sure you want to mark this assessment as completed?')) {
    return;
  }

  this.assessmentService
    .markCompleted(assessmentId)
    .subscribe({
      next: () => {
        const assessment = this.assessments.find(a => a._id === assessmentId);
        if (assessment) {
          assessment.status = 'Completed';
        }
      },
      error: () => {
        alert('Failed to mark assessment as completed');
      }
    });
}


}
