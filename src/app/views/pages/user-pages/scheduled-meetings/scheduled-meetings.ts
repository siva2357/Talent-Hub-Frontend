import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scheduled-meetings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-meetings.html',
  styleUrl: './scheduled-meetings.css',
})
export class ScheduledMeetings  {

  meetings = [
{
id:1,
jobTitle:'Angular Developer',
jobId:'JOB-001',
meetingLink:'https://meet.google.com/abc-123',
description:'Technical interview for Angular developer role.',
date:'2026-03-20',
time:'10:00 AM',
status:'Not Started'
},
{
id:2,
jobTitle:'Node.js Backend Developer',
jobId:'JOB-002',
meetingLink:'https://meet.google.com/backend-456',
description:'Backend architecture discussion.',
date:'2026-03-22',
time:'02:00 PM',
status:'Completed'
},
{
id:3,
jobTitle:'Full Stack Developer',
jobId:'JOB-003',
meetingLink:'https://meet.google.com/fullstack-789',
description:'Full stack technical interview.',
date:'2026-03-24',
time:'11:30 AM',
status:'Not Started'
},
{
id:4,
jobTitle:'AI Engineer',
jobId:'JOB-004',
meetingLink:'https://meet.google.com/ai-321',
description:'Discussion on AI model integration.',
date:'2026-03-25',
time:'04:00 PM',
status:'Not Completed'
},
{
id:5,
jobTitle:'Frontend React Developer',
jobId:'JOB-005',
meetingLink:'https://meet.google.com/react-654',
description:'UI development technical round.',
date:'2026-03-27',
time:'09:30 AM',
status:'Not Started'
}
];


}
