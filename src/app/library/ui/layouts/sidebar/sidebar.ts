import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { NavLink } from '../../../../core/models/sidebar.interface';
import { NAV_LINKS } from '../../../../core/constants/navlinks';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  constructor(private tokenService: TokenService) { }
  isOpen = false;

  // Tooltip state
  tooltipText = '';
  tooltipTop = 0;

  showTooltip(event: MouseEvent, label: string) {
    if (this.isOpen) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.tooltipTop = rect.top + (rect.height / 2);
    this.tooltipText = label;
  }

  hideTooltip() {
    this.tooltipText = '';
  }

  navLinks: NavLink[] = [];

  ngOnInit() {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState) {
      this.isOpen = savedState === 'true';
    }
    const role = this.tokenService.getRole()?.toLowerCase();
    if (role) {
      this.navLinks = NAV_LINKS.filter(link => link.roles.includes(role));
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    localStorage.setItem('sidebarOpen', String(this.isOpen));
  }
}
