import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface Talent {
  name: string;
  role: string;
  successRate: string;
  description: string;
  skills: string[];
  rate: string;
  availability: string;
  location: string;
}

@Component({
  selector: 'app-hire-talent',
  standalone: true,
  imports: [],
  templateUrl: './hire-talent.html',
  styleUrl: './hire-talent.css'
})
export class HireTalent {

  features: Feature[] = [
    {
      title: 'Profile Review & Verification',
      description:
        'We verify identity, experience, and performance so you can hire with confidence.'
    },
    {
      title: 'Contract & Work History',
      description:
        'Track contracts, milestones, payments, and client history with complete transparency.'
    },
    {
      title: 'Meet & Collaborate',
      description:
        'Communicate seamlessly. Match, discuss, and close via video, text, and chat instantly.'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'Find the Right Talent',
      description:
        'Our match engine recommends exact fit based on skill ranking, budget, language constraints, timezone, and project requirements.'
    },
    {
      number: '02',
      title: 'Review & Connect',
      description:
        'Explore detailed profiles, portfolios, reviews, and testaments, then connect with talent via text, chat, or video.'
    },
    {
      number: '03',
      title: 'Create Contracts & Milestones',
      description:
        'Define project scope, deliverables, timelines, milestones, and final payment terms with complete transparency.'
    },
    {
      number: '04',
      title: 'Manage Projects',
      description:
        'Collaborate with your team via integrated workspaces on voice, video, chats, communications, and track project progress in real time.'
    },
    {
      number: '05',
      title: 'Plan Budget & Resources',
      description:
        'Automate budgets, manage resources, review expenses, and keep your project financially on track.'
    },
    {
      number: '06',
      title: 'Secure Milestone Payments',
      description:
        'Our secure payment gateway guarantees funds are safely deposited, approved, and released automatically.'
    }
  ];

  talents: Talent[] = [
    {
      name: 'Alex Johnson',
      role: 'Senior Frontend Developer',
      successRate: '98% Job Success',
      description:
        'Expert in building scalable web applications. Strong focus on UI/UX and performance optimization.',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      rate: '$60/hr',
      availability: 'Available Now',
      location: 'San Francisco, CA'
    },
    {
      name: 'Sarah Chen',
      role: 'Full Stack Engineer',
      successRate: '100% Job Success',
      description:
        'Full stack developer with extensive experience in cloud architecture and scalable backend systems.',
      skills: ['Node.js', 'Python', 'AWS', 'PostgreSQL'],
      rate: '$85/hr',
      availability: 'In 2 Weeks',
      location: 'Remote'
    },
    {
      name: 'Maria Garcia',
      role: 'UI/UX Designer',
      successRate: '96% Job Success',
      description:
        'Creative designer specializing in intuitive user interfaces, design systems, and engaging user experiences.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      rate: '$55/hr',
      availability: 'Available Now',
      location: 'Madrid, Spain'
    }
  ];
}