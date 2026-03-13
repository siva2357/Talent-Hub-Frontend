import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [CommonModule, RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './job-applications.html',
  styleUrl: './job-applications.css',
})
export class JobApplications {
  selectedApplicant: any = null;

  viewApplicant(applicant: any) {
    this.selectedApplicant = applicant;
  }

  job = {
    id: 1,
    jobId: 'JOB-001',
    title: 'Angular Developer',
    category: 'Frontend',
    type: 'Full Time',
    location: 'Hyderabad',
    applicants: 24,
    status: 'Open',
  };

  applicants = [
    {
      id: 1,
      name: 'Michael Wilson',
      email: 'michael.wilson@email.com',
      phone: '+91 9876543210',
      appliedDate: '5 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=1',
    },
    {
      id: 2,
      name: 'Jennifer Miller',
      email: 'jennifer.miller@email.com',
      phone: '+91 9123456780',
      appliedDate: '7 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=2',
    },
    {
      id: 3,
      name: 'William Anderson',
      email: 'william.anderson@email.com',
      phone: '+91 9012345678',
      appliedDate: '7 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=3',
    },
    {
      id: 4,
      name: 'Sophia Martinez',
      email: 'sophia.martinez@email.com',
      phone: '+91 9988776655',
      appliedDate: '9 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=4',
    },
    {
      id: 5,
      name: 'James Thompson',
      email: 'james.thompson@email.com',
      phone: '+91 9098765432',
      appliedDate: '10 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=5',
    },
    {
      id: 6,
      name: 'Olivia Brown',
      email: 'olivia.brown@email.com',
      phone: '+91 9345678901',
      appliedDate: '11 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=6',
    },
    {
      id: 7,
      name: 'Daniel Garcia',
      email: 'daniel.garcia@email.com',
      phone: '+91 9871203456',
      appliedDate: '12 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=7',
    },
    {
      id: 8,
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      phone: '+91 9765432109',
      appliedDate: '13 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=8',
    },
    {
      id: 9,
      name: 'Alexander Lee',
      email: 'alexander.lee@email.com',
      phone: '+91 9654321789',
      appliedDate: '14 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=9',
    },
    {
      id: 10,
      name: 'Isabella Walker',
      email: 'isabella.walker@email.com',
      phone: '+91 9543219876',
      appliedDate: '15 Jul 2025',
      avatar: 'https://i.pravatar.cc/50?img=10',
    },
  ];

selectedInterview:any = {
jobTitle:'',
candidateName:'',
date:'',
time:'',
meetingLink:'',
status:'Scheduled',
description:''
};


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




}
