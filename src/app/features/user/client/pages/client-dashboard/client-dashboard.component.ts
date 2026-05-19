import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css',
})
export class ClientDashboardComponent {
  clientName = 'Acme Corp';

  stats = [
    { label: 'Active Contracts', value: '4', icon: 'bi-briefcase', color: 'primary' },
    { label: 'Total Spent', value: '$12,450', icon: 'bi-currency-dollar', color: 'success' },
    { label: 'Pending Proposals', value: '18', icon: 'bi-file-earmark-text', color: 'warning' }
  ];

  recentActivities = [
    { id: 1, action: 'Submitted a new proposal', user: 'Jane Doe', project: 'Frontend Redesign', time: '2 hours ago', icon: 'bi-file-earmark-text', type: 'proposal' },
    { id: 2, action: 'Logged 5 hours', user: 'Mark Smith', project: 'Backend API Integration', time: '5 hours ago', icon: 'bi-clock-history', type: 'time' },
    { id: 3, action: 'Completed milestone', user: 'Alex Johnson', project: 'Mobile App Wireframes', time: '1 day ago', icon: 'bi-check-circle', type: 'milestone' },
    { id: 4, action: 'Sent a message', user: 'Sarah Lee', project: 'SEO Audit', time: '2 days ago', icon: 'bi-chat-left-text', type: 'message' }
  ];
}
