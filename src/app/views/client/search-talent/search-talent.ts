import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-search-talent',
  standalone: true,
  imports: [CommonModule],
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
        if (res.success && res.data) {
          this.freelancers = res.data;
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
