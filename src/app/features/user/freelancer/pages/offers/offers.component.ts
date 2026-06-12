import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ApplicationService } from '../../../../../core/services/application.service';

interface Offer {
  id: string;
  contractTitle: string;
  client: string;
  date: string;
  budget: string;
  contractType: 'Fixed Price' | 'Hourly';
  level: 'Entry' | 'Intermediate' | 'Expert';
  description: string;
  techStack: string[];
  expiresIn: string;
  startDate: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {
  private applicationService = inject(ApplicationService);

  offers: Offer[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchOffers();
  }

  fetchOffers(): void {
    this.isLoading = true;
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        if (res.success && res.offers) {
          this.offers = res.offers;
        } else {
          this.offers = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch dynamic offers:', err);
        this.offers = [];
        this.isLoading = false;
      }
    });
  }

  acceptOffer(id: string) {
    console.log('Offer Accepted:', id);
  }

  declineOffer(id: string) {
    if (confirm('Are you sure you want to decline this contract offer?')) {
      this.applicationService.declineOffer(id).subscribe({
        next: () => {
          alert('Offer declined successfully.');
          this.fetchOffers();
        },
        error: (err) => {
          console.error('Failed to decline offer:', err);
          alert('Failed to decline offer. Please try again.');
        }
      });
    }
  }
}
