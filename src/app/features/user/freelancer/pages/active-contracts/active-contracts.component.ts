import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { OfferService } from '../../../../../core/services/offer.service';

import { ActiveContract } from '../../../../../core/model/freelancer.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-active-contracts',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './active-contracts.component.html',
  styleUrl: './active-contracts.component.css'
})
export class ActiveContractsComponent {
  private offerService = inject(OfferService);

  currentTab = signal<'active' | 'completed'>('active');
  isLoading = signal<boolean>(true);
  private refresh$ = new Subject<void>();

  contracts = toSignal(
    this.refresh$.pipe(
      startWith(null),
      tap(() => this.isLoading.set(true)),
      switchMap(() => this.offerService.getFreelancerOffers().pipe(
        map((res: any) => {
          if (res.success && res.offers) {
            // Only show accepted offers as active contracts that are not completed
            return res.offers
              .filter((offer: any) => offer.status === 'Accepted')
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
                  status: (offer.contractStatus && offer.contractStatus.toLowerCase() === 'completed') ? 'completed' : (isStarted ? 'in-progress' : 'upcoming'),
                  description: offer.description || ''
                } as ActiveContract;
              });
          }
          return [];
        }),
        tap(() => this.isLoading.set(false)),
        catchError((err) => {
          console.error('Failed to fetch active contracts:', err);
          this.isLoading.set(false);
          return of([]);
        })
      ))
    ),
    { initialValue: [] }
  );

  filteredContracts = computed(() => {
    return this.contracts().filter((c: ActiveContract) => {
      if (this.currentTab() === 'active') {
        return c.status === 'in-progress' || c.status === 'upcoming';
      } else {
        return c.status === 'completed';
      }
    });
  });

  downloadContract(contractId: string): void {
    window.open(this.offerService.getContractPdfUrl(contractId), '_blank');
  }
}
