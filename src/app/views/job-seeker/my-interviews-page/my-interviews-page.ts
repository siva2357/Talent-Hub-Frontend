import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Loader } from '../../../library/ui/components/loader/loader';
import { MeetCard, MeetCardData } from '../../../library/shared/components/meet-card/meet-card';

export const STATIC_WORKSPHERE_INTERVIEWS: MeetCardData[] = [
  {
    _id: 'int-ws-301',
    contractTitle: 'TechNova Solutions • Principal Frontend Engineer',
    interview: {
      title: 'Round 1: Angular Architecture & System Design',
      description:
        'Live technical architecture discussion and micro-frontend state management deep dive. Join link: https://assessment-studio-94716.web.app/',
      date: '2026-11-19T15:00:00',
      status: 'scheduled',
      feedback: ''
    },
    otherUser: {
      name: 'Vikramaditya Rao (VP Engineering)',
      email: 'vikram.rao@technova.io'
    },
    applicationStatus: 'Interview Scheduled'
  },
  {
    _id: 'int-ws-302',
    contractTitle: 'CloudScale Systems • Senior Cloud & Backend Architect',
    interview: {
      title: 'Round 2: Distributed Systems & Kubernetes Live Round',
      description:
        'High-availability backend architecture and multi-region AWS failover simulation. Join link: https://assessment-studio-94716.web.app/',
      date: '2026-11-21T11:30:00',
      status: 'upcoming',
      feedback: ''
    },
    otherUser: {
      name: 'Ananya Deshmukh (Principal Cloud Architect)',
      email: 'ananya.d@cloudscale.io'
    },
    applicationStatus: 'Interview Scheduled'
  },
  {
    _id: 'int-ws-303',
    contractTitle: 'Aether AI Labs • AI Product Engineer (LLM & Web)',
    interview: {
      title: 'Round 1: LLM RAG & Full Stack Integration Discussion',
      description:
        'Technical walkthrough of streaming copilot UI and FastAPI RAG orchestration. Join link: https://assessment-studio-94716.web.app/',
      date: '2026-11-23T16:30:00',
      status: 'scheduled',
      feedback: ''
    },
    otherUser: {
      name: 'Dr. Rohan Mehta (Head of Applied AI)',
      email: 'rohan.mehta@aetherai.io'
    },
    applicationStatus: 'Interview Scheduled'
  },
  {
    _id: 'int-ws-304',
    contractTitle: 'FinEdge Corp • Full Stack Lead Engineer',
    interview: {
      title: 'Final Round: Hiring Manager & Techno-Managerial Fit',
      description:
        'Completed final leadership and digital banking compliance round with the engineering director. Join link: https://assessment-studio-94716.web.app/',
      date: '2026-11-08T14:00:00',
      status: 'completed',
      feedback: 'Strong system design and security fundamentals.'
    },
    otherUser: {
      name: 'Siddharth Malhotra (Director of Engineering)',
      email: 'siddharth@finedge.io'
    },
    applicationStatus: 'Offer Released'
  },
  {
    _id: 'int-ws-305',
    contractTitle: 'NexaVerse Commerce • Staff UI/UX & Design Systems',
    interview: {
      title: 'Round 1: Design Systems & Component Architecture',
      description:
        'Discussion on accessible Angular UI primitives, design tokens, and performance budgets. Join link: https://assessment-studio-94716.web.app/',
      date: '2026-11-12T10:30:00',
      status: 'completed',
      feedback: ''
    },
    otherUser: {
      name: 'Meera Krishnan (Staff Frontend Lead)',
      email: 'meera.k@nexaverse.io'
    },
    applicationStatus: 'Shortlisted'
  }
];

@Component({
  selector: 'app-my-interviews-page',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Loader, MeetCard],
  templateUrl: './my-interviews-page.html',
  styleUrl: './my-interviews-page.css'
})
export class MyInterviewsPage implements OnInit {
  activeTab: 'upcoming' | 'completed' = 'upcoming';
  allInterviews: MeetCardData[] = [];
  filteredInterviews: MeetCardData[] = [];
  isLoading: boolean = false;
  actionMessage: string | null = null;

  searchQuery: string = '';
  selectedStatus: string = 'all';

  statusOptions: InputOption[] = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' }
  ];

  activeFilters: string[] = ['Worksphere Video Studio', 'Live Technical Rounds'];

  ngOnInit(): void {
    this.allInterviews = STATIC_WORKSPHERE_INTERVIEWS.map(i => ({
      ...i,
      interview: { ...i.interview },
      otherUser: { ...i.otherUser }
    }));
    this.applyFilters();
  }

  get upcomingInterviews(): MeetCardData[] {
    return this.filteredInterviews.filter(
      m => m.interview.status === 'scheduled' || m.interview.status === 'upcoming'
    );
  }

  get completedInterviews(): MeetCardData[] {
    return this.filteredInterviews.filter(
      m => m.interview.status === 'completed' || m.interview.status === 'cancelled'
    );
  }

  setTab(tab: 'upcoming' | 'completed'): void {
    this.activeTab = tab;
  }

  applyFilters(): void {
    this.filteredInterviews = this.allInterviews.filter(item => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        item.contractTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.interview.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.otherUser.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        this.selectedStatus === 'all' ||
        item.interview.status.toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.activeFilters = ['Worksphere Video Studio', 'Live Technical Rounds'];
    this.applyFilters();
  }

  removeFilter(filterToRemove: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filterToRemove);
  }

  onJoin(meeting: MeetCardData): void {
    this.actionMessage = `Launched Worksphere Interview Studio for "${meeting.interview.title}" with ${meeting.otherUser.name}.`;
  }
}
