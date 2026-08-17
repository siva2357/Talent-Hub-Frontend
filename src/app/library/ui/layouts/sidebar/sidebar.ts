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

  // Tooltip state
  tooltipText = '';
  tooltipTop = 0;

  showTooltip(event: MouseEvent, label: string) {
    if (this.isOpen) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.tooltipTop = rect.top + (rect.height / 2);
    this.tooltipText = label;
  }

  hideTooltip() {
    this.tooltipText = '';
  }

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
        { label: 'UI Components', path: '/ui-components', icon: 'bi bi-palette' },
      ]
    },
    {
      title: 'Admin',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2' },
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
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2' },
        { label: 'Manage Contract', path: '/manage-contract', icon: 'bi bi-file-earmark-medical' },
        { label: 'Contract Progress', path: '/contract-progress', icon: 'bi bi-file-earmark-medical' },
        { label: 'Meet Page', path: '/meet-page', icon: 'bi bi-camera-video' },
        { label: 'Search Talent', path: '/search-talent', icon: 'bi bi-search' },
        { label: 'Financial Summary', path: '/financial-summary', icon: 'bi bi-currency-dollar' },
      ]
    },
    {
      title: 'Freelancer',
      links: [
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2' },
        { label: 'Find Contracts', path: '/find-contracts', icon: 'bi bi-search' },
        { label: 'Proposal Offers', path: '/proposal-offers', icon: 'bi bi-file-earmark-check' },
        { label: 'My Contracts', path: '/my-contracts', icon: 'bi bi-briefcase' },
        { label: 'Meet Page', path: '/meet-page', icon: 'bi bi-camera-video' },
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
