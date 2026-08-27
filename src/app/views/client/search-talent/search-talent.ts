import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TalentCard, TalentCardData } from '../../../library/shared/components/talent-card/talent-card';

@Component({
  selector: 'app-search-talent',
  standalone: true,
  imports: [CommonModule, TalentCard],
  templateUrl: './search-talent.html',
  styleUrl: './search-talent.css'
})
export class SearchTalent implements OnInit {
  freelancers: any[] = [];
  isLoading = false;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFreelancers();
  }

  fetchFreelancers(): void {
    this.isLoading = true;
    this.profileService.getAllFreelancers().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && (res.items || res.data)) {
          this.freelancers = res.items || res.data;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching freelancers', err);
      }
    });
  }

  viewProfile(id: string): void {
    this.router.navigate(['/profile'], { queryParams: { id } });
  }
}
