import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);

  role: string = '';
  userData: any = null;
  profileData: any = null;
  contracts: any[] = [];
  isLoading: boolean = true;
  error: string = '';

  ngOnInit() {
    this.role = this.tokenService.getRole()?.toLowerCase() || '';
    this.loadProfileData();
  }

  loadProfileData() {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.user;
          this.profileData = res.profile;
          this.contracts = res.contracts || [];
          this.role = this.userData.role.toLowerCase();
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching profile:', err);
        this.error = 'Failed to load profile data.';
        this.isLoading = false;
      }
    });
  }
}
