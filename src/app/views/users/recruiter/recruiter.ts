import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

interface Notification {
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-recruiter',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './recruiter.html',
  styleUrl: './recruiter.css'
})
export class Recruiter {

    constructor(private auth: AuthService, private router: Router) {}



  notifications: Notification[] = [
    { message: "New applicant submitted resume", time: "2m ago", read: false },
    { message: "Job post approved", time: "1h ago", read: false },
    { message: "Candidate accepted offer", time: "3h ago", read: false },
    { message: "New message from John", time: "5h ago", read: true },
    { message: "Job post closed automatically", time: "Yesterday", read: true },
  ];

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

 logout() {
    this.router.navigate(['/login']);  // Redirect to login page
  }

}
