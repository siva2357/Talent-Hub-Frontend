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
        { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2' },
        { label: 'Profile', path: '/profile', icon: 'bi bi-person' },
        { label: 'Account Settings', path: '/account-settings', icon: 'bi bi-gear' },
        { label: 'Contact Support', path: '/contact-support', icon: 'bi bi-headset' },
        { label: 'UI Components', path: '/ui-components', icon: 'bi bi-palette' },
        { label: 'Meet Page', path: '/meet-page', icon: 'bi bi-camera-video' },
        { label: 'Chat Page', path: '/chat-page', icon: 'bi bi-chat-dots' },
      ]
    },
    {
      title: 'Auth Pages',
      links: [
        { label: 'Login', path: '/login', icon: 'bi bi-box-arrow-in-right' },
        { label: 'Signup', path: '/signup', icon: 'bi bi-person-plus' },
        { label: 'Register', path: '/register', icon: 'bi bi-card-checklist' },
        { label: 'OTP Verification', path: '/otp-verification', icon: 'bi bi-shield-lock' },
        { label: 'Account Verification', path: '/account-verification', icon: 'bi bi-check-circle' },
        { label: 'Forgot Password', path: '/forgot-password', icon: 'bi bi-key' },
        { label: 'Reset Password', path: '/reset-password', icon: 'bi bi-arrow-clockwise' },
        { label: 'Profile Form', path: '/profile-form', icon: 'bi bi-person-lines-fill' },
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
        { label: 'Create Blog', path: '/create-blog', icon: 'bi bi-pencil-square' },
        { label: 'View Report', path: '/view-report', icon: 'bi bi-graph-up' },
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
        { label: 'Create Contract', path: '/create-contract', icon: 'bi bi-plus-circle' },
        { label: 'Legal Contract Page', path: '/legal-contract-page', icon: 'bi bi-file-earmark-ruled' },
        { label: 'Recruitment Workflow', path: '/recruitment-workflow', icon: 'bi bi-diagram-3' },
        { label: 'Create Phase', path: '/create-phase', icon: 'bi bi-layers' },
        { label: 'Phase Details', path: '/phase-details', icon: 'bi bi-list-columns' },
        { label: 'Transaction History', path: '/transaction-history', icon: 'bi bi-clock-history' },
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
        { label: 'Create Portfolio', path: '/create-portfolio', icon: 'bi bi-brush' },
        { label: 'Feedback Reports', path: '/feedback-reports', icon: 'bi bi-chat-square-text' },
        { label: 'View Contract Offer', path: '/view-contract-offer', icon: 'bi bi-eye' },
        { label: 'Legal Contract Acceptance', path: '/legal-contract-acceptance', icon: 'bi bi-check2-square' },
      ]
    }
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    localStorage.setItem('sidebarOpen', String(this.isOpen));
  }
}
