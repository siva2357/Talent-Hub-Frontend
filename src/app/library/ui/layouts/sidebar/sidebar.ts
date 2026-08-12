import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  isOpen = false;
  
  ngOnInit() {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState) {
      this.isOpen = savedState === 'true';
    }
  }

  navSections: NavSection[] = [
    {
      title: 'Shared',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2' },
        { label: 'Profile', path: '/profile', icon: 'bi bi-person' },
        { label: 'Account Settings', path: '/account-settings', icon: 'bi bi-gear' },
        { label: 'Contact Support', path: '/contact-support', icon: 'bi bi-headset' },
        { label: 'UI Components', path: '/ui-components', icon: 'bi bi-palette' },
      ]
    },
    {
      title: 'Admin',
      links: [
        { label: 'Client Management', path: '/client-management', icon: 'bi bi-people' },
        { label: 'Freelancer Management', path: '/freelancer-management', icon: 'bi bi-person-lines-fill' },
        { label: 'Financial Management', path: '/financial-management', icon: 'bi bi-currency-dollar' },
        { label: 'Reports', path: '/reports', icon: 'bi bi-file-earmark-text' },
        { label: 'Support Request', path: '/support-request', icon: 'bi bi-question-circle' },
        { label: 'Blog Manager', path: '/blog-manager', icon: 'bi bi-layout-text-sidebar-reverse' },
      ]
    },
    {
      title: 'Client',
      links: [
        { label: 'Manage Contract', path: '/manage-contract', icon: 'bi bi-file-earmark-medical' },
        { label: 'Applicants', path: '/applicants', icon: 'bi bi-person-check' },
        { label: 'Contract Progress', path: '/contract-progress', icon: 'bi bi-bar-chart' },
        { label: 'Search Talent', path: '/search-talent', icon: 'bi bi-search' },
        { label: 'Financial Summary', path: '/financial-summary', icon: 'bi bi-currency-dollar' },
      ]
    },
    {
      title: 'Freelancer',
      links: [
        { label: 'Find Contracts', path: '/find-contracts', icon: 'bi bi-search' },
        { label: 'Contract Details', path: '/contract-details', icon: 'bi bi-file-earmark-medical' },
        { label: 'Proposal Offers', path: '/proposal-offers', icon: 'bi bi-file-earmark-check' },
        { label: 'My Contracts', path: '/my-contracts', icon: 'bi bi-briefcase' },
        { label: 'Contract Diary', path: '/contract-diary', icon: 'bi bi-journal-bookmark' },
        { label: 'Finance Overview', path: '/finance-overview', icon: 'bi bi-currency-dollar' },
        { label: 'Portfolio', path: '/portfolio', icon: 'bi bi-person-workspace' },
      ]
    }
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    localStorage.setItem('sidebarOpen', String(this.isOpen));
  }
}
