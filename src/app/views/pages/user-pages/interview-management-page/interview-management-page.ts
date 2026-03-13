import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-interview-management-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './interview-management-page.html',
  styleUrl: './interview-management-page.css',
})
export class InterviewManagementPage {



selectedInterview:any = {
jobTitle:'',
candidateName:'',
date:'',
time:'',
meetingLink:'',
status:'Scheduled',
description:''
};
isEditMode = false;

selectInterview(interview:any){
  this.isEditMode = true;
  this.selectedInterview = { ...interview };
}



scheduleInterview(){
this.selectedInterview = {
jobTitle:'',
candidateName:'',
date:'',
time:'',
meetingLink:'',
status:'Scheduled',
description:''
};
}



interviews = [

{
id:1,
jobId:'JOB-001',
jobTitle:'Angular Developer',
candidateName:'Michael Wilson',
email:'michael@email.com',
interviewDate:'25 Jul 2025 - 10:00 AM',
status:'Scheduled',
meetingLink:'https://meet.google.com/demo'
},

{
id:2,
jobId:'JOB-002',
jobTitle:'Node.js Developer',
candidateName:'Jennifer Miller',
email:'jennifer@email.com',
interviewDate:'26 Jul 2025 - 2:00 PM',
status:'Pending',
meetingLink:'https://meet.google.com/demo'
},

{
id:3,
jobId:'JOB-003',
jobTitle:'DevOps Engineer',
candidateName:'William Anderson',
email:'william@email.com',
interviewDate:'27 Jul 2025 - 11:00 AM',
status:'Completed',
meetingLink:'https://meet.google.com/demo'
}

];
}
