import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin  {

  sidebarOpen = false;
  menuItems = [
    { label: 'Dashboard', icon: ' bi-grid', link: 'dashboard' },
    { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list' },
    { label: 'Seekers', icon: 'bi-people', link: 'seekers-list' },
    { label: 'Companies', icon: 'bi-briefcase', link: 'company-list' },
    { label: 'Blog posts', icon: 'bi-book', link: 'blog-list' },
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth <= 992) {
      this.sidebarOpen = false;
    }
  }


}
