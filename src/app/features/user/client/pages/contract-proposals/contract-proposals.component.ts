import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ProposalStatus = 'Applied' | 'Shortlisted' | 'Assessment Scheduled' | 'Interview Scheduled' | 'Hired' | 'Rejected';

export interface Proposal {
  id: number;
  name: string;
  avatar: string;
  role: string;
  location: string;
  matchScore: number;
  matchTier: 'High' | 'Medium' | 'Low';
  coverLetter: string;
  skills: string[];
  hourlyRate: number;
  duration: string;
  successRate: number;
  rating: number;
  status: ProposalStatus;
  isAvailable: boolean;
}

export interface ProposalContract {
  id: number;
  title: string;
  budget: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
  status: string;
  proposals: Proposal[];
}

@Component({
  selector: 'app-contract-proposals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contract-proposals.component.html',
  styleUrl: './contract-proposals.component.css'
})
export class ContractProposalsComponent {
  expandedContractId: number | null = 1;
  searchQuery: string = '';

  contracts: ProposalContract[] = [
    {
      id: 1,
      title: 'Frontend Re-architecture & UI Modernization',
      budget: 8500,
      spent: 4500,
      remaining: 4000,
      startDate: 'May 01, 2026',
      endDate: 'Jul 15, 2026',
      status: 'Active',
      proposals: [
        {
          id: 101,
          name: 'Sarah Connor',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
          role: 'Senior Angular Specialist & UI Architect',
          location: 'Austin, TX, USA',
          matchScore: 98,
          matchTier: 'High',
          coverLetter: 'I would love to help you modernize your frontend architecture! Having worked with Angular for 6+ years, I specialize in standalone components, responsive animations, and robust modular design patterns.',
          skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Vivid Styling'],
          hourlyRate: 65,
          duration: '4 Weeks',
          successRate: 100,
          rating: 4.9,
          status: 'Applied',
          isAvailable: true
        },
        {
          id: 102,
          name: 'John Connor',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
          role: 'UI/UX Designer & Prototyper',
          location: 'Toronto, Canada',
          matchScore: 91,
          matchTier: 'High',
          coverLetter: 'Hi! I focus on building extremely premium, interactive web designs. I will deliver stunning glassmorphism layouts, harmonious customized color schemes, and seamless prototype transition details.',
          skills: ['Figma', 'UI Design', 'CSS Grid', 'Micro-animations', 'UX Research'],
          hourlyRate: 50,
          duration: '3 Weeks',
          successRate: 98,
          rating: 5.0,
          status: 'Shortlisted',
          isAvailable: false
        },
        {
          id: 103,
          name: 'T-800 Cyberdyne',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
          role: 'QA Automation & Performance Tester',
          location: 'Silicon Valley, CA',
          matchScore: 68,
          matchTier: 'Low',
          coverLetter: 'I will systematically analyze your software codebase, establish comprehensive end-to-end Cypress tests, and automate your deployments. High performance and absolute stability guaranteed.',
          skills: ['Cypress', 'CI/CD', 'Jest', 'Playwright', 'Load Testing'],
          hourlyRate: 70,
          duration: '8 Weeks',
          successRate: 90,
          rating: 4.6,
          status: 'Assessment Scheduled',
          isAvailable: true
        }
      ]
    },
    {
      id: 2,
      title: 'Backend API Optimization',
      budget: 5000,
      spent: 1000,
      remaining: 4000,
      startDate: 'Apr 01, 2026',
      endDate: 'Jun 10, 2026',
      status: 'Active',
      proposals: [
        {
          id: 201,
          name: 'Marcus Wright',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          role: 'Full Stack Node.js Engineer',
          location: 'Berlin, Germany',
          matchScore: 84,
          matchTier: 'Medium',
          coverLetter: 'Hello! I have reviewed your API optimization needs. I can scale your backend routes, configure optimized Redis caching mechanisms, and trim down your database query latencies by up to 40%.',
          skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
          hourlyRate: 55,
          duration: '6 Weeks',
          successRate: 95,
          rating: 4.8,
          status: 'Interview Scheduled',
          isAvailable: true
        }
      ]
    }
  ];

  toggleContract(id: number) {
    this.expandedContractId = this.expandedContractId === id ? null : id;
  }

  advanceStatus(contractId: number, proposalId: number) {
    const contract = this.contracts.find(c => c.id === contractId);
    if (!contract) return;
    const proposal = contract.proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    switch (proposal.status) {
      case 'Applied':
        proposal.status = 'Shortlisted';
        break;
      case 'Shortlisted':
        proposal.status = 'Assessment Scheduled';
        break;
      case 'Assessment Scheduled':
        proposal.status = 'Interview Scheduled';
        break;
      case 'Interview Scheduled':
        proposal.status = 'Hired';
        break;
      case 'Hired':
        proposal.status = 'Rejected';
        break;
    }
  }

  updateStatus(contractId: number, proposalId: number, status: ProposalStatus) {
    const contract = this.contracts.find(c => c.id === contractId);
    if (!contract) return;
    const proposal = contract.proposals.find(p => p.id === proposalId);
    if (proposal) {
      proposal.status = status;
    }
  }

  getStatusLabel(status: ProposalStatus): string {
    switch (status) {
      case 'Assessment Scheduled': return 'Assessment';
      case 'Interview Scheduled': return 'Interview';
      default: return status;
    }
  }

  getFilteredProposals(proposals: Proposal[]): Proposal[] {
    if (!this.searchQuery.trim()) return proposals;
    const q = this.searchQuery.toLowerCase();
    return proposals.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.role.toLowerCase().includes(q) || 
      p.skills.some(s => s.toLowerCase().includes(q))
    );
  }
}
