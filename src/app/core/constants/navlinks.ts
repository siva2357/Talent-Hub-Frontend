import { NavLink } from '../models/sidebar.interface';

export const NAV_LINKS: NavLink[] = [
  // Shared
  { label: 'Dashboard', path: '/dashboard', icon: 'bi bi-grid-1x2', roles: ['admin', 'client', 'freelancer'] },
  { label: 'UI Components', path: '/ui-components', icon: 'bi bi-palette', roles: ['admin', 'client', 'freelancer'] },
  
  // Admin only
  { label: 'Client Management', path: '/client-management', icon: 'bi bi-people', roles: ['admin'] },
  { label: 'Freelancer Management', path: '/freelancer-management', icon: 'bi bi-person-lines-fill', roles: ['admin'] },
  { label: 'Financial Management', path: '/financial-management', icon: 'bi bi-currency-dollar', roles: ['admin'] },
  { label: 'Reports', path: '/reports', icon: 'bi bi-file-earmark-text', roles: ['admin'] },
  { label: 'Support Request', path: '/support-request', icon: 'bi bi-question-circle', roles: ['admin'] },
  { label: 'Blog Manager', path: '/blog-manager', icon: 'bi bi-layout-text-sidebar-reverse', roles: ['admin'] },

  // Client only
  { label: 'Manage Contract', path: '/manage-contract', icon: 'bi bi-file-earmark-medical', roles: ['client'] },
  { label: 'Contract Progress', path: '/contract-progress', icon: 'bi bi-file-earmark-medical', roles: ['client'] },
  { label: 'Search Talent', path: '/search-talent', icon: 'bi bi-search', roles: ['client'] },
  { label: 'Financial Summary', path: '/financial-summary', icon: 'bi bi-currency-dollar', roles: ['client'] },

  // Freelancer only
  { label: 'Find Contracts', path: '/find-contracts', icon: 'bi bi-search', roles: ['freelancer'] },
  { label: 'Proposal Offers', path: '/proposal-offers', icon: 'bi bi-file-earmark-check', roles: ['freelancer'] },
  { label: 'My Contracts', path: '/my-contracts', icon: 'bi bi-briefcase', roles: ['freelancer'] },
  { label: 'Finance Overview', path: '/finance-overview', icon: 'bi bi-currency-dollar', roles: ['freelancer'] },
  { label: 'Portfolio', path: '/portfolio', icon: 'bi bi-person-workspace', roles: ['freelancer'] },

  // Client & Freelancer Shared
  { label: 'Meet Page', path: '/meet-page', icon: 'bi bi-camera-video', roles: ['client', 'freelancer'] },
];
