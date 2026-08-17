import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Applicant {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  availability: string;
  applicationStatus: 'Pending' | 'Interviewing' | 'Hired' | 'Rejected';
  offerStatus: 'Not Sent' | 'Sent' | 'Accepted' | 'Declined';
  avatarColor: string;
}

@Component({
  selector: 'app-applicants',
  imports: [RouterLink],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css'
})
export class Applicants {
  applicants: Applicant[] = [
    {
      id: 1,
      fullName: 'Siva Prasad Kurra',
      email: 'sivakurra.ksp2357@gmail.com',
      gender: 'Male',
      availability: 'Full Time',
      applicationStatus: 'Hired',
      offerStatus: 'Accepted',
      avatarColor: '#5a5ce8'
    },
    {
      id: 2,
      fullName: 'Emily Chen',
      email: 'emily.chen@example.com',
      gender: 'Female',
      availability: 'Part Time',
      applicationStatus: 'Interviewing',
      offerStatus: 'Sent',
      avatarColor: '#10b981'
    },
    {
      id: 3,
      fullName: 'Michael Johnson',
      email: 'michael.j@example.com',
      gender: 'Male',
      availability: 'Full Time',
      applicationStatus: 'Pending',
      offerStatus: 'Not Sent',
      avatarColor: '#f59e0b'
    },
    {
      id: 4,
      fullName: 'Sarah Williams',
      email: 'sarah.w@example.com',
      gender: 'Female',
      availability: 'Contract',
      applicationStatus: 'Rejected',
      offerStatus: 'Declined',
      avatarColor: '#ef4444'
    },
    {
      id: 5,
      fullName: 'David Brown',
      email: 'david.b@example.com',
      gender: 'Male',
      availability: 'Full Time',
      applicationStatus: 'Pending',
      offerStatus: 'Not Sent',
      avatarColor: '#8b5cf6'
    }
  ];
}
