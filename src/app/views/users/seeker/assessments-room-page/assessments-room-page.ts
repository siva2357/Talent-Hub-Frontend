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

}
