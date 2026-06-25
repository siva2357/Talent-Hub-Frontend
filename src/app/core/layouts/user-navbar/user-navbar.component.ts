import { Component, OnInit, inject,signal,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UserRole } from '../../enums/user-role.enum';
import { NAV_MENU_ITEMS } from '../../config/navbar-menu.config';
import { DASHBOARD_ROUTES, ROLE_LABELS } from '../../constants/navbar.constants';
import { NavMenuItem } from '../../model/menu-model';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationsComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent implements OnInit {
  
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);

  profilePhotoUrl = signal<string | null>(null);
  readonly menuItems = NAV_MENU_ITEMS;
  readonly UserRole = UserRole;

  get currentUser() {
    return this.authService.currentUser();
  }

  get displayName(): string {
    return this.currentUser?.fullName ?? 'User';
  }

  get displayEmail(): string {
    return this.currentUser?.email ?? '';
  }

  get userRole(): UserRole | null {
    const role = this.currentUser?.role?.toLowerCase();

    switch (role) {
      case UserRole.ADMIN:
        return UserRole.ADMIN;

      case UserRole.CLIENT:
        return UserRole.CLIENT;

      case UserRole.FREELANCER:
        return UserRole.FREELANCER;

      default:
        return null;
    }
  }

  get roleLabel(): string {
    return this.userRole ? ROLE_LABELS[this.userRole] : '';
  }

  get dashboardLink(): string {
    return this.userRole ? DASHBOARD_ROUTES[this.userRole] : '/';
  }

  get visibleMenuItems(): NavMenuItem[] {
    const role = this.userRole;

    if (!role) {
      return [];
    }

    return this.menuItems.filter(menu =>
      menu.roles.includes(role)
    );
  }

  isModuleActive(paths: string[]): boolean {
    return paths.some(path =>
      this.router.url.includes(path)
    );
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    this.profileService.getMyProfile().subscribe({
      next: ({ success, profile }) => {

        if (!success || !profile) {
          return;
        }

        const photo = profile.basicInformation?.profilePhoto;

        if (photo) {
          this.profilePhotoUrl.set(photo);
        }

      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/account/signin']);
  }
}