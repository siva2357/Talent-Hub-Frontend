import { Component } from '@angular/core';
import { Button } from '../../../library/ui/components/button/button';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Capability {
  title: string;
  description: string;
  image: string;
}

interface GettingStartedStep {
  title: string;
  description: string;
  icon: string;
  step: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [Button],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

  features: Feature[] = [
    {
      title: 'Unified Talent Ecosystem',
      description:
        'Manage your complete talent pool spanning all project teams and external resources in one centralized place tailored for modern business needs.',
      icon: 'bi-people-fill'
    },
    {
      title: 'Seamless Collaboration',
      description:
        'Communicate clearly across departments, set roles, access project specific areas, and break down communication silos.',
      icon: 'bi-chat-dots-fill'
    },
    {
      title: 'Scalable for Every Business',
      description:
        'From startups to large enterprise, scale on a platform that evolves efficiently alongside your most demanding business needs.',
      icon: 'bi-graph-up-arrow'
    },
    {
      title: 'Streamlined Work Management',
      description:
        'Overview timelines, track deliverables, and stay connected upon milestones with intelligent workflows built to scale.',
      icon: 'bi-kanban-fill'
    },
    {
      title: 'Secure & Reliable Operations',
      description:
        'Count on enterprise-grade infrastructure, secure data protections, and reliable stability across the environment.',
      icon: 'bi-shield-check'
    },
    {
      title: 'Productivity Driven Experience',
      description:
        'Delight users across desktop and mobile versions with intuitive experiences maximizing value on the platform.',
      icon: 'bi-lightning-charge-fill'
    }
  ];

  aiInsights: string[] = [
    'Auto resource allocation and optimization',
    'Advanced data-driven talent metrics',
    'Actionable insights driving your strategic initiatives'
  ];

  capabilities: Capability[] = [
    {
      title: 'All your data, in one place',
      description:
        'Get a consolidated view connecting cross-project operations allowing leaders to make collaborative changes that drive maximum value.',
      image: '../../../../assets/why-features/talent-matching.jpg'
    },
    {
      title: 'Plan, track, and deliver efficiently.',
      description:
        'Set up workflows, run sprints, evaluate progress, and coordinate with all participants using robust agile based tools.',
      image: '../../../../assets/why-features/project-management.jpg'
    },
    {
      title: 'Track revenue and finance performance.',
      description:
        'Create visual dashboards to analyze overall spend, forecast the bottom line easily, and scale operations on demand.',
      image: '../../../../assets/why-features/financial-insights.jpg'
    },
    {
      title: 'Understand your growth journey.',
      description:
        'Analyze, benchmark, and optimize performance across maximum impact areas effectively.',
      image: '../../../../assets/why-features/growth-analytics.jpg'
    },
    {
      title: 'Monitor performance and reliability.',
      description:
        'User centric dashboards keep your team on track during your most demanding projects.',
      image: '../../../../assets/why-features/system-monitoring.jpg'
    },
    {
      title: 'Communicate without boundaries.',
      description:
        'Break down language barriers, connect seamlessly across borders, and facilitate global growth.',
      image: '../../../../assets/why-features/smart-communication.jpg'
    }
  ];

  gettingStarted: GettingStartedStep[] = [
    {
      title: 'Choose your role & create your account',
      description:
        'Enter a seamless onboarding experience by sharing the details required to get started right away.',
      icon: 'bi-person-plus-fill',
      step: '01'
    },
    {
      title: 'Verify your account & complete your profile',
      description:
        'Add necessary skills, experience, and verify your professional status safely and securely.',
      icon: 'bi-patch-check-fill',
      step: '02'
    },
    {
      title: 'Access your workspace & start collaborating',
      description:
        'Enter your personalized hub to search projects, connect with peers, and get to work seamlessly.',
      icon: 'bi-rocket-takeoff-fill',
      step: '03'
    }
  ];
}