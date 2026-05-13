import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  problems = [
    {
      icon: 'bi-person-x',
      title: 'Unverified users and scam risks',
      description: 'Fake profiles, unreliable clients, and lack of verification create trust and security challenges.'
    },
    {
      icon: 'bi-wallet2',
      title: 'Delayed or obscure payments',
      description: 'Freelancers face payment delays, milestone disputes, and unclear payment processes.'
    },
    {
      icon: 'bi-chat-dots',
      title: 'Poor communication and collaboration',
      description: 'Managing chats, meetings, files, and updates across multiple tools leads to confusion and low productivity.'
    },
    {
      icon: 'bi-eye-slash',
      title: 'Lack of transparency in project progress',
      description: 'Clients struggle to monitor activity, attendance, timelines, and real-time work progress.'
    },
    {
      icon: 'bi-people',
      title: 'Inefficient hiring processes',
      description: 'Finding the right talent from thousands of profiles is time-consuming and often inaccurate.'
    },
    {
      icon: 'bi-clock-history',
      title: 'Manual attendance and inaccurate tracking',
      description: 'Lack of automated time-tracking and attendance leads to disputes, payment errors, and reduced accountability.'
    }
  ];

  solutions = [
    {
      image: '/assets/images/blog/talent_match_blog.png',
      icon: 'bi-stars',
      glow: 'bg-blue-glow',
      title: 'AI-Powered Talent Matching',
      description: 'Our AI engine matches the right talent based on skills, experience, and project requirements.'
    },
    {
      image: '/assets/images/blog/how_we_work_blog.png',
      icon: 'bi-file-earmark-lock',
      glow: 'bg-green-glow',
      title: 'Secure Contracts & Payments',
      description: 'Milestone-based payments, secure escrow, and verified approvals protect both clients and freelancers.'
    },
    {
      image: '/assets/images/features/activity_schedule.png',
      icon: 'bi-lightning-charge',
      glow: 'bg-purple-glow',
      title: 'Smart Productivity & Attendance',
      description: 'Live face-detection attendance, activity monitoring, and productivity insights ensure transparency.'
    },
    {
      image: '/assets/images/blog/talent_hub_services_blog.png',
      icon: 'bi-chat-square-text',
      glow: 'bg-orange-glow',
      title: 'Centralized Collaboration',
      description: 'Video meetings, chat, file sharing, and task management — all in one unified workspace.'
    },
    {
      image: '/assets/images/features/project_management.png',
      icon: 'bi-graph-up',
      glow: 'bg-blue-dark-glow',
      title: 'Real-Time Tracking & Insights',
      description: 'Track progress, monitor performance, and get actionable insights with powerful dashboards.'
    },
    {
      image: '/assets/images/features/user_growth.png',
      icon: 'bi-patch-check',
      glow: 'bg-brand-glow',
      title: 'Verified Clients & Trusted Talent',
      description: 'Verified profiles, work-history validation, and secure onboarding reduce scams and build trust.'
    }
  ];

  values = [
    {
      icon: 'bi-shield-check',
      title: 'Integrity',
      description: "We believe in honesty, transparency, and doing what's right."
    },
    {
      icon: 'bi-lock',
      title: 'Security',
      description: 'We protect our community with enterprise-grade security.'
    },
    {
      icon: 'bi-lightbulb',
      title: 'Innovation',
      description: 'We continuously innovate to build smarter solutions for the future.'
    },
    {
      icon: 'bi-people',
      title: 'Customer Success',
      description: 'We are committed to helping our users achieve real success.'
    },
    {
      icon: 'bi-globe',
      title: 'Community',
      description: 'We build a global community of trusted professionals.'
    }
  ];
}
