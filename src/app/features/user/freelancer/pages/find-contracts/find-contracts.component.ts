import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

interface Contract {
  id: string;
  title: string;
  type: 'Fixed Price' | 'Hourly';
  level: 'Entry' | 'Intermediate' | 'Expert';
  description: string;
  techStack: string[];
  budget: string;
  budgetLabel: string;
  duration: string;
  postedDate: string;
}

@Component({
  selector: 'app-find-contracts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
  templateUrl: './find-contracts.component.html',
  styleUrl: './find-contracts.component.css'
})
export class FindContractsComponent {
  searchQuery: string = '';
  selectedCategory: string = 'All Categories';
  selectedLevel: string = 'All Levels';

  categories = ['All Categories', 'Web Development', 'Mobile Apps', 'UI/UX Design', 'DevOps', 'Data Science'];
  experienceLevels = ['All Levels', 'Entry', 'Intermediate', 'Expert'];

  contracts: Contract[] = [
    {
      id: '1',
      title: 'Senior Angular Developer for Enterprise SaaS',
      type: 'Fixed Price',
      level: 'Expert',
      description: 'We are looking for a highly skilled Angular developer to help us scale our enterprise SaaS platform. Experience with NgRx and complex data visualizations is a must.',
      techStack: ['Angular', 'NgRx', 'D3.js', 'TypeScript'],
      budget: '$5,000 - $8,000',
      budgetLabel: 'Fixed Price',
      duration: '3-6 Months',
      postedDate: '2 hours ago'
    },
    {
      id: '2',
      title: 'Full Stack Node.js/React Developer',
      type: 'Hourly',
      level: 'Intermediate',
      description: 'Join our startup to build a social networking app for fitness enthusiasts. You will be responsible for both frontend and backend development.',
      techStack: ['React', 'Node.js', 'MongoDB', 'AWS'],
      budget: '$45 - $65',
      budgetLabel: 'Hourly Rate',
      duration: '1-3 Months',
      postedDate: '5 hours ago'
    },
    {
      id: '3',
      title: 'Mobile App Designer (Figma)',
      type: 'Fixed Price',
      level: 'Expert',
      description: 'Need a creative designer to create 20+ high-fidelity screens for a fintech mobile application. Must have a strong portfolio in dark-themed UI.',
      techStack: ['Figma', 'UI Design', 'Mobile UX', 'Prototyping'],
      budget: '$3,500',
      budgetLabel: 'Project Budget',
      duration: '1 Month',
      postedDate: '1 day ago'
    },
    {
      id: '4',
      title: 'Python Scraper for Real Estate Data',
      type: 'Hourly',
      level: 'Entry',
      description: 'Looking for someone to write a Python script to scrape property listings from various websites and store them in a PostgreSQL database.',
      techStack: ['Python', 'BeautifulSoup', 'PostgreSQL', 'Docker'],
      budget: '$25 - $35',
      budgetLabel: 'Hourly Rate',
      duration: '2 Weeks',
      postedDate: '3 days ago'
    },
    {
      id: '5',
      title: 'DevOps Engineer for K8s Migration',
      type: 'Fixed Price',
      level: 'Expert',
      description: 'Help us migrate our monolithic application to a microservices architecture running on Kubernetes (EKS).',
      techStack: ['Kubernetes', 'Terraform', 'AWS', 'Docker'],
      budget: '$10,000+',
      budgetLabel: 'Project Budget',
      duration: '4-6 Months',
      postedDate: '12 hours ago'
    },
    {
      id: '6',
      title: 'React Native Developer for Health App',
      type: 'Hourly',
      level: 'Intermediate',
      description: 'We need a React Native expert to implement Bluetooth heart rate monitor integration for our existing iOS/Android app.',
      techStack: ['React Native', 'BLE', 'Redux', 'Jest'],
      budget: '$50 - $75',
      budgetLabel: 'Hourly Rate',
      duration: '2 Months',
      postedDate: '1 day ago'
    }
  ];

  get filteredContracts() {
    return this.contracts.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesLevel = this.selectedLevel === 'All Levels' || c.level === this.selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }
}
