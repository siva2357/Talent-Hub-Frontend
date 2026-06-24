import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ApplicationService } from '../../../../../core/services/application.service';

interface ActiveContract {
  id: string; // applicationId
  contractId: string; // actual contractId

  contractTitle: string;
  client: string;
  clientInitials: string;

  budget: string;
  contractType: 'Fixed Price' | 'Hourly';

  techStack: string[];

  startDate: string;

  status: 'in-progress' | 'upcoming';

  description: string;
}

@Component({
  selector: 'app-active-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './active-contracts.component.html',
  styleUrl: './active-contracts.component.css'
})
export class ActiveContractsComponent implements OnInit {
  private applicationService = inject(ApplicationService);

  contracts: ActiveContract[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchActiveContracts();
  }

  fetchActiveContracts(): void {
    this.isLoading = true;
    this.applicationService.getFreelancerOffers().subscribe({
      next: (res: any) => {
        if (res.success && res.offers) {
          // Only show accepted offers as active contracts that are not completed
          this.contracts = res.offers
            .filter((offer: any) => offer.status === 'Accepted' && offer.contractStatus !== 'completed')
            .map((offer: any) => {
              const name = offer.client || 'Client';
              const initials = name
                .split(' ')
                .map((w: string) => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              const startDate = offer.startDate || 'TBD';
              const now = new Date();
              const start = new Date(offer.startDate);
              const isStarted = !isNaN(start.getTime()) && start <= now;

              return {
  id: offer.id,
  contractId: offer.contractId,

  contractTitle: offer.contractTitle,
  client: name,
  clientInitials: initials,

  budget: offer.budget,
  contractType: offer.contractType,

  techStack: offer.techStack || [],

  startDate,
  status: isStarted ? 'in-progress' : 'upcoming',

  description: offer.description || ''
} as ActiveContract;
            });
        } else {
          this.contracts = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch active contracts:', err);
        this.contracts = [];
        this.isLoading = false;
      }
    });
  }

  downloadContract(contractId: string): void {
    window.open(this.applicationService.getContractPdfUrl(contractId), '_blank');
  }
}
