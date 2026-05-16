import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';


interface DashboardStat {
  label: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'gold';
  statusText?: string;
}

interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  status: 'completed' | 'pending' | 'urgent';
}

@Component({
  selector: 'app-freelancer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './freelancer-dashboard.component.html',
  styleUrl: './freelancer-dashboard.component.css'
})
export class FreelancerDashboardComponent {
  stats: DashboardStat[] = [
    {
      label: 'Total Earnings',
      value: '$12,850.00',
      trend: '+12%',
      trendType: 'up',
      icon: 'bi-currency-dollar',
      color: 'blue'
    },
    {
      label: 'Active Contracts',
      value: '4',
      trend: 'Active',
      trendType: 'neutral',
      icon: 'bi-check2-circle',
      color: 'green',
      statusText: 'Active'
    },
    {
      label: 'Submitted Proposals',
      value: '18',
      trend: 'Pending',
      trendType: 'neutral',
      icon: 'bi-cash-stack',
      color: 'purple',
      statusText: 'Pending'
    },
    {
      label: 'Attendance Hours',
      value: '164.5',
      trend: 'AVAILABLE',
      trendType: 'up',
      icon: 'bi-clock-history',
      color: 'gold'
    }
  ];



  activities: RecentActivity[] = [
    {
      id: 1,
      title: 'Payment Received',
      description: 'E-commerce Platform project milestone #2 completed.',
      time: '2 hours ago',
      icon: 'bi-check-circle-fill',
      status: 'completed'
    },
    {
      id: 2,
      title: 'New Proposal Request',
      description: 'Client RetailGenius Inc. invited you to a contract.',
      time: '5 hours ago',
      icon: 'bi-envelope-fill',
      status: 'urgent'
    },
    {
      id: 3,
      title: 'Contract Updated',
      description: 'Terms for Mobile Banking App UI/UX were revised.',
      time: 'Yesterday',
      icon: 'bi-pencil-square',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Attendance Marked',
      description: 'Daily work session recorded for Cloud Infrastructure.',
      time: '1 day ago',
      icon: 'bi-clock-fill',
      status: 'completed'
    }
  ];

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
