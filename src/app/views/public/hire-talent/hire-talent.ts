import { Component } from '@angular/core';
import { TalentCard } from '../../../library/shared/components/talent-card/talent-card';
import { TalentCardData } from '../../../core/models/talent.model';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-hire-talent',
  standalone: true,
  imports: [TalentCard],
  templateUrl: './hire-talent.html',
  styleUrl: './hire-talent.css'
})
export class HireTalent {

  features: Feature[] = [
    {
      title: 'Profile Review & Verification',
      description:
        'We verify identity, experience, and performance so you can hire with confidence.',
      icon: 'bi-patch-check'
    },
    {
      title: 'Contract & Work History',
      description:
        'Track contracts, milestones, payments, and client history with complete transparency.',
      icon: 'bi-file-earmark-text'
    },
    {
      title: 'Meet & Collaborate',
      description:
        'Communicate seamlessly. Match, discuss, and close via video, text, and chat instantly.',
      icon: 'bi-chat-dots'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'Find the Right Talent',
      description:
        'Our match engine recommends exact fit based on skill ranking, budget, language constraints, timezone, and project requirements.',
      icon: 'bi-search'
    },
    {
      number: '02',
      title: 'Review & Connect',
      description:
        'Explore detailed profiles, portfolios, reviews, and testaments, then connect with talent via text, chat, or video.',
      icon: 'bi-person-badge'
    },
    {
      number: '03',
      title: 'Create Contracts & Milestones',
      description:
        'Define project scope, deliverables, timelines, milestones, and final payment terms with complete transparency.',
      icon: 'bi-file-earmark-check'
    },
    {
      number: '04',
      title: 'Manage Projects',
      description:
        'Collaborate with your team via integrated workspaces on voice, video, chats, communications, and track project progress in real time.',
      icon: 'bi-kanban'
    },
    {
      number: '05',
      title: 'Plan Budget & Resources',
      description:
        'Automate budgets, manage resources, review expenses, and keep your project financially on track.',
      icon: 'bi-wallet2'
    },
    {
      number: '06',
      title: 'Secure Milestone Payments',
      description:
        'Our secure payment gateway guarantees funds are safely deposited, approved, and released automatically.',
      icon: 'bi-shield-lock'
    }
  ];

  talents: TalentCardData[] = [
    {
      _id: '1',
      userId: 'u1',
      profilePhoto: '',
      fullName: 'Alex Johnson',
      email: 'alex@example.com',
      gender: 'Male',
      categories: ['Frontend Development'],
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      country: 'USA',
      city: 'San Francisco',
      state: 'CA',
      availability: ['Available Now'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      activeContracts: 2,
      completedContracts: 24,
      jobSuccessRate: 98,
      riskStatus: 'Low Risk',
      isSaved: false,
      status: 'active',
      matchPercentage: 96,
      matchCategory: 'High'
    },
    {
      _id: '2',
      userId: 'u2',
      profilePhoto: '',
      fullName: 'Sarah Chen',
      email: 'sarah@example.com',
      gender: 'Female',
      categories: ['Full Stack Development'],
      skills: ['Node.js', 'Python', 'AWS', 'PostgreSQL'],
      country: 'USA',
      city: 'New York',
      state: 'NY',
      availability: ['In 2 Weeks'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      activeContracts: 3,
      completedContracts: 38,
      jobSuccessRate: 100,
      riskStatus: 'Low Risk',
      isSaved: false,
      status: 'active',
      matchPercentage: 99,
      matchCategory: 'Elite'
    },
    {
      _id: '3',
      userId: 'u3',
      profilePhoto: '',
      fullName: 'Maria Garcia',
      email: 'maria@example.com',
      gender: 'Female',
      categories: ['UI/UX Design'],
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      country: 'Spain',
      city: 'Madrid',
      state: '',
      availability: ['Available Now'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      activeContracts: 1,
      completedContracts: 19,
      jobSuccessRate: 96,
      riskStatus: 'Low Risk',
      isSaved: false,
      status: 'active',
      matchPercentage: 94,
      matchCategory: 'High'
    },
    {
      _id: '4',
      userId: 'u4',
      profilePhoto: '',
      fullName: 'David Kim',
      email: 'david.kim@example.com',
      gender: 'Male',
      categories: ['DevOps & Cloud Engineering'],
      skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
      country: 'Canada',
      city: 'Vancouver',
      state: 'BC',
      availability: ['Available Now'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      activeContracts: 2,
      completedContracts: 31,
      jobSuccessRate: 99,
      riskStatus: 'Low Risk',
      isSaved: false,
      status: 'active',
      matchPercentage: 97,
      matchCategory: 'Elite'
    },
    {
      _id: '5',
      userId: 'u5',
      profilePhoto: '',
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      gender: 'Female',
      categories: ['Mobile App Development'],
      skills: ['Flutter', 'React Native', 'Swift', 'Kotlin'],
      country: 'India',
      city: 'Bengaluru',
      state: 'KA',
      availability: ['Part-Time'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      activeContracts: 1,
      completedContracts: 27,
      jobSuccessRate: 97,
      riskStatus: 'Low Risk',
      isSaved: false,
      status: 'active',
      matchPercentage: 95,
      matchCategory: 'High'
    },
    {
      _id: '6',
      userId: 'u6',
      profilePhoto: '',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      gender: 'Male',
      categories: ['Data Science & AI'],
      skills: ['Python', 'PyTorch', 'NLP', 'TensorFlow'],
      country: 'UK',
      city: 'London',
      state: 'ENG',
      availability: ['Available Now'],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      activeContracts: 3,
      completedContracts: 42,
      jobSuccessRate: 100,
      riskStatus: 'Low Risk',
      isSaved: false,
      status: 'active',
      matchPercentage: 98,
      matchCategory: 'Elite'
    }
  ];

  onSaveTalent(talent: TalentCardData): void {
    talent.isSaved = !talent.isSaved;
  }
}