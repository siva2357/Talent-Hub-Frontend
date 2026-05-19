import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contract-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-progress.component.html',
  styleUrl: './contract-progress.component.css'
})
export class ContractProgressComponent {
  expandedContractId: number | null = 1;

  contracts = [
    {
      id: 1,
      title: 'Frontend Re-architecture & UI Modernization',
      freelancer: 'Elena Rodriguez',
      budget: 8500,
      spent: 4500,
      remaining: 4000,
      startDate: 'Oct 01, 2023',
      endDate: 'Dec 15, 2023',
      status: 'Active',
      phases: [
        { id: 1, name: 'Project Discovery & Design System', amount: 1500, status: 'Completed', date: 'Oct 10, 2023' },
        { id: 2, name: 'Core Component Migration', amount: 3000, status: 'Completed', date: 'Oct 28, 2023' },
        { id: 3, name: 'State Management Refactor', amount: 2000, status: 'In Progress', date: 'Expected Nov 15, 2023' },
        { id: 4, name: 'Testing & Final Polish', amount: 2000, status: 'Pending', date: 'Expected Dec 10, 2023' }
      ]
    },
    {
      id: 2,
      title: 'Backend API Optimization',
      freelancer: 'James Wilson',
      budget: 5000,
      spent: 1000,
      remaining: 4000,
      startDate: 'Nov 01, 2023',
      endDate: 'Jan 10, 2024',
      status: 'Active',
      phases: [
        { id: 1, name: 'Database Indexing Review', amount: 1000, status: 'Completed', date: 'Nov 05, 2023' },
        { id: 2, name: 'Query Optimization', amount: 2000, status: 'In Progress', date: 'Expected Nov 25, 2023' },
        { id: 3, name: 'Caching Implementation', amount: 2000, status: 'Pending', date: 'Expected Dec 20, 2023' }
      ]
    },
    {
      id: 3,
      title: 'Mobile App Wireframes',
      freelancer: 'Sarah Miller',
      budget: 3000,
      spent: 3000,
      remaining: 0,
      startDate: 'Sep 01, 2023',
      endDate: 'Sep 30, 2023',
      status: 'Completed',
      phases: [
        { id: 1, name: 'User Flow Documentation', amount: 1000, status: 'Completed', date: 'Sep 10, 2023' },
        { id: 2, name: 'Low-Fidelity Mockups', amount: 1000, status: 'Completed', date: 'Sep 20, 2023' },
        { id: 3, name: 'High-Fidelity Interactive Prototype', amount: 1000, status: 'Completed', date: 'Sep 30, 2023' }
      ]
    }
  ];

  toggleContract(id: number) {
    this.expandedContractId = this.expandedContractId === id ? null : id;
  }
}
