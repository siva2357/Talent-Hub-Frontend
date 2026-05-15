import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css',
})
export class UserNavbarComponent {
  private router = inject(Router);

  get userRole(): 'admin' | 'client' | 'freelancer' | '' {
    const url = this.router.url;
    if (url.includes('/user/admin')) return 'admin';
    if (url.includes('/user/client')) return 'client';
    if (url.includes('/user/freelancer')) return 'freelancer';
    return '';
  }
}
