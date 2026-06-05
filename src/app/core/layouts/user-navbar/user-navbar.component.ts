import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { NavMenuItem } from '../../model/nav-menu.model';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationsComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);

  profilePhotoUrl = signal<string | null>(null);

  // ─── All nav menu items ────────────────────────────────────────────────────
  readonly navMenuItems: NavMenuItem[] = [

    // ── ADMIN MENUS ───────────────────────────────────────────────────────────
    {
      label: 'Overview',
      roles: 'admin',
      activePaths: ['admin/overview'],
      subItems: [
        { label: 'Dashboard', description: 'Admin overview of platform activity.', icon: 'bi-speedometer2', route: '/user/admin/overview' },
        { label: 'Analytics', description: 'Platform-wide analytics and metrics.', icon: 'bi-bar-chart-line', route: '/user/admin/analytics' },
      ]
    },
    {
      label: 'Users',
      roles: 'admin',
      activePaths: ['admin/client-management', 'admin/freelancer-management'],
      subItems: [
        { label: 'Client Management', description: 'Manage and review client accounts.', icon: 'bi-person-badge', route: '/user/admin/client-management' },
        { label: 'Freelancer Management', description: 'Manage and review freelancer accounts.', icon: 'bi-people', route: '/user/admin/freelancer-management' },
      ]
    },
    {
      label: 'Settings',
      roles: 'admin',
      activePaths: ['admin/settings'],
      subItems: [
        { label: 'Platform Settings', description: 'Configure global platform settings.', icon: 'bi-gear', route: '/user/admin/settings' },
        { label: 'Contact Support', description: 'View support tickets and requests.', icon: 'bi-headset', route: '/user/admin/support' },
      ]
    },

    // ── CLIENT MENUS ──────────────────────────────────────────────────────────
    {
      label: 'Manage Contracts',
      roles: 'client',
      activePaths: ['your-contracts', 'contract-proposals', 'contract-progress'],
      subItems: [
        { label: 'Your Contracts', description: 'View and manage all your active client contracts.', icon: 'bi-briefcase', route: '/user/your-contracts' },
        { label: 'Proposals', description: 'Review proposals submitted by freelancers.', icon: 'bi-file-earmark-text', route: '/user/contract-proposals' },
        { label: 'Contract Progress', description: 'Track milestones and deliverables for your projects.', icon: 'bi-graph-up', route: '/user/contract-progress' },
      ]
    },
    {
      label: 'Hire Talent',
      roles: 'client',
      activePaths: ['search-talent', 'saved-talent', 'pending-offers', 'hired-talent', 'talent-profile'],
      subItems: [
        { label: 'Search Talent', description: 'Discover top-rated freelancers for your projects.', icon: 'bi-search', route: '/user/search-talent' },
        { label: 'Saved Talent', description: 'Manage your bookmarked freelancer profiles.', icon: 'bi-bookmark-heart', route: '/user/saved-talent' },
        { label: 'Hired & Offers', description: 'Manage active hires and track sent contract offers.', icon: 'bi-people', route: '/user/hired-talent' },
      ]
    },
    {
      label: 'Financial Management',
      roles: 'client',
      activePaths: ['financial-summary', 'transaction-history'],
      subItems: [
        { label: 'Financial Summary', description: 'Overview of your spending, invoices, and billing.', icon: 'bi-pie-chart', route: '/user/financial-summary' },
        { label: 'Transaction History', description: 'Detailed logs of all payments and transfers.', icon: 'bi-receipt', route: '/user/transaction-history' },
      ]
    },

    // ── FREELANCER MENUS ──────────────────────────────────────────────────────
    {
      label: 'Find Contracts',
      roles: 'freelancer',
      activePaths: ['find-contracts', 'saved-contracts', 'proposals'],
      subItems: [
        { label: 'Find Contracts', description: 'Browse available jobs and opportunities posted by clients.', icon: 'bi-search', route: '/user/find-contracts' },
        { label: 'Saved Contracts', description: 'Manage bookmarked or saved job opportunities.', icon: 'bi-bookmark-heart', route: '/user/saved-contracts' },
        { label: 'Proposals & Offers', description: 'Track submitted proposals and received contract offers.', icon: 'bi-file-earmark-text', route: '/user/proposals' },
      ]
    },
    {
      label: 'Contract Management',
      roles: 'freelancer',
      activePaths: ['active-contracts', 'contract-diary'],
      subItems: [
        { label: 'Active Contracts', description: 'View and manage ongoing contracts.', icon: 'bi-briefcase', route: '/user/active-contracts' },
        { label: 'Contract Diary', description: 'Maintain daily work records and activity logs.', icon: 'bi-journal-text', route: '/user/contract-diary' },
      ]
    },

    {
      label: 'Financial Management',
      roles: 'freelancer',
      activePaths: ['finance-overview', 'finance-report'],
      subItems: [
        { label: 'Finance Overview', description: 'Display financial summaries and account info.', icon: 'bi-wallet2', route: '/user/finance-overview' },
        { label: 'Your Report', description: 'Generate and view financial reports.', icon: 'bi-file-earmark-bar-graph', route: '/user/finance-report' },
      ]
    },
    {
      label: 'Portfolio',
      roles: 'freelancer',
      activePaths: ['portfolio'],
      subItems: [
        { label: 'My Portfolio', description: 'Showcase and manage your projects.', icon: 'bi-briefcase', route: '/user/portfolio' }
      ]
    },
  ];

  // ─── Computed helpers ──────────────────────────────────────────────────────

  get currentUser() {
    return this.authService.currentUser();
  }

  get displayName(): string {
    return this.currentUser?.fullName || 'User';
  }

  get displayEmail(): string {
    return this.currentUser?.email || '';
  }

  get userRole(): 'admin' | 'client' | 'freelancer' | '' {
    const role = this.currentUser?.role?.toLowerCase();
    if (role === 'admin') return 'admin';
    if (role === 'client') return 'client';
    if (role === 'freelancer') return 'freelancer';
    if (this.router.url.includes('/user/admin')) return 'admin';
    return '';
  }

  get roleLabel(): string {
    switch (this.userRole) {
      case 'admin': return 'Administrator';
      case 'client': return 'Client';
      case 'freelancer': return 'Freelancer';
      default: return '';
    }
  }

  get dashboardLink(): string {
    switch (this.userRole) {
      case 'admin': return '/user/admin/dashboard';
      case 'client': return '/user/client-dashboard';
      case 'freelancer': return '/user/my-dashboard';
      default: return '/';
    }
  }

  /** Filter nav items down to only those relevant for the current user's role. */
  get visibleMenuItems(): NavMenuItem[] {
    if (!this.userRole || this.userRole === 'admin') return [];
    return this.navMenuItems.filter(item => item.roles.includes(this.userRole as any));
  }

  isModuleActive(paths: string[]): boolean {
    const url = this.router.url;
    return paths.some(path => url.includes('/user/' + path));
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.profileService.getMyProfile().subscribe({
        next: (res) => {
          if (res.success && res.profile) {
            const photo = (res.profile as any).basicInformation?.profilePhoto;
            if (photo) this.profilePhotoUrl.set(photo);
          }
        },
        error: () => { }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/account/signin']);
  }
}
