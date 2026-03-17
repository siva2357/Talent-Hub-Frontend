import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';


@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.html',
  styleUrl: './profile-layout.css',
  imports:[RouterModule],
  standalone:true
})
export class ProfileLayout implements OnInit {

  fullName: string | null = '';
  role: string | null = '';
  profileImage: string = 'assets/images/Avatar.jpg'; // default

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fullName = this.authService.getFullName();
    this.role = this.authService.getRole();

      const img = this.authService.getProfileImage();
  if (img) {
    this.profileImage = img;
  }

  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearAuthData();
        this.router.navigate(['/login']);
      },
      error: () => {
        // even if API fails, clear locally
        this.authService.clearAuthData();
        this.router.navigate(['/login']);
      }
    });
  }
}
