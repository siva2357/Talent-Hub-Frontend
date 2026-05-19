import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contract-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contract-profile.component.html',
  styleUrl: './contract-profile.component.css'
})
export class ContractProfileComponent implements OnInit {
  contract: any = {
    id: 1,
    title: 'Senior Web Designer - Monthly Retainer',
    client: {
      name: 'TechFlow Systems',
      location: 'San Francisco, USA',
      avatar: '/assets/images/profiles/avatar-2.jpg',
      industry: 'Enterprise Software'
    },
    status: 'Completed',
    dateRange: 'Jan 2023 - Dec 2023',
    duration: '12 Months',
    totalEarnings: '$45,000',
    hoursLogged: '1,920 hrs',
    performance: 100,
    rating: 5.0,
    skillsUsed: ['Angular', 'SCSS', 'System Architecture', 'UI/UX Design'],
    milestones: [
      { date: 'Jan 2023', title: 'Contract Initiation', status: 'Completed', desc: 'Onboarding and initial design system setup.' },
      { date: 'Apr 2023', title: 'Major UI Overhaul', status: 'Completed', desc: 'Migration of legacy dashboard to modern Angular components.' },
      { date: 'Aug 2023', title: 'Performance Optimization', status: 'Completed', desc: 'Reduced load times by 40% using lazy loading and state management.' },
      { date: 'Dec 2023', title: 'Final Handover', status: 'Completed', desc: 'Documentation and knowledge transfer to in-house team.' }
    ],
    workDiary: [
      { day: 'Mon', hours: 8, task: 'Implemented Auth Flow' },
      { day: 'Tue', hours: 7, task: 'UI Bug fixes in Dashboard' },
      { day: 'Wed', hours: 9, task: 'State management optimization' },
      { day: 'Thu', hours: 8, task: 'Client meeting & Feedback' },
      { day: 'Fri', hours: 6, task: 'Documentation' }
    ],
    clientImages: [
      '/assets/images/dashboard.png',
      '/assets/images/workspace.png',
      '/assets/images/Talent working.jpg'
    ],
    review: {
      content: "Alex is an exceptional professional. His attention to detail and ability to scale our front-end architecture was instrumental in our Series B success. Highly recommended for any complex enterprise projects.",
      author: "Sarah Miller",
      role: "CTO, TechFlow Systems"
    },
    bannerImage: '/assets/images/workspace.png'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  }
}
