import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  isOpen = false;

  navSections = [
    {
      title: 'Admin',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
        { label: 'Client Management', path: '/client-management', icon: 'users-icon' },
        { label: 'Freelancer Management', path: '/freelancer-management', icon: 'users-icon' },
        { label: 'Financial Summary', path: '/financial-summary', icon: 'finance-icon' },
        { label: 'Reports', path: '/reports', icon: 'document-icon' },
        { label: 'Support Request', path: '/support-request', icon: 'support-icon' },
        { label: 'Blog Manager', path: '/blog-manager', icon: 'document-icon' },
      ]
    },
    {
      title: 'Client',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
        { label: 'Manage Contract', path: '/manage-contract', icon: 'document-icon' },
        { label: 'Applicants', path: '/applicants', icon: 'users-icon' },
        { label: 'Contract Progress', path: '/contract-progress', icon: 'chart-icon' },
        { label: 'Search Talent', path: '/search-talent', icon: 'search-icon' },
        { label: 'Financial Summary', path: '/financial-summary', icon: 'finance-icon' },
        { label: 'Profile', path: '/profile', icon: 'user-icon' },
        { label: 'Account Settings', path: '/account-settings', icon: 'settings-icon' },
        { label: 'Contact Support', path: '/contact-support', icon: 'support-icon' },
      ]
    },
    {
      title: 'Freelancer',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
        { label: 'Find Contracts', path: '/find-contracts', icon: 'search-icon' },
        { label: 'Contract Details', path: '/contract-details', icon: 'document-icon' },
        { label: 'Proposal Offers', path: '/proposal-offers', icon: 'document-icon' },
        { label: 'My Contracts', path: '/my-contracts', icon: 'document-icon' },
        { label: 'Contract Diary', path: '/contract-diary', icon: 'document-icon' },
        { label: 'Finance Overview', path: '/finance-overview', icon: 'finance-icon' },
        { label: 'Portfolio', path: '/portfolio', icon: 'document-icon' },
        { label: 'Profile', path: '/profile', icon: 'user-icon' },
        { label: 'Account Settings', path: '/account-settings', icon: 'settings-icon' },
        { label: 'Contact Support', path: '/contact-support', icon: 'support-icon' },
      ]
    }
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
