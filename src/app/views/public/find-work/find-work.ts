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

interface Contract {
  title: string;
  client: string;
  description: string;
  skills: string[];
  budget: string;
  duration: string;
  match: string;
}

@Component({
  selector: 'app-find-work',
  standalone: true,
  imports: [],
  templateUrl: './find-work.html',
  styleUrl: './find-work.css'
})
export class FindWork {

  features: Feature[] = [
    {
      title: 'AI-Powered Matching',
      description:
        'Get pro-active matching for contracts that align with your skills, experience, and interests.'
    },
    {
      title: 'Quality Opportunities',
      description:
        'Work with high-quality global companies spanning across various industries.'
    },
    {
      title: 'Collaborate Seamlessly',
      description:
        'Built-in tools to manage tasks, communicate, and ensure smooth project delivery.'
    },
    {
      title: 'Build Your Reputation',
      description:
        'Earn ratings, showcase your portfolio, and establish a successful track record.'
    }
  ];

  workspacePoints: string[] = [
    'Flexible milestones & easy task tracking',
    'Integrated communication tools',
    'Secure payments & automated invoicing'
  ];

  processSteps: ProcessStep[] = [
    {
      number: '01',
      title: 'AI Skill Matching',
      description:
        'Our AI engine matches your skills, experience, and interests with the exact right contract needs.'
    },
    {
      number: '02',
      title: 'AI Proposal Assistant',
      description:
        'Customize and perfect your project requests, budgets, and milestones based on data-backed insights.'
    },
    {
      number: '03',
      title: 'AI Contract & Client Assistant',
      description:
        'Execute contracts seamlessly with automated tracking and invoicing to ensure you always get paid.'
    },
    {
      number: '04',
      title: 'AI Skill Matching',
      description:
        'Our AI engine matches your skills, experience, and interests with the exact right contract needs.'
    },
    {
      number: '05',
      title: 'AI Proposal Assistant',
      description:
        'Customize and perfect your project requests, budgets, and milestones based on data-backed insights.'
    },
    {
      number: '06',
      title: 'AI Contract & Client Assistant',
      description:
        'Execute contracts seamlessly with automated tracking and invoicing to ensure you always get paid.'
    }
  ];

  contracts: Contract[] = [
    {
      title: 'Freelance Dashboard UI',
      client: 'Alex Johnson',
      description:
        'Build a modern admin dashboard with Angular 18, TypeScript, and Tailwind.',
      skills: [
        'Angular',
        'TypeScript',
        'Tailwind CSS',
        'REST API'
      ],
      budget: '₹30,000',
      duration: '3 Months',
      match: '96% Match'
    },
    {
      title: '3D Creator Web Platform',
      client: 'Sarah Chen',
      description:
        'Seeking an experienced full-stack developer to help build a new web-based 3D editing platform.',
      skills: [
        'React',
        'Node.js',
        'Three.js'
      ],
      budget: '$80/hr',
      duration: '3 Months',
      match: '88% Match'
    },
    {
      title: 'FinTech Mobile Application',
      client: 'FinCore',
      description:
        'Help launch a mobile application for the next generation of automated investing platform.',
      skills: [
        'React Native',
        'TypeScript',
        'Redux'
      ],
      budget: '$75/hr',
      duration: '6 Months',
      match: '92% Match'
    }
  ];

  hiringSteps: Feature[] = [
    {
      title: 'Discover matching contracts',
      description:
        "Get proactive recommendations based on your skills, experience, and interests so you don't waste time on irrelevant leads."
    },
    {
      title: 'Apply & get shortlisted',
      description:
        'Submit proposals, communicate with clients, and manage your interviews efficiently through the platform.'
    },
    {
      title: 'Start working & get paid',
      description:
        'Collaborate securely, deliver high-quality work, and receive guaranteed on-time payments through our escrow service.'
    }
  ];
}