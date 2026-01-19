import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class Admin {

sidebarOpen = false; // start collapsed (icon-only mode)


  menuItems = [
    { label: 'Dashboard', icon: ' bi-grid', link: 'dashboard' },
    { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list' },
    { label: 'Seekers', icon: 'bi-people', link: 'seekers-list' },
    { label: 'Interviews', icon: 'bi bi-laptop', link: 'interviews' },

  ];

toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

closeSidebarOnMobile() {
  if (window.innerWidth <= 992) {
    this.sidebarOpen = false;
  }
}

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


}
