import { Component } from '@angular/core';
import { Button } from '../../../library/ui/components/button/button';

interface Feature {
  title: string;
  description: string;
}

interface Capability {
  title: string;
  description: string;
  image: string;
}

interface GettingStartedStep {
  title: string;
  description: string;
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
        'Manage your complete talent pool spanning all project teams and external resources in one centralized place tailored for modern business needs.'
    },
    {
      title: 'Seamless Collaboration',
      description:
        'Communicate clearly across departments, set roles, access project specific areas, and break down communication silos.'
    },
    {
      title: 'Scalable for Every Business',
      description:
        'From startups to large enterprise, scale on a platform that evolves efficiently alongside your most demanding business needs.'
    },
    {
      title: 'Streamlined Work Management',
      description:
        'Overview timelines, track deliverables, and stay connected upon milestones with intelligent workflows built to scale.'
    },
    {
      title: 'Secure & Reliable Operations',
      description:
        'Count on enterprise-grade infrastructure, secure data protections, and reliable stability across the environment.'
    },
    {
      title: 'Productivity Driven Experience',
      description:
        'Delight users across desktop and mobile versions with intuitive experiences maximizing value on the platform.'
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
      image: '../../../../assets/img-placeholder.webp'
    },
    {
      title: 'Plan, track, and deliver efficiently.',
      description:
        'Set up workflows, run sprints, evaluate progress, and coordinate with all participants using robust agile based tools.',
      image: '../../../../assets/img-placeholder.webp'
    },
    {
      title: 'Track revenue and finance performance.',
      description:
        'Create visual dashboards to analyze overall spend, forecast the bottom line easily, and scale operations on demand.',
      image: '../../../../assets/img-placeholder.webp'
    },
    {
      title: 'Understand your growth journey.',
      description:
        'Analyze, benchmark, and optimize performance across maximum impact areas effectively.',
      image: '../../../../assets/img-placeholder.webp'
    },
    {
      title: 'Monitor performance and reliability.',
      description:
        'User centric dashboards keep your team on track during your most demanding projects.',
      image: '../../../../assets/img-placeholder.webp'
    },
    {
      title: 'Communicate without boundaries.',
      description:
        'Break down language barriers, connect seamlessly across borders, and facilitate global growth.',
      image: '../../../../assets/img-placeholder.webp'
    }
  ];

  gettingStarted: GettingStartedStep[] = [
    {
      title: 'Choose your role & create your account',
      description:
        'Enter a seamless onboarding experience by sharing the details required to get started right away.'
    },
    {
      title: 'Verify your account & complete your profile',
      description:
        'Add necessary skills, experience, and verify your professional status safely and securely.'
    },
    {
      title: 'Access your workspace & start collaborating',
      description:
        'Enter your personalized hub to search projects, connect with peers, and get to work seamlessly.'
    }
  ];
}