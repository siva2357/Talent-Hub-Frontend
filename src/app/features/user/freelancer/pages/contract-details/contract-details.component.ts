import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


interface ContractDetail {
  id: string;
  title: string;
  type: string;
  level: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  budget: string;
  duration: string;
  experience: string;
  workSchedule: string; // New field
  hiringPreferences: string[]; // New field
  client: {
    name: string;
    rating: number;
    location: string;
    totalSpent: string;
    history: string;
  };
  postedDate: string;
  proposals: string;
  status: string;
}

@Component({
  selector: 'app-contract-details',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './contract-details.component.html',
  styleUrl: './contract-details.component.css'
})
export class ContractDetailsComponent implements OnInit {
  contractId: string | null = null;

  contract: ContractDetail = {
    id: '1',
    title: 'Senior Angular Developer for Enterprise SaaS',
    type: 'Fixed Price',
    level: 'Expert',
    description: 'We are seeking an Expert Angular Developer to lead the frontend development of our next-generation SaaS analytics platform. This project involves complex data visualization, real-time updates via WebSockets, and a robust state management architecture using NgRx.',
    responsibilities: [
      'Lead the design and implementation of new features in Angular 17+',
      'Optimize application performance for large datasets',
      'Collaborate with backend engineers to define API contracts',
      'Mentor junior developers and perform code reviews'
    ],
    skills: ['Angular', 'TypeScript', 'NgRx', 'RxJS', 'D3.js', 'SCSS', 'Karma/Jasmine'],
    budget: '$5,000 - $8,000',
    duration: '3-6 Months',
    experience: '5+ years of professional development experience',
    workSchedule: 'Full-time (40 hrs/week)',
    hiringPreferences: [
      'Strong communication skills in English',
      'Available during US EST timezone',
      'Previous experience with Fintech projects',
      'Proven track record with high-performance dashboards'
    ],
    client: {
      name: 'TechNova Solutions',
      rating: 4.9,
      location: 'San Francisco, CA (Remote)',
      totalSpent: '$100k+',
      history: 'Member since 2019'
    },
    postedDate: '2 hours ago',
    proposals: '15 to 20',
    status: 'Open'
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.contractId = this.route.snapshot.paramMap.get('id');
  }
}
