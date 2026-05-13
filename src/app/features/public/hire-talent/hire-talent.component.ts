import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-hire-talent',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './hire-talent.component.html',
  styleUrl: './hire-talent.component.css'
})
export class HireTalentComponent {


  features = [
    {
      id: 1,
      icon: 'bi-person-bounding-box',
      subtitle: 'AI Talent Matching',
      title: 'Find the perfect match with AI.',
      description: 'Our AI analyzes skills, experience, and project needs to recommend the best talent for you.'
    },
    {
      id: 2,
      icon: 'bi-person-vcard',
      subtitle: 'View Profiles',
      title: 'Explore verified talent profiles.',
      description: 'View detailed profiles, portfolios, skill sets, hourly rates, success scores, and availability.'
    },
    {
      id: 3,
      icon: 'bi-chat-left-dots',
      subtitle: 'Chat & Discuss',
      title: 'Connect and discuss project details.',
      description: 'Chat in real-time, share files, discuss requirements, and align on goals and expectations.'
    },
    {
      id: 4,
      icon: 'bi-file-earmark-check',
      subtitle: 'Contracts & Milestones',
      title: 'Define scope, milestones and timelines.',
      description: 'Create contracts, set milestones, define deliverables, and agree on timelines with clarity.'
    },
    {
      id: 5,
      icon: 'bi-pie-chart',
      subtitle: 'Allocate Budget',
      title: 'Plan budgets and manage resources.',
      description: 'Set project budgets, allocate resources, and track expenses with full transparency.'
    },
    {
      id: 6,
      icon: 'bi-graph-up-arrow',
      subtitle: 'Project Tracking',
      title: 'Track progress in real-time.',
      description: 'Monitor tasks, deadlines, and progress with intelligent tracking and reporting dashboards.'
    },
    {
      id: 7,
      icon: 'bi-shield-lock',
      subtitle: 'Pay as You Go',
      title: 'Pay securely as work gets completed.',
      description: 'Make secure payments based on milestone completion. Safe, transparent, and hassle-free.'
    },
    {
      id: 8,
      icon: 'bi-folder2-open',
      subtitle: 'Organized Workspace',
      title: 'Work organized. Deliver with full production.',
      description: 'Centralized workspace with files, messages, meetings, and tools to deliver high-quality results.'
    }
  ];

  talents = [
    {
      id: 1,
      name: 'Aryan Sharma',
      role: 'UI/UX Designer',
      location: 'Mumbai, India',
      avatar: 'assets/images/profiles/avatar-1.jpg',
      performance: 98,
      performanceTier: 'High',
      skills: ['UI Design', 'Figma', 'Prototyping', 'User Research'],
      hourlyRate: 75,
      projectsCount: 82,
      rating: 4.9,
      totalHours: 2450,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Priyanka Nair',
      role: 'Full Stack Developer',
      location: 'Bangalore, India',
      avatar: 'assets/images/profiles/avatar-2.jpg',
      performance: 96,
      performanceTier: 'High',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      hourlyRate: 65,
      projectsCount: 64,
      rating: 4.8,
      totalHours: 1980,
      isAvailable: true
    },
    {
      id: 3,
      name: 'Rahul Varma',
      role: 'Product Manager',
      location: 'Hyderabad, India',
      avatar: 'assets/images/profiles/avatar-3.jpg',
      performance: 94,
      performanceTier: 'High',
      skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Analytics'],
      hourlyRate: 85,
      projectsCount: 51,
      rating: 4.7,
      totalHours: 1650,
      isAvailable: true
    },
    {
      id: 4,
      name: 'Ananya Das',
      role: 'Mobile App Developer',
      location: 'Kolkata, India',
      avatar: 'assets/images/profiles/avatar-4.jpg',
      performance: 68,
      performanceTier: 'Medium',
      skills: ['Flutter', 'Dart', 'Firebase', 'API Integration'],
      hourlyRate: 60,
      projectsCount: 78,
      rating: 4.9,
      totalHours: 2210,
      isAvailable: true
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Frontend Developer',
      location: 'Delhi, India',
      avatar: 'assets/images/profiles/avatar-5.jpg',
      performance: 63,
      performanceTier: 'Medium',
      skills: ['React', 'Next.js', 'Tailwind', 'JavaScript'],
      hourlyRate: 70,
      projectsCount: 96,
      rating: 4.8,
      totalHours: 2780,
      isAvailable: true
    },
    {
      id: 6,
      name: 'Sneha Reddy',
      role: 'Content Writer',
      location: 'Chennai, India',
      avatar: 'assets/images/profiles/avatar-6.jpg',
      performance: 59,
      performanceTier: 'Medium',
      skills: ['Content Writing', 'SEO', 'Copywriting', 'Editing'],
      hourlyRate: 40,
      projectsCount: 120,
      rating: 4.7,
      totalHours: 3150,
      isAvailable: true
    },
    {
      id: 7,
      name: 'Rohit Patel',
      role: 'DevOps Engineer',
      location: 'Ahmedabad, India',
      avatar: 'assets/images/profiles/avatar-7.jpg',
      performance: 38,
      performanceTier: 'Low',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      hourlyRate: 65,
      projectsCount: 69,
      rating: 4.8,
      totalHours: 2340,
      isAvailable: true
    },
    {
      id: 8,
      name: 'Ishita Gupta',
      role: 'Graphic Designer',
      location: 'Pune, India',
      avatar: 'assets/images/profiles/avatar-8.jpg',
      performance: 42,
      performanceTier: 'Low',
      skills: ['Photoshop', 'Illustrator', 'Branding', 'UI Design'],
      hourlyRate: 50,
      projectsCount: 88,
      rating: 4.6,
      totalHours: 1920,
      isAvailable: true
    },
    {
      id: 9,
      name: 'Karan Malhotra',
      role: 'Data Scientist',
      location: 'Gurgaon, India',
      avatar: 'assets/images/profiles/avatar-9.jpg',
      performance: 45,
      performanceTier: 'Low',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      hourlyRate: 80,
      projectsCount: 57,
      rating: 4.9,
      totalHours: 2180,
      isAvailable: true
    }
  ];
}

