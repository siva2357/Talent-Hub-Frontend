import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileAvatar } from '../../../shared/components/profile-avatar/profile-avatar';
import { NotificationDropdown } from '../../../shared/components/notification-dropdown/notification-dropdown';


@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterModule, ProfileAvatar, NotificationDropdown],
  templateUrl: './user-navbar.html',
  styleUrl: './user-navbar.css'
})
export class UserNavbar {
  @Output() toggleSidebar = new EventEmitter<void>();
}
