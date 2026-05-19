import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { ChipComponent } from '../../../../../shared/components/chip/chip.component';

@Component({
  selector: 'app-your-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink, InputComponent, ButtonComponent, FormsModule, ChipComponent],
  templateUrl: './your-contracts.component.html',
  styleUrl: './your-contracts.component.css'
})
export class YourContractsComponent {
  // Filter States
  searchQuery: string = '';
  statusFilter: string = '';

  appliedSearch: string = '';
  appliedStatus: string = '';

  statusOptions = [
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Draft', value: 'Draft' }
  ];

  contracts = [
    { 
      id: 1, 
      title: 'Frontend Redesign', 
      freelancer: 'Elena Rodriguez', 
      role: 'Lead Developer',
      type: 'Hourly',
      budget: '$5,000', 
      progress: 75, 
      status: 'In Progress', 
      avatar: '/assets/images/profiles/avatar-3.jpg',
      startDate: 'Oct 1, 2023',
      endDate: 'Dec 31, 2023'
    },
    { 
      id: 2, 
      title: 'UI/UX Design for Mobile App', 
      freelancer: 'James Wilson', 
      role: 'UI Designer',
      type: 'Fixed Price',
      budget: '$2,500', 
      progress: 40, 
      status: 'In Progress', 
      avatar: '/assets/images/profiles/avatar-2.jpg',
      startDate: 'Oct 10, 2023',
      endDate: 'Nov 30, 2023'
    },
    { 
      id: 3, 
      title: 'Python Scraper', 
      freelancer: 'David Smith', 
      role: 'Backend Dev',
      type: 'Fixed Price',
      budget: '$1,200', 
      progress: 100, 
      status: 'Completed', 
      avatar: '/assets/images/profiles/avatar-1.jpg',
      startDate: 'Sep 15, 2023',
      endDate: 'Oct 15, 2023'
    },
    { 
      id: 4, 
      title: 'Cloud Migration Strategy', 
      freelancer: 'TBD', 
      role: 'DevOps Engineer',
      type: 'Hourly',
      budget: '$8,000', 
      progress: 0, 
      status: 'Draft', 
      avatar: '/assets/images/profiles/avatar-placeholder.jpg',
      startDate: 'Not Started',
      endDate: 'TBD'
    }
  ];

  constructor(private router: Router) { }

  get filteredContracts() {
    return this.contracts.filter(c => {
      const matchesStatus = !this.appliedStatus || c.status === this.appliedStatus;
      const matchesSearch = c.title.toLowerCase().includes(this.appliedSearch.toLowerCase()) ||
        c.freelancer.toLowerCase().includes(this.appliedSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  applyFilters() {
    this.appliedSearch = this.searchQuery;
    this.appliedStatus = this.statusFilter;
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = 'In Progress';
    this.applyFilters();
  }

  removeSearchFilter() {
    this.searchQuery = '';
    this.appliedSearch = '';
  }

  removeStatusFilter() {
    this.statusFilter = 'In Progress';
    this.appliedStatus = 'In Progress';
  }

  deleteContract(id: number) {
    if (confirm('Are you sure you want to delete this contract?')) {
      this.contracts = this.contracts.filter(c => c.id !== id);
    }
  }

  editContract() {
    this.router.navigate(['/user/contract-form']);
  }
}
