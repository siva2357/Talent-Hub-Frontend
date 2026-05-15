import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent {
  private router = inject(Router);

  get userRole(): 'admin' | 'client' | 'freelancer' | '' {
    const url = this.router.url;
    if (url.includes('/user/admin')) return 'admin';
    if (url.includes('/user/client')) return 'client';
    
    // Check for freelancer specific paths
    const freelancerPaths = [
      'my-dashboard', 'find-contracts', 'saved-contracts', 'proposals',
      'offers', 'active-contracts', 'contract-diary', 'hourly-work-diary',
      'attendance-overview', 'mark-attendance', 'finance-overview',
      'finance-report', 'finance-management'
    ];
    
    if (freelancerPaths.some(path => url.includes('/user/' + path))) {
      return 'freelancer';
    }
    
    return '';
  }

  isModuleActive(paths: string[]): boolean {
    const url = this.router.url;
    return paths.some(path => url.includes('/user/' + path));
  }

  get dashboardLink(): string {
    switch (this.userRole) {
      case 'admin': return '/user/admin';
      case 'client': return '/user/client';
      case 'freelancer': return '/user/my-dashboard';
      default: return '/';
    }
  }

  // Notifications logic
  notifications: any[] = []; // Default empty
  showAllNotifications = false;

  get visibleNotifications() {
    return this.showAllNotifications ? this.notifications : this.notifications.slice(0, 4);
  }

  toggleShowAll(event: Event) {
    event.stopPropagation();
    this.showAllNotifications = !this.showAllNotifications;
  }

  markAllAsRead(event: Event) {
    event.stopPropagation();
    this.notifications = [];
  }
}
