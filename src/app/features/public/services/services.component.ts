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
      image: '/assets/images/blog/talent_hub_services_blog.png',
      icon: 'bi-camera-video',
      glow: 'bg-blue-glow',
      title: 'Video Meetings & Team Collaboration',
      description: 'Conduct one-to-one meetings, team discussions, and project collaboration sessions through integrated real-time video communication tools.'
    },
    {
      image: '/assets/images/features/activity_schedule.png',
      icon: 'bi-person-check',
      glow: 'bg-green-glow',
      title: 'Smart Attendance System',
      description: 'Track freelancer attendance and active work sessions using live face-detection verification and intelligent attendance monitoring systems.'
    },
    {
      image: '/assets/images/features/project_management.png',
      icon: 'bi-folder2-open',
      glow: 'bg-purple-glow',
      title: 'Project Tracking & File Management',
      description: 'Monitor project progress, milestones, task updates, and daily productivity through real-time dashboards and workflow tracking systems.'
    },
    {
      image: '/assets/images/blog/secure_payments_blog.png',
      icon: 'bi-wallet2',
      glow: 'bg-orange-glow',
      title: 'Secure Milestone Payments',
      description: 'Receive and process payments securely based on verified project progress and approved milestone completion with transparent workflows.'
    },
    {
      image: '/assets/images/blog/how_we_work_blog.png',
      icon: 'bi-file-earmark-lock',
      glow: 'bg-blue-dark-glow',
      title: 'Legally Protected Contracts',
      description: 'Create secure digital contracts with milestone agreements, transparent deliverables, and legally protected workflows to reduce disputes.'
    },
    {
      image: '/assets/images/blog/talent_match_blog.png',
      icon: 'bi-patch-check',
      glow: 'bg-brand-glow',
      title: 'Verified Clients & Trusted Talent',
      description: 'Work confidently with fully verified freelancers and clients through profile verification, work-history validation, and project reviews.'
    }
  ];
}
