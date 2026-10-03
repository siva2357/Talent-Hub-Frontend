import { Component, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProfileAvatar } from '../../../shared/components/profile-avatar/profile-avatar';
import { NotificationDropdown } from '../../../shared/components/notification-dropdown/notification-dropdown';
import { TokenService } from '../../../../core/services/token.service';


@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [
    RouterModule,
    ProfileAvatar,
    NotificationDropdown
  ],
  templateUrl: './user-navbar.html',
  styleUrl: './user-navbar.css'
})
export class UserNavbar {

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  navigateToDashboard(): void {
    if (!this.tokenService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}