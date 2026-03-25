import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentService } from '../../../../core/services/assessment-service';

@Component({
  selector: 'app-assessments-room-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessments-room-page.html',
  styleUrl: './assessments-room-page.css'
})
export class AssessmentsRoomPage implements OnInit {



  ngOnInit() {
  this.loadAssessments();
}

assessments : any[] =[]
constructor(private assessmentService: AssessmentService) {}


loadAssessments() {
  this.assessmentService.getMyAssessments().subscribe({
    next: (res: any) => {
      console.log('Assessments:', res);

      // If your backend sends { total, assessments }
      this.assessments = res.assessments || res;

    },
    error: (err) => {
      console.error(err);
    }
  });
}


markAsCompleted(id: string) {
  this.assessmentService.markCompleted(id).subscribe({
    next: (res) => {
      console.log(res);

      // refresh list after update
      this.loadAssessments();
    },
    error: (err) => {
      console.error(err);
    }
  });
}


}
