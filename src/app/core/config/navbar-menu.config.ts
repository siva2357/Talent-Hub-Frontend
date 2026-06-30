import { UserRole } from '../enums/user-role.enum';
import { NavMenuItem } from '../model/menu-model';

export const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    label: 'Dashboard',
    roles: [UserRole.ADMIN],
    activePaths: ['admin/dashboard'],
    route: '/user/admin/dashboard',
    icon: 'bi bi-grid-1x2'
  },
  {
    label: 'Users',
    roles: [UserRole.ADMIN],
    activePaths: [
      'admin/clients',
      'admin/freelancers'
    ],
    icon: 'bi bi-people-fill',
    subItems: [
      {
        label: 'Client List',
        description: 'Manage client accounts.',
        icon: 'bi bi-people',
        route: '/user/admin/clients'
      },
      {
        label: 'Freelancer List',
        description: 'Manage freelancer accounts.',
        icon: 'bi bi-person-workspace',
        route: '/user/admin/freelancers'
      }
    ]
  },

  {
    label: 'Operations',
    roles: [UserRole.ADMIN],
    activePaths: [
      'admin/finances',
      'admin/reports'
    ],
    icon: 'bi bi-briefcase-fill',
    subItems: [
      {
        label: 'Financial Summary',
        description: 'Platform financial overview.',
        icon: 'bi bi-cash-stack',
        route: '/user/admin/finances'
      },
      {
        label: 'Reports',
        description: 'System reports and exports.',
        icon: 'bi bi-file-earmark-bar-graph',
        route: '/user/admin/reports'
      }
    ]
  },

  {
    label: 'Management',
    roles: [UserRole.ADMIN],
    activePaths: [
      'admin/support',
      'admin/blog'
    ],
    icon: 'bi bi-sliders',
    subItems: [
      {
        label: 'Support Requests',
        description: 'Review support tickets.',
        icon: 'bi bi-headset',
        route: '/user/admin/support'
      },
      {
        label: 'Blog Manager',
        description: 'Manage platform blog content.',
        icon: 'bi bi-pencil-square',
        route: '/user/admin/blog'
      }
    ]
  },

  {
    label: 'Manage Contracts',
    roles: [UserRole.CLIENT],
    activePaths: [
      'your-contracts',
    ],
    route: '/user/your-contracts',
  },

  {
    label: 'Hire Talent',
    roles: [UserRole.CLIENT],
    activePaths: [
      'search-talent',
      'saved-talent',
      'talent-profile',
    ],
    subItems: [
      {
        label: 'Search Talent',
        description: 'Discover top-rated freelancers for your projects.',
        icon: 'bi bi-search',
        route: '/user/search-talent',
      },
      {
        label: 'Saved Talent',
        description: 'Manage your bookmarked freelancer profiles.',
        icon: 'bi bi-bookmark-heart',
        route: '/user/saved-talent',
      }
    ],
  },

  {
    label: 'Financial Management',
    roles: [UserRole.CLIENT],
    activePaths: [
      'financial-summary',
      'transaction-history',
    ],
    subItems: [
      {
        label: 'Financial Summary',
        description: 'Overview of contract budgets, funding and payment status.',
        icon: 'bi bi-pie-chart',
        route: '/user/financial-summary',
      },
      {
        label: 'Transaction History',
        description: 'Review payment activity across contracts and project phases.',
        icon: 'bi bi-receipt',
        route: '/user/transaction-history',
      },
    ],
  },

  {
    label: 'Find Contracts',
    roles: [UserRole.FREELANCER],
    activePaths: ['find-contracts'],
    route: '/user/find-contracts',
  },
  {
    label: 'My Proposals & Offers',
    roles: [UserRole.FREELANCER],
    activePaths: ['proposals'],
    route: '/user/proposals',
  },
  {
    label: 'Contract Management',
    roles: [UserRole.FREELANCER],
    activePaths: ['contracts'],
    route: '/user/contracts',
  },

  {
    label: 'Financial Management',
    roles: [UserRole.FREELANCER],
    activePaths: ['finance-overview',],
    route: '/user/finance-overview',
  },

  {
    label: 'Portfolio',
    roles: [UserRole.FREELANCER],
    activePaths: ['portfolio'],
    route: '/user/portfolio'
  }

];
