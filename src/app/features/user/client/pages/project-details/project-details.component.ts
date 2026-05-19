import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit {
  project: any = {
    id: 1,
    title: 'FinTech App Design',
    client: 'WealthWave Solutions',
    category: 'Mobile App',
    date: 'February 2024',
    image: '/assets/images/Talent profile.png',
    bannerImage: '/assets/images/workspace.png',
    projectLinks: [
      { name: 'GitHub Repository', icon: 'bi-github', url: '#', type: 'code' },
      { name: 'Live Application', icon: 'bi-box-arrow-up-right', url: '#', type: 'demo' },
      { name: 'Detailed Case Study', icon: 'bi-file-earmark-text', url: '#', type: 'blog' }
    ],
    creator: {
      name: 'Alex Johnson',
      avatar: '/assets/images/profiles/avatar-1.jpg',
      role: 'Lead UI/UX Designer',
      performance: 98
    },
    description: 'A comprehensive mobile banking experience designed for high-net-worth individuals. The project involved complete UI/UX overhaul focusing on security, clarity, and premium aesthetics.',
    performance: '98% Client Satisfaction',
    metrics: [
      { label: 'User Engagement', value: '+45%', icon: 'bi-graph-up' },
      { label: 'Transaction Speed', value: '-30%', icon: 'bi-lightning-charge' },
      { label: 'Accessibility', value: 'AA Grade', icon: 'bi-universal-access' }
    ],
    techStack: ['Figma', 'Prototyping', 'User Testing', 'Adobe After Effects', 'Swift UI Concepts'],
    deliverables: [
      'Interactive Mobile Prototypes',
      'High-Fidelity UI Screens (80+)',
      'Custom Iconography Set',
      'Design System Documentation',
      'UX Research Reports'
    ],
    gallery: [
      '/assets/images/dashboard.png',
      '/assets/images/workspace.png',
      '/assets/images/Talent working.jpg'
    ],
    outcome: 'Within three months of launch, user engagement increased by 45%, and the platform received the "Premium Experience" award in the FinTech Innovation category.'
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  }
}
