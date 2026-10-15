import { Component } from '@angular/core';
import { ContractCard } from '../../../library/shared/components/contract-card/contract-card';
import { Contract } from '../../../core/models/contract.model';


interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

@Component({
  selector: 'app-find-work',
  standalone: true,
  imports: [ContractCard],
  templateUrl: './find-work.html',
  styleUrl: './find-work.css'
})
export class FindWork {

  features: Feature[] = [
    {
      title: 'AI-Powered Matching',
      description:
        'Get pro-active matching for contracts that align with your skills, experience, and interests.',
      icon: 'bi-stars'
    },
    {
      title: 'Quality Opportunities',
      description:
        'Work with high-quality global companies spanning across various industries.',
      icon: 'bi-award'
    },
    {
      title: 'Collaborate Seamlessly',
      description:
        'Built-in tools to manage tasks, communicate, and ensure smooth project delivery.',
      icon: 'bi-people'
    },
    {
      title: 'Build Your Reputation',
      description:
        'Earn ratings, showcase your portfolio, and establish a successful track record.',
      icon: 'bi-graph-up-arrow'
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
        'Our AI engine matches your skills, experience, and interests with the exact right contract needs.',
      icon: 'bi-cpu'
    },
    {
      number: '02',
      title: 'AI Proposal Assistant',
      description:
        'Customize and perfect your project requests, budgets, and milestones based on data-backed insights.',
      icon: 'bi-file-earmark-text'
    },
    {
      number: '03',
      title: 'Contract Execution',
      description:
        'Execute contracts seamlessly with automated tracking and milestones with complete transparency.',
      icon: 'bi-file-earmark-check'
    },
    {
      number: '04',
      title: 'Collaborate & Deliver',
      description:
        'Manage tasks, milestones, and deliver work directly inside integrated real-time workspaces.',
      icon: 'bi-kanban'
    },
    {
      number: '05',
      title: 'Client Communication',
      description:
        'Chat, conduct video reviews, and exchange files instantly within the project workspace.',
      icon: 'bi-chat-dots'
    },
    {
      number: '06',
      title: 'Guaranteed Payments',
      description:
        'Automated escrow security ensures prompt, full payments are released upon milestone completion.',
      icon: 'bi-shield-check'
    }
  ];

  contracts: Contract[] = [
    {
      _id: 'c1',
      clientId: 'client-1',
      contractTitle: 'Freelance Dashboard UI',
      contractCategory: 'Frontend Development',
      contractSubject: 'Angular & TypeScript UI',
      contractDescription:
        'Build a modern admin dashboard with Angular 18, TypeScript, and responsive layout with real-time analytics.',
      industry: 'Information Technology',
      contractType: 'Fixed Price',
      currency: '₹',
      estimatedBudget: 30000,
      contractStartDate: '2026-03-01',
      contractEndDate: '2026-06-01',
      totalDuration: '3 Months',
      status: 'open',
      clientName: 'Alex Johnson',
      hasApplied: false,
      hasSaved: false,
      matchPercentage: 96,
      matchCategory: 'High'
    },
    {
      _id: 'c2',
      clientId: 'client-2',
      contractTitle: '3D Creator Web Platform',
      contractCategory: 'Full Stack Development',
      contractSubject: 'WebGL & Three.js Studio',
      contractDescription:
        'Seeking an experienced full-stack developer to help build a new web-based 3D editing platform and studio suite.',
      industry: 'Creative & Design',
      contractType: 'Hourly',
      currency: '$',
      estimatedBudget: 8500,
      contractStartDate: '2026-03-15',
      contractEndDate: '2026-06-15',
      totalDuration: '3 Months',
      status: 'open',
      clientName: 'Sarah Chen',
      hasApplied: false,
      hasSaved: true,
      matchPercentage: 92,
      matchCategory: 'High'
    },
    {
      _id: 'c3',
      clientId: 'client-3',
      contractTitle: 'FinTech Mobile Application',
      contractCategory: 'Mobile Development',
      contractSubject: 'React Native & Redux',
      contractDescription:
        'Help launch a secure mobile application for the next generation automated investing and portfolio tracking platform.',
      industry: 'Financial Services',
      contractType: 'Fixed Price',
      currency: '$',
      estimatedBudget: 12000,
      contractStartDate: '2026-04-01',
      contractEndDate: '2026-10-01',
      totalDuration: '6 Months',
      status: 'open',
      clientName: 'FinCore Labs',
      hasApplied: false,
      hasSaved: false,
      matchPercentage: 98,
      matchCategory: 'High'
    },
    {
      _id: 'c4',
      clientId: 'client-4',
      contractTitle: 'Cloud Infrastructure Migration',
      contractCategory: 'DevOps & Cloud',
      contractSubject: 'AWS & Kubernetes Architecture',
      contractDescription:
        'Migrate on-premise microservices into automated AWS EKS clusters with Terraform and CI/CD pipelines.',
      industry: 'Enterprise Software',
      contractType: 'Hourly',
      currency: '$',
      estimatedBudget: 15000,
      contractStartDate: '2026-04-15',
      contractEndDate: '2026-08-15',
      totalDuration: '4 Months',
      status: 'open',
      clientName: 'CloudPeak Systems',
      hasApplied: false,
      hasSaved: false,
      matchPercentage: 95,
      matchCategory: 'High'
    },
    {
      _id: 'c5',
      clientId: 'client-5',
      contractTitle: 'AI Conversational Assistant',
      contractCategory: 'Artificial Intelligence',
      contractSubject: 'Python & LangChain Suite',
      contractDescription:
        'Develop a domain-specific retrieval-augmented generation (RAG) assistant for customer query automation.',
      industry: 'Healthcare Tech',
      contractType: 'Fixed Price',
      currency: '$',
      estimatedBudget: 9500,
      contractStartDate: '2026-05-01',
      contractEndDate: '2026-08-01',
      totalDuration: '3 Months',
      status: 'open',
      clientName: 'MediQuery AI',
      hasApplied: false,
      hasSaved: true,
      matchPercentage: 94,
      matchCategory: 'High'
    },
    {
      _id: 'c6',
      clientId: 'client-6',
      contractTitle: 'E-Commerce Checkout & Payments',
      contractCategory: 'Backend Architecture',
      contractSubject: 'Node.js & Gateway Integration',
      contractDescription:
        'Overhaul payment workflows with multi-currency checkout, webhooks resilience, and fraud risk monitoring.',
      industry: 'Retail & E-Commerce',
      contractType: 'Fixed Price',
      currency: '₹',
      estimatedBudget: 65000,
      contractStartDate: '2026-03-20',
      contractEndDate: '2026-06-20',
      totalDuration: '3 Months',
      status: 'open',
      clientName: 'ShopSphere Global',
      hasApplied: false,
      hasSaved: false,
      matchPercentage: 97,
      matchCategory: 'High'
    }
  ];

  hiringSteps: Feature[] = [
    {
      title: 'Discover matching contracts',
      description:
        "Get proactive recommendations based on your skills, experience, and interests so you don't waste time on irrelevant leads.",
      icon: 'bi-search'
    },
    {
      title: 'Apply & get shortlisted',
      description:
        'Submit proposals, communicate with clients, and manage your interviews efficiently through the platform.',
      icon: 'bi-send'
    },
    {
      title: 'Start working & get paid',
      description:
        'Collaborate securely, deliver high-quality work, and receive guaranteed on-time payments through our escrow service.',
      icon: 'bi-cash-coin'
    }
  ];

  onApplyContract(contract: Contract): void {
    contract.hasApplied = !contract.hasApplied;
  }

  onSaveContract(contract: Contract): void {
    contract.hasSaved = !contract.hasSaved;
  }
}