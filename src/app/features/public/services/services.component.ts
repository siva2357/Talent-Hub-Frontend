import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  services = [
    {
      image: '/assets/images/solutions/collaboration.png',
      icon: 'bi-headset',
      glow: 'bg-blue-glow',
      title: 'Support Resolving System',
      description: 'Resolve issues and collaborate seamlessly through our dedicated contact support resolving system.'
    },
    {
      image: '/assets/images/solutions/productivity.png',
      icon: 'bi-graph-up',
      glow: 'bg-green-glow',
      title: 'Activity Tracking System',
      description: 'Track active work sessions using advanced activity monitoring systems.'
    },
    {
      image: '/assets/images/solutions/tracking_insights.png',
      icon: 'bi-folder2-open',
      glow: 'bg-purple-glow',
      title: 'Project Tracking & File Management',
      description: 'Monitor project progress, milestones, task updates, and daily productivity through real-time dashboards and workflow tracking systems.'
    },
    {
      image: '/assets/images/solutions/secure_payments.png',
      icon: 'bi-wallet2',
      glow: 'bg-orange-glow',
      title: 'Secure Milestone Payments',
      description: 'Receive and process payments securely based on verified project progress and approved milestone completion with transparent workflows.'
    },
    {
      image: '/assets/images/solutions/contracts.png',
      icon: 'bi-file-earmark-lock',
      glow: 'bg-blue-dark-glow',
      title: 'Legally Protected Contracts',
      description: 'Create secure digital contracts with milestone agreements, transparent deliverables, and legally protected workflows to reduce disputes.'
    },
    {
      image: '/assets/images/solutions/verified_talent.png',
      icon: 'bi-patch-check',
      glow: 'bg-brand-glow',
      title: 'Verified Clients & Trusted Talent',
      description: 'Work confidently with fully verified freelancers and clients through profile verification, work-history validation, and project reviews.'
    }
  ];
}
