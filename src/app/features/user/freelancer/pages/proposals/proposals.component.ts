import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';

interface Proposal {
  id: string;
  contractTitle: string;
  client: string;
  date: string;
  budget: string;
  budgetLabel: string;
  duration: string;
  type: 'Applied' | 'Assignment' | 'Interview' | 'Shortlisted' | 'Rejected';
  contractType: 'Fixed Price' | 'Hourly';
  level: 'Entry' | 'Intermediate' | 'Expert';
  description: string;
  techStack: string[];
  status: string;
  deadline?: string;
  link?: string;
  meetingTime?: string;
}

interface ActiveFilter {
  id: string;
  label: string;
  type: 'search' | 'date' | 'budget' | 'status';
}

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent, ChipComponent],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.css'
})
export class ProposalsComponent {
  // Filter Selection State (Internal)
  searchQuery: string = '';
  dateFilter: string = 'All Time';
  budgetFilter: string = 'All Budgets';
  statusFilter: string = 'All Status';

  // Active Filters (Applied)
  activeFilters: ActiveFilter[] = [];

  // Options
  dateOptions = [
    { label: 'All Time', value: 'All Time' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' }
  ];

  budgetOptions = [
    { label: 'All Budgets', value: 'All Budgets' },
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Hourly', value: 'Hourly' }
  ];

  statusOptions = [
    { label: 'All Status', value: 'All Status' },
    { label: 'Applied', value: 'Applied' },
    { label: 'Assignment', value: 'Assignment' },
    { label: 'Interview', value: 'Interview' },
    { label: 'Shortlisted', value: 'Shortlisted' },
    { label: 'Rejected', value: 'Rejected' }
  ];

  allProposals: Proposal[] = [
    { 
      id: '1', 
      contractTitle: 'Senior Angular Developer', 
      client: 'TechNova', 
      date: 'Oct 12, 2023', 
      budget: '$5,000', 
      budgetLabel: 'Proposal Amount',
      duration: '3 Months',
      contractType: 'Fixed Price',
      level: 'Expert',
      description: 'Lead the frontend development of an enterprise SaaS analytics platform.',
      techStack: ['Angular', 'NgRx', 'RxJS'],
      status: 'Pending', 
      type: 'Applied' 
    },
    { 
      id: '2', 
      contractTitle: 'UI Designer for Mobile App', 
      client: 'GrowthLabs', 
      date: 'Oct 15, 2023', 
      budget: '$3,200', 
      budgetLabel: 'Estimated Pay',
      duration: '1 Month',
      contractType: 'Fixed Price',
      level: 'Intermediate',
      description: 'Design a clean and modern user interface for a fitness tracking application.',
      techStack: ['Figma', 'UI/UX', 'Prototyping'],
      status: 'Under Review', 
      type: 'Applied' 
    },
    { 
      id: '3', 
      contractTitle: 'Frontend Optimization Task', 
      client: 'SaaSify', 
      date: 'Oct 08, 2023', 
      budget: '$1,500', 
      budgetLabel: 'Task Payment',
      duration: '2 Weeks',
      contractType: 'Fixed Price',
      level: 'Expert',
      description: 'Optimize core web vitals and bundle size for a high-traffic dashboard.',
      techStack: ['Angular', 'Web Vitals', 'Performance'],
      status: 'Shortlisted for Assessment',
      type: 'Assignment',
      deadline: 'Oct 20, 2023',
      link: 'https://assessment.talenthub.com/task/342'
    },
    { 
      id: '4', 
      contractTitle: 'Lead React Engineer', 
      client: 'CloudFlow', 
      date: 'Oct 05, 2023', 
      budget: '$8,000', 
      budgetLabel: 'Monthly Rate',
      duration: '6 Months',
      contractType: 'Hourly',
      level: 'Expert',
      description: 'Manage a team of developers to build scalable cloud infrastructure tools.',
      techStack: ['React', 'TypeScript', 'AWS'],
      status: 'Interview Scheduled',
      type: 'Interview',
      meetingTime: 'Oct 18, 2023 - 10:00 AM EST',
      link: 'https://meet.talenthub.com/j/lead-react-456'
    },
    { 
      id: '5', 
      contractTitle: 'Python Data Scraper', 
      client: 'DataQuest', 
      date: 'Oct 01, 2023', 
      budget: '$2,500', 
      budgetLabel: 'Project Budget',
      duration: '1 Month',
      contractType: 'Fixed Price',
      level: 'Intermediate',
      description: 'Develop a high-performance data scraping tool for real estate analytics.',
      techStack: ['Python', 'Scrapy', 'MongoDB'],
      status: 'Shortlisted', 
      type: 'Shortlisted' 
    },
    { 
      id: '6', 
      contractTitle: 'E-commerce Redesign', 
      client: 'ShopZilla', 
      date: 'Sep 25, 2023', 
      budget: '$4,000', 
      budgetLabel: 'Proposal Amount',
      duration: '2 Months',
      contractType: 'Fixed Price',
      level: 'Expert',
      description: 'Complete UI/UX overhaul of an existing electronics e-commerce store.',
      techStack: ['React', 'Node.js', 'Tailwind'],
      status: 'Rejected', 
      type: 'Rejected' 
    }
  ];

  appliedProposals: Proposal[] = [...this.allProposals];

  constructor() {
    this.applyFilters();
  }

  applyFilters() {
    // 1. Update Active Chips
    this.activeFilters = [];
    if (this.searchQuery) {
      this.activeFilters.push({ id: 'search', label: `Search: ${this.searchQuery}`, type: 'search' });
    }
    if (this.dateFilter !== 'All Time') {
      this.activeFilters.push({ id: 'date', label: this.dateFilter, type: 'date' });
    }
    if (this.budgetFilter !== 'All Budgets') {
      this.activeFilters.push({ id: 'budget', label: this.budgetFilter, type: 'budget' });
    }
    if (this.statusFilter !== 'All Status') {
      this.activeFilters.push({ id: 'status', label: this.statusFilter, type: 'status' });
    }

    // 2. Filter Data
    this.appliedProposals = this.allProposals.filter(p => {
      const matchesSearch = p.contractTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          p.client.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'All Status' || p.type === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  removeActiveFilter(filter: ActiveFilter) {
    if (filter.id === 'search') this.searchQuery = '';
    if (filter.id === 'date') this.dateFilter = 'All Time';
    if (filter.id === 'budget') this.budgetFilter = 'All Budgets';
    if (filter.id === 'status') this.statusFilter = 'All Status';
    this.applyFilters();
  }

  resetAll() {
    this.searchQuery = '';
    this.dateFilter = 'All Time';
    this.budgetFilter = 'All Budgets';
    this.statusFilter = 'All Status';
    this.applyFilters();
  }
}
