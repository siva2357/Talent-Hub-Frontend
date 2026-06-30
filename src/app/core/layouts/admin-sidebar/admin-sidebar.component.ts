import { Component, OnInit, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UserRole } from '../../enums/user-role.enum';
import { NAV_MENU_ITEMS } from '../../config/navbar-menu.config';
import { NavMenuItem } from '../../model/menu-model';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);

  profilePhotoUrl = signal<string | null>(null);
  readonly menuItems = NAV_MENU_ITEMS;

  get currentUser() {
    return this.authService.currentUser();
  }

  get displayName(): string {
    return this.currentUser?.fullName ?? 'Admin';
  }

  get userInitials(): string {
    const name = this.displayName;
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  get adminMenuItems(): NavMenuItem[] {
    return this.menuItems.filter(menu => menu.roles.includes(UserRole.ADMIN));
  }

  isModuleActive(paths: string[]): boolean {
    return paths.some(path => this.router.url.includes(path));
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    this.profileService.getMyProfile().subscribe({
      next: ({ success, profile }) => {
        if (!success || !profile) return;
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
