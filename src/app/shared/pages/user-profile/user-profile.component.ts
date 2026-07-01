import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { DateTimeHelper } from '../../../core/helpers/date-time.helper';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  DateTimeHelper = DateTimeHelper;

  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  currentUser = this.authService.currentUser;

  user = signal<any>(null);
  profile = signal<any>(null);
  contracts = signal<any[]>([]);
  diaries = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  selectedPortfolioItem = signal<any>(null);

  isFreelancer = computed(() =>
    this.user()?.role === 'Freelancer'
  );

  isClient = computed(() =>
    this.user()?.role === 'Client'
  );

  backRoute = computed(() => {
    const role = this.currentUser()?.role;
    if (role === 'Admin') {
      if (this.user()?.role === 'Client') return '/user/admin/clients';
      return '/user/admin/freelancers';
    }
    if (role === 'Client') return '/user/client-dashboard';
    if (role === 'Freelancer') return '/user/my-dashboard';
    return '/user';
  });

  clientJobsPosted = computed(() => this.contracts().length);

  clientHireRate = computed(() => {
    const total = this.contracts().length;
    if (total === 0) return 0;
    // Assuming any contract not pending means someone was hired (e.g. active, in progress, completed, closed)
    const hired = this.contracts().filter(c => c.status && c.status.toLowerCase() !== 'pending').length;
    return Math.round((hired / total) * 100);
  });

  clientTotalInvestments = computed(() => {
    return this.contracts().reduce((total, c) => total + (c.estimatedBudget || 0), 0);
  });

  ngOnInit(): void {
    this.getProfile();
  }

  openPortfolioDetail(item: any): void {
    this.selectedPortfolioItem.set(item);
  }

  closePortfolioDetail(): void {
    this.selectedPortfolioItem.set(null);
  }


  getProfile(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    const profileObservable = userId 
      ? this.profileService.getProfileById(userId) 
      : this.profileService.getMyProfile();
      
    profileObservable.subscribe({
      next: (res) => {
        this.user.set(res.user);
        this.profile.set(res.profile);
        this.contracts.set(res.contracts || []);
        this.diaries.set(res.diaries || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
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

  getSocialIcon(platform: string): string {
    const p = platform?.toLowerCase() || '';
    if (p.includes('linkedin')) return 'bi-linkedin';
    if (p.includes('twitter') || p.includes('x')) return 'bi-twitter-x';
    if (p.includes('github')) return 'bi-github';
    if (p.includes('dribbble')) return 'bi-dribbble';
    if (p.includes('behance')) return 'bi-behance';
    if (p.includes('portfolio') || p.includes('website') || p.includes('link')) return 'bi-link-45deg';
    return 'bi-globe';
  }

  getSocialColorClass(platform: string): string {
    const p = platform?.toLowerCase() || '';
    if (p.includes('linkedin')) return 'text-info bg-info-glow';
    if (p.includes('twitter') || p.includes('x')) return 'text-white bg-dark-glow';
    if (p.includes('github')) return 'text-white bg-dark-glow';
    if (p.includes('dribbble')) return 'text-danger bg-danger-glow';
    if (p.includes('behance')) return 'text-primary bg-primary-glow';
    return 'text-white bg-dark-glow';
  }
}