import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification-service';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
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
  this.profileImage = this.authService.getUserData()?.profilePicture || '';

  this.userRole = role;

  if (this.userId) {
      this.loadNotifications(); // ✅ Add this call
  } else {
    this.errorMessage = 'User ID or Role is not available.';
  }

}





sidebarOpen = false; // start collapsed (icon-only mode)


  menuItems = [
    { label: 'Dashboard', icon: ' bi-grid', link: 'dashboard' },
    { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list' },
    { label: 'Seekers', icon: 'bi-people', link: 'seekers-list' },
    { label: 'Interviews', icon: 'bi bi-laptop', link: 'interviews' },
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

  loadNotifications(): void {
  if (!this.userId || !this.userRole) return;
  const apiRole = this.userRole.charAt(0).toUpperCase() + this.userRole.slice(1); // 'client' → 'Client'
  this.notificationService.getUserNotifications(apiRole, this.userId).subscribe({
    next: (notifs) => {
      this.notifications = notifs;
    },
    error: (err) => {
      console.error('Error loading notifications:', err);
    }
  });
}


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
      // ✅ Clear frontend state
      localStorage.clear();
      sessionStorage.clear();

      // ✅ Redirect
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Logout failed', err);

      // 🔐 Fail-safe logout
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  });
}

}
