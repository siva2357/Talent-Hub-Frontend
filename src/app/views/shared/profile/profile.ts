import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';
import { StatCard } from '../../../library/shared/components/stat-card/stat-card';
import { StatCardData } from '../../../core/models/ui.model';
import { Badge } from '../../../library/ui/components/badge/badge';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Loader } from '../../../library/ui/components/loader/loader';
import { Alert } from '../../../library/ui/components/alert/alert';
import { Button } from '../../../library/ui/components/button/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCard, Badge, Chip, Loader, Alert, Button],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  viewerRole: string = '';
  role: string = '';
  userData: any = null;
  profileData: any = null;
  contracts: any[] = [];
  diaries: any[] = [];
  portfolio: any[] = [];
  selectedPortfolio: any = null;
  selectedMediaIndex: number = 0;

  metrics: { active: number, completed: number, jobSuccess: number, hiringRisk: string } = {
    active: 0,
    completed: 0,
    jobSuccess: 0,
    hiringRisk: 'Low'
  };

  get clientStats(): StatCardData[] {
    return [
      {
        title: 'Total Contracts',
        value: this.profileData?.metrics?.totalContracts ?? 0,
        icon: 'bi bi-file-earmark-text'
      },
      {
        title: 'Completed Contracts',
        value: this.profileData?.metrics?.completedContracts ?? 0,
        icon: 'bi bi-check-circle'
      },
      {
        title: 'Active Contracts',
        value: this.profileData?.metrics?.activeContracts ?? 0,
        icon: 'bi bi-activity'
      },
      {
        title: 'Total Spent',
        value: '₹' + (this.profileData?.metrics?.totalSpent ?? 0),
        icon: 'bi bi-wallet2'
      }
    ];
  }

  get freelancerStats(): StatCardData[] {
    return [
      {
        title: 'Active Contracts',
        value: this.metrics.active,
        icon: 'bi bi-activity'
      },
      {
        title: 'Completed Contracts',
        value: this.metrics.completed,
        icon: 'bi bi-check2-square'
      },
      {
        title: 'Job Success',
        value: `${this.metrics.jobSuccess}%`,
        icon: 'bi bi-graph-up-arrow'
      },
      {
        title: 'Hiring Risk',
        value: this.metrics.hiringRisk,
        icon: 'bi bi-shield-check'
      }
    ];
  }

  isLoading: boolean = true;
  error: string = '';
  isPublicView: boolean = false;
  fromParam: string = '';
  contractIdParam: string = '';
  backButtonText: string = 'Back';
  backUrl: string = '/dashboard';

  get canViewPortfolioDetails(): boolean {
    return this.viewerRole === 'client' || (this.isPublicView && this.viewerRole !== 'freelancer');
  }

  ngOnInit() {
    this.viewerRole = this.tokenService.getRole()?.toLowerCase() || '';

    combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, queryParams]) => {
      const targetId = params['id'] || queryParams['id'];
      this.fromParam = queryParams['from'] || '';
      this.contractIdParam = queryParams['contractId'] || '';

      if (targetId) {
        this.isPublicView = true;
        this.loadProfileData(targetId);
      } else {
        this.isPublicView = false;
        this.loadProfileData();
      }
    });
  }

  loadProfileData(id?: string) {
    this.isLoading = true;

    const request = id ? this.profileService.getProfileById(id) : this.profileService.getMyProfile();

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.user;
          this.profileData = res.profile;
          this.contracts = res.contracts || [];
          this.diaries = res.diaries || [];
          this.portfolio = res.portfolio || [];

          if (this.userData?.role) {
            this.role = this.userData.role.toLowerCase();
          } else if (!id) {
            this.role = this.viewerRole;
          }

          // Compute freelancer metrics
          const completed = this.diaries.filter((d: any) => d.status === 'completed' || d.status === 'closed').length;
          const active = this.diaries.filter((d: any) => d.status === 'active' || d.status === 'in progress' || d.status === 'open').length;
          const total = completed + active;
          const jobSuccess = total > 0 ? Math.round((completed / total) * 100) : 0;

          let hiringRisk = 'Medium';
          if (total === 0) {
            hiringRisk = 'Medium';
          } else if (jobSuccess >= 85) {
            hiringRisk = 'Low';
          } else if (jobSuccess >= 60) {
            hiringRisk = 'Medium';
          } else {
            hiringRisk = 'High';
          }

          this.metrics = { active, completed, jobSuccess, hiringRisk };

          // Compute client metrics if viewing client and not provided
          if (this.role === 'client') {
            const totalContracts = this.contracts.length;
            const completedContracts = this.contracts.filter(c => c.status === 'completed').length;
            const activeContracts = this.contracts.filter(c => c.status === 'in progress' || c.status === 'active' || c.status === 'open').length;
            const totalSpent = this.contracts.reduce((acc, c) => acc + (c.spent || c.estimatedBudget || 0), 0);

            if (!this.profileData) {
              this.profileData = {};
            }
            if (!this.profileData.metrics) {
              this.profileData.metrics = {
                totalContracts,
                completedContracts,
                activeContracts,
                totalSpent
              };
            }
          }

          this.updateNavigation();
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

  updateNavigation() {
    const viewer = this.viewerRole;
    const profileRole = this.role;
    const from = this.fromParam;

    if (viewer === 'admin') {
      if (profileRole === 'client' || from === 'client-management') {
        this.backButtonText = 'Back to Client Management';
        this.backUrl = '/client-management';
      } else if (profileRole === 'freelancer' || from === 'freelancer-management') {
        this.backButtonText = 'Back to Freelancer Management';
        this.backUrl = '/freelancer-management';
      } else {
        this.backButtonText = 'Back to Dashboard';
        this.backUrl = '/dashboard';
      }
    } else if (viewer === 'client') {
      if (this.isPublicView) {
        if (from === 'search-talent') {
          this.backButtonText = 'Back to Search Talent';
          this.backUrl = '/search-talent';
        } else if (from === 'applicants') {
          this.backButtonText = 'Back to Applicants';
          this.backUrl = this.contractIdParam ? `/applicants/${this.contractIdParam}` : '/manage-contract';
        } else {
          this.backButtonText = 'Back to Search';
          this.backUrl = '/search-talent';
        }
      } else {
        this.backButtonText = 'Back to Dashboard';
        this.backUrl = '/dashboard';
      }
    } else if (viewer === 'freelancer') {
      this.backButtonText = 'Back to Dashboard';
      this.backUrl = '/dashboard';
    } else {
      this.backButtonText = 'Back';
      this.backUrl = '/dashboard';
    }
  }

  goBack() {
    if (this.fromParam === 'applicants' && this.contractIdParam) {
      this.router.navigate(['/applicants', this.contractIdParam]);
    } else if (this.fromParam && this.backUrl) {
      this.router.navigateByUrl(this.backUrl);
    } else if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.backUrl);
    }
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getAvatarInitial(): string {
    const name = this.profileData?.basicInformation?.fullName || this.userData?.fullName || 'User';
    return name.trim().charAt(0).toUpperCase();
  }

  getStatusBadgeVariant(status?: string): 'success' | 'warning' | 'danger' | 'secondary' {
    if (!status) return 'secondary';
    const s = status.toLowerCase();
    if (s === 'active') return 'success';
    if (s.includes('pending')) return 'warning';
    if (s === 'suspended' || s === 'blocked' || s === 'deactivated') return 'danger';
    return 'secondary';
  }

  getContractBadgeVariant(status?: string): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' {
    if (!status) return 'primary';
    const s = status.toLowerCase();
    if (s === 'active' || s === 'open' || s === 'in progress') return 'primary';
    if (s === 'completed' || s === 'closed') return 'success';
    if (s === 'pending') return 'warning';
    if (s === 'cancelled' || s === 'rejected') return 'danger';
    return 'secondary';
  }

  formatContractType(type?: string): string {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getSocialIcon(platform?: string): string {
    if (!platform) return 'bi bi-link-45deg';
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'bi bi-linkedin';
    if (p.includes('github')) return 'bi bi-github';
    if (p.includes('twitter') || p.includes('x')) return 'bi bi-twitter-x';
    if (p.includes('facebook')) return 'bi bi-facebook';
    if (p.includes('instagram')) return 'bi bi-instagram';
    if (p.includes('youtube')) return 'bi bi-youtube';
    if (p.includes('dribbble')) return 'bi bi-dribbble';
    if (p.includes('behance')) return 'bi bi-behance';
    return 'bi bi-globe';
  }

  getSocialColorClass(platform?: string): string {
    if (!platform) return 'bg-primary bg-opacity-10 text-primary';
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return 'bg-primary bg-opacity-10 text-primary';
    if (p.includes('github')) return 'bg-dark bg-opacity-10 text-dark';
    if (p.includes('twitter') || p.includes('x')) return 'bg-dark bg-opacity-10 text-dark';
    if (p.includes('instagram')) return 'bg-danger bg-opacity-10 text-danger';
    if (p.includes('youtube')) return 'bg-danger bg-opacity-10 text-danger';
    return 'bg-primary bg-opacity-10 text-primary';
  }

  getSocialPlatformName(platform?: string): string {
    if (!platform) return 'Social Profile';
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  }

  viewAllContracts(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (this.role === 'client' || this.viewerRole === 'client') {
      this.router.navigate(['/manage-contract']);
    } else {
      this.router.navigate(['/my-contracts']);
    }
  }

  getPortfolioImageUrl(item: any): string {
    if (!item || !item.media || !item.media.length) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=350';
    }
    const first = item.media[0];
    if (typeof first === 'string') {
      return first;
    }
    if (first && typeof first === 'object' && first.url) {
      return first.url;
    }
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=350';
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=350';
    }
  }

  formatUrl(url?: string): string {
    if (!url || url.trim() === '' || url === '#') return '#';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  openExternalUrl(url?: string): void {
    if (!url) return;
    const formatted = this.formatUrl(url);
    if (formatted !== '#') {
      window.open(formatted, '_blank', 'noopener,noreferrer');
    }
  }

  openPortfolioModal(item: any): void {
    this.selectedPortfolio = item;
    this.selectedMediaIndex = 0;
  }

  closePortfolioModal(): void {
    this.selectedPortfolio = null;
    this.selectedMediaIndex = 0;
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.selectedPortfolio) {
      this.closePortfolioModal();
    }
  }

  getActivePortfolioMediaUrl(): string {
    if (!this.selectedPortfolio) return '';
    if (this.selectedPortfolio.media && this.selectedPortfolio.media.length > this.selectedMediaIndex) {
      const m = this.selectedPortfolio.media[this.selectedMediaIndex];
      if (typeof m === 'string') return m;
      if (m && typeof m === 'object' && m.url) return m.url;
    }
    return this.getPortfolioImageUrl(this.selectedPortfolio);
  }
}
