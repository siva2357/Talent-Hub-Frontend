import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { RecruiterProfile } from '../../../core/models/recruiter-profile.model';
import { NotificationService } from '../../../core/services/notification-service';
import { RecruiterProfileService } from '../../../core/services/recruiter-profile-service';
import { AppNotification } from '../../../core/models/notification.model';


@Component({
  selector: 'app-recruiter',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './recruiter.html',
  styleUrl: './recruiter.css'
})
export class Recruiter implements OnInit {
  public userProfile!: RecruiterProfile;

  constructor(private authService: AuthService, private router: Router, private profileService:RecruiterProfileService ,private notificationService: NotificationService) {}

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
  this.userRole = role;

  if (this.userId) {
      this.loadNotifications(); // ✅ Add this call
       this.getRecruiterDetails();
  } else {
    this.errorMessage = 'User ID or Role is not available.';
  }

}

loadNotifications(): void {
    if (!this.userId || !this.userRole) return;
  this.notificationService.getUserNotifications().subscribe({
    next: (notifs) => {
      this.notifications = notifs;
    },
    error: (err) => {
      console.error('Error loading notifications:', err);
    }
  });
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

  this.notificationService
    .markAllAsRead()
    .subscribe({
      next: () => {
        // ✅ Update UI after backend success
        this.notifications.forEach(n => (n.read = true));
        this.showCount = false;
      },
      error: (err) => {
        console.error('Failed to mark all as read', err);
      }
    });
}

clearAll() {


  this.notificationService
    .clearUserNotifications()
    .subscribe({
      next: () => {
        this.notifications = [];
        this.showCount = false;
      },
      error: (err) => {
        console.error('Failed to clear notifications', err);
      }
    });
}


getRecruiterDetails(): void {
  this.loading = true;
  this.profileService.getRecruiterProfile().subscribe({
    next: (response) => {
      if (response.success) {
        this.userProfile = response.data.profile;
        this.fullName = `${this.userProfile.firstName} ${this.userProfile.lastName}`;
        this.profileImage = this.userProfile.profilePhoto;
        this.loading = false;
      }
    },
    error: (error) => {
      this.loading = false;
      this.handleError(error);
    }
  });
}

markAsRead(notification: AppNotification, event: Event) {
  event.stopPropagation();

  if (notification.read) return;

  this.notificationService.markAsRead(notification._id).subscribe(() => {
    notification.read = true;
  });
}

deleteNotification(notification: AppNotification, event: Event) {
  event.stopPropagation();

  this.notificationService.deleteNotification(notification._id).subscribe(() => {
    this.notifications = this.notifications.filter(
      n => n._id !== notification._id
    );
  });
}


handleError(error: any) {
    console.error('Error fetching user details:', error);
    if (error.status === 401) {
      this.errorMessage = 'Unauthorized access. Please log in again.';
    } else {
      this.errorMessage = 'An error occurred while fetching user details.';
    }
    this.loading = false;
}


goToProfilePage(): void {
  const userId = this.authService.getUserId() || localStorage.getItem('userId') || '';
  const userRole = this.authService.getRole() || localStorage.getItem('userRole') || '';
  if (!userId || !userRole) {
    console.error('User ID or role is missing');
    return;
  }
  const rolePath = userRole.toLowerCase();  // Ensures route path is consistent
  this.router.navigate([`/${rolePath}/profile`]);
}


  goToAccountSettingsPage(): void {
    const userId = localStorage.getItem('userId') || this.authService.getUserId() || '';
    const userRole = localStorage.getItem('userRole') || this.authService.getRole() || '';
    if (!userId || !userRole) {
      console.error('User ID or role is missing');
      return;
    }
    const rolePath = userRole.toLowerCase(); // Ensure lowercase for consistency
    this.router.navigate([`/${rolePath}/account-settings`]);
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



}
