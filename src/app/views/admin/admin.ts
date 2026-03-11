import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarItem, SidebarLayout } from "../layouts/sidebar-layout/sidebar-layout";
import { NavbarLayout } from "../layouts/navbar-layout/navbar-layout";
import { MobileLayout } from "../layouts/mobile-layout/mobile-layout";



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarLayout, NavbarLayout, MobileLayout],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin  {

  adminMenu: SidebarItem[] = [
    { label: 'Dashboard', icon: ' bi-grid', link: 'dashboard' },
    { label: 'Recruiters', icon: 'bi-person-badge', link: 'recruiters-list' },
    { label: 'Seekers', icon: 'bi-people', link: 'seekers-list' },
    { label: 'Companies', icon: 'bi-briefcase', link: 'company-list' },
    { label: 'Blog', icon: 'bi-book', link: 'blog-list' },
  ];


}
