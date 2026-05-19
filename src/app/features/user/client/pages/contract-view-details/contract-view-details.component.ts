import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contract-view-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-view-details.component.html',
  styleUrl: './contract-view-details.component.css'
})
export class ContractViewDetailsComponent {
  contract = {
    id: 'CON-10024',
    title: 'Enterprise CRM Redesign',
    freelancer: 'Alex Johnson',
    status: 'In Progress',
    startDate: 'Oct 01, 2023',
    totalBudget: '$12,500',
    spent: '$4,200',
    description: 'Complete overhaul of the existing CRM interface to improve user engagement and data visualization accuracy.',
    updates: [
      { id: 1, date: 'Oct 15', text: 'Completed the initial wireframes for the dashboard.' },
      { id: 2, date: 'Oct 10', text: 'Requirement gathering phase completed.' }
    ]
  };
}
