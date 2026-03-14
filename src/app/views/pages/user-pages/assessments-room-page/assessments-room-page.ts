import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessments-room-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessments-room-page.html',
  styleUrl: './assessments-room-page.css'
})
export class AssessmentsRoomPage  {

assessments = [
{
id:1,
jobTitle:'Angular Developer',
jobId:'JOB-001',
assessmentLink:'https://assessment.platform.com/angular-test',
description:'Technical assessment for Angular developer role.',
date:'2026-03-20',
time:'10:00 AM',
status:'Not Started'
},
{
id:2,
jobTitle:'Node.js Backend Developer',
jobId:'JOB-002',
assessmentLink:'https://assessment.platform.com/nodejs-test',
description:'Backend architecture and coding assessment.',
date:'2026-03-22',
time:'02:00 PM',
status:'Completed'
},
{
id:3,
jobTitle:'Full Stack Developer',
jobId:'JOB-003',
assessmentLink:'https://assessment.platform.com/fullstack-test',
description:'Full stack coding and problem solving assessment.',
date:'2026-03-24',
time:'11:30 AM',
status:'Not Started'
},
{
id:4,
jobTitle:'AI Engineer',
jobId:'JOB-004',
assessmentLink:'https://assessment.platform.com/ai-test',
description:'AI and machine learning technical assessment.',
date:'2026-03-25',
time:'04:00 PM',
status:'Not Completed'
},
{
id:5,
jobTitle:'Frontend React Developer',
jobId:'JOB-005',
assessmentLink:'https://assessment.platform.com/react-test',
description:'Frontend UI development coding assessment.',
date:'2026-03-27',
time:'09:30 AM',
status:'Not Started'
}
];


}
