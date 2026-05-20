import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  private profileService = inject(ProfileService);
    private authService = inject(AuthService);


  currentUser = this.authService.currentUser;

  user: any = null;
  profile: any = null;

  isLoading = true;

  isFreelancer = computed(() =>
    this.currentUser()?.role === 'Freelancer'
  );

  isClient = computed(() =>
    this.currentUser()?.role === 'Client'
  );

  ngOnInit(): void {
    this.getProfile();
  }


  getProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.profile = res.profile;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getStarsArray(rating: number): string[] {
    const stars: string[] = [];
    const rounded = Math.round((rating || 0) * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalf = rounded % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push('bi-star-fill');
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push('bi-star-half');
      } else {
        stars.push('bi-star');
      }
    }

    return stars;
  }
}