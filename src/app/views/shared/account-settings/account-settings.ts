import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css'
})
export class AccountSettings implements OnInit {
  role: string = '';
  activeTab: string = 'profile';

  userData: any = null;
  profileData: any = null;
  isLoading: boolean = true;
  error: string = '';

  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  constructor() { }

  ngOnInit() {
    this.role = this.tokenService.getRole()?.toLowerCase() || '';
    this.loadProfileData();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  loadProfileData() {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.user;
          this.profileData = res.profile;
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

  setTab(tab: string) {
    this.activeTab = tab;
  }

  saveProfileChanges() {
    this.isLoading = true;

    // Create a sanitized payload to prevent backend validation errors (e.g., _id is not allowed)
    const payload = JSON.parse(JSON.stringify(this.profileData));
    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.userId;

    if (payload.socialLinks && Array.isArray(payload.socialLinks)) {
      payload.socialLinks.forEach((link: any) => delete link._id);
    }
    if (payload.languages && Array.isArray(payload.languages)) {
      payload.languages.forEach((lang: any) => delete lang._id);
    }

    this.profileService.updateProfile(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Profile updated successfully!');
          this.loadProfileData();
        } else {
          alert(res.message || 'Error updating profile');
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile.');
        this.isLoading = false;
      }
    });
  }
}
