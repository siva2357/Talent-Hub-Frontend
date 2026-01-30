import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification-service';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
interface Notification {
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit{

    constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {}


  public userName!:string;
  public fullName! :string;
  public profileImage! :string;
  public userId!: string;
  public errorMessage: string | null = null;
  public loading: boolean = true;
  public userRole!: string;
  public showAll = false;
  public notifications: AppNotification[] = [];

  ngOnInit(): void {
  this.userId = localStorage.getItem('userId') || this.authService.getUserId() || '';
  const role = localStorage.getItem('userRole') || this.authService.getRole() || '';
  this.fullName = this.authService.getFullName() ||"";
  this.profileImage = this.authService.getUserData()?.profileImage || '';
  this.userRole = role;

}





sidebarOpen = false; // start collapsed (icon-only mode)


  menuItems = [
    { label: 'Dashboard', icon: ' bi-grid', link: 'dashboard' },
    { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list' },
    { label: 'Seekers', icon: 'bi-people', link: 'seekers-list' },
    { label: 'Blog', icon: 'bi bi-journal-text', link: 'blog' },
  ];

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

closeSidebarOnMobile() {
  if (window.innerWidth <= 992) {
    this.sidebarOpen = false;
  }
}


  showCount = true;
  viewMore = false;



  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  get visibleNotifications() {
    return this.viewMore ? this.notifications : this.notifications.slice(0, 3);
  }

  toggleView() {
    this.viewMore = !this.viewMore;
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.showCount = false;
  }

  clearAll() {
    this.notifications = [];
    this.showCount = false;
  }





logout(): void {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/login']);
    },
    error: () => {
      this.authService.clearAuthData();
      this.router.navigate(['/login']);
    }
  });
}

goToProfilePage(): void {
  const userId = this.authService.getUserId() || localStorage.getItem('userId') || '';
  const userRole = this.authService.getRole() || localStorage.getItem('userRole') || '';
  if (!userId || !userRole) {
    console.error('User ID or role is missing');
    return;
  }
  const rolePath = userRole;  // Ensures route path is consistent
  this.router.navigate([`/${rolePath}/profile`]);
}



}
