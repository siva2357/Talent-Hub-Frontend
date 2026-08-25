import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../../../core/services/token.service';
import { ProfileService } from '../../../../core/services/profile.service';


@Component({
  selector: 'app-profile-avatar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile-avatar.html',
  styleUrl: './profile-avatar.css'
})
export class ProfileAvatar implements OnInit {
  role!: string;
  fullName: string = '';
  email: string = '';
  profileImage: string = '';

  constructor(
    private tokenService: TokenService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    const userRole = this.tokenService.getRole();
    if (userRole) {
      // Capitalize first letter
      this.role = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    }

    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res && res.profile) {
          const profile = res.profile;
          if (profile.basicInformation) {
             this.fullName = profile.basicInformation.fullName || '';
          } else if (res.user && res.user.fullName) {
             this.fullName = res.user.fullName;
          }
          
          if (res.user) {
             this.email = res.user.email || '';
          }
          
          // Profile photo logic
          if (profile.basicInformation && profile.basicInformation.profilePhoto) {
             this.profileImage = profile.basicInformation.profilePhoto;
          } else {
             // Fallback to placeholder if no photo
             this.profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullName || 'User')}&background=random`;
          }
        }
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  logout(): void {
    this.tokenService.clearAll();
  }
}
