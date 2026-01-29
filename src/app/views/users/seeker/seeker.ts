import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { AppNotification } from '../../../core/models/notification.model';
import { JobSeekerProfile } from '../../../core/models/jobseeker-profile.model';
import { SeekerProfileService } from '../../../core/services/seeker-profile-service';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-seeker',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './seeker.html',
  styleUrl: './seeker.css',
    standalone: true,
})
export class Seeker {

  public userProfile!: JobSeekerProfile;

  constructor(private authService: AuthService, private router: Router, private profileService:SeekerProfileService ,private notificationService: NotificationService) {}

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
       this.getJobSeekerDetails();
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



getJobSeekerDetails() {
  this.profileService.getJobSeekerProfile().subscribe(
    (res: any) => {
      this.userProfile = res.data.profile; // ✅ FIX
      this.fullName = `${this.userProfile.firstName} ${this.userProfile.lastName}`;
      this.profileImage = this.userProfile.profilePhoto; // ✅ now works
      this.loading = false;
    },
    (error) => {
      this.handleError(error);
    }
  );
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
  const rolePath = userRole;  // Ensures route path is consistent
  this.router.navigate([`/${rolePath}/profile`]);
}





  goToAccountSettingsPage(): void {
    const userId = localStorage.getItem('userId') || this.authService.getUserId() || '';
    const userRole = localStorage.getItem('userRole') || this.authService.getRole() || '';
    if (!userId || !userRole) {
      console.error('User ID or role is missing');
      return;
    }
    const rolePath = userRole; // Ensure lowercase for consistency
    this.router.navigate([`/${rolePath}/account-settings`]);
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
