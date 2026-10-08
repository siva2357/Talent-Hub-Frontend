import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { Button } from '../../components/button/button';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [Button,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.css'
})
export class PublicNavbar {

  mobileMenuOpen = false;

  /**
   * Toggle mobile navigation
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Close mobile navigation
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

}