import { UserRole } from '../enums/user-role.enum';
import { NavMenuItem } from '../model/menu-model';

export const NAV_MENU_ITEMS: NavMenuItem[] = [
{
  label: 'Dashboard',
  roles: [UserRole.ADMIN],
  activePaths: ['admin/dashboard'],
  route: '/user/admin/dashboard'
},
{
  label: 'Users',
  roles: [UserRole.ADMIN],
  activePaths: [
    'admin/clients',
    'admin/freelancers'
  ],
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
      'contract-proposals',
      'contract-progress',
    ],
    subItems: [
      {
        label: 'Your Contracts',
        description: 'View and manage all your active client contracts.',
        icon: 'bi bi-briefcase',
        route: '/user/your-contracts',
      },
      {
        label: 'Proposals',
        description: 'Review proposals submitted by freelancers.',
        icon: 'bi bi-file-earmark-text',
        route: '/user/contract-proposals',
      },
      {
        label: 'Contract Progress',
        description: 'Track milestones and deliverables for your projects.',
        icon: 'bi bi-graph-up',
        route: '/user/contract-progress',
      },
    ],
  },

  {
    label: 'Hire Talent',
    roles: [UserRole.CLIENT],
    activePaths: [
      'search-talent',
      'saved-talent',
      'pending-offers',
      'hired-talent',
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
      },
      {
        label: 'Hired & Offers',
        description: 'Manage active hires and track sent contract offers.',
        icon: 'bi bi-people',
        route: '/user/hired-talent',
      },
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
        description: 'Overview of spending, invoices and billing.',
        icon: 'bi bi-pie-chart',
        route: '/user/financial-summary',
      },
      {
        label: 'Transaction History',
        description: 'Detailed logs of all payments and transfers.',
        icon: 'bi bi-receipt',
        route: '/user/transaction-history',
      },
    ],
  },

  {
    label: 'Find Contracts',
    roles: [UserRole.FREELANCER],
    activePaths: [
      'find-contracts',
      'saved-contracts',
      'proposals',
    ],
    subItems: [
      {
        label: 'Find Contracts',
        description: 'Browse available jobs and opportunities.',
        icon: 'bi bi-search',
        route: '/user/find-contracts',
      },
      {
        label: 'Saved Contracts',
        description: 'Manage bookmarked opportunities.',
        icon: 'bi bi-bookmark-heart',
        route: '/user/saved-contracts',
      },
      {
        label: 'Proposals & Offers',
        description: 'Track submitted proposals and offers.',
        icon: 'bi bi-file-earmark-text',
        route: '/user/proposals',
      },
    ],
  },

  {
    label: 'Contract Management',
    roles: [UserRole.FREELANCER],
    activePaths: [
      'active-contracts',
      'contract-diary',
    ],
    subItems: [
      {
        label: 'Active Contracts',
        description: 'View and manage ongoing contracts.',
        icon: 'bi bi-briefcase',
        route: '/user/active-contracts',
      },
      {
        label: 'Contract Diary',
        description: 'Maintain daily work records and logs.',
        icon: 'bi bi-journal-text',
        route: '/user/contract-diary',
      },
    ],
  },

  {
    label: 'Financial Management',
    roles: [UserRole.FREELANCER],
    activePaths: [
      'finance-overview',
      'finance-report',
    ],
    subItems: [
      {
        label: 'Finance Overview',
        description: 'Display financial summaries and account information.',
        icon: 'bi bi-wallet2',
        route: '/user/finance-overview',
      },
      {
        label: 'Your Report',
        description: 'Generate and view financial reports.',
        icon: 'bi bi-file-earmark-bar-graph',
        route: '/user/finance-report',
      },
    ],
  },

{
  label: 'Portfolio',
  roles: [UserRole.FREELANCER],
  activePaths: ['portfolio'],
  route: '/user/portfolio'
}

];
