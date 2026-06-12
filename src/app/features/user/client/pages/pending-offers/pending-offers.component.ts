import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pending-offers',
  imports: [CommonModule, ButtonComponent, FormsModule],
  templateUrl: './pending-offers.component.html',
  styleUrl: './pending-offers.component.css'
})
export class PendingOffersComponent {
  searchQuery: string = '';
  statusFilter: string = 'All Status';
  typeFilter: string = 'All Types';

  offers = [
    {
      id: 1,
      name: 'Sarah Miller',
      role: 'Lead UI/UX Designer',
      type: 'Hourly',
      rate: '$65/hr',
      date: 'Oct 20, 2023',
      status: 'Accepted',
      avatar: '/assets/images/profiles/avatar-1.jpg',
      initials: 'SM',
      performance: 98,
      offerSentDate: 'Oct 18, 2023',
      expiryDate: 'Oct 25, 2023'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Full Stack Engineer',
      type: 'Fixed Price',
      rate: '$4,500',
      date: 'Oct 21, 2023',
      status: 'Pending',
      avatar: '/assets/images/profiles/avatar-2.jpg',
      initials: 'DC',
      performance: 94,
      offerSentDate: 'Oct 19, 2023',
      expiryDate: 'Oct 26, 2023'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Backend Architect',
      type: 'Hourly',
      rate: '$55/hr',
      date: 'Oct 22, 2023',
      status: 'Rejected',
      avatar: '/assets/images/profiles/avatar-3.jpg',
      initials: 'ER',
      performance: 96,
      offerSentDate: 'Oct 20, 2023',
      expiryDate: 'Oct 27, 2023'
    }
  ];

  get filteredOffers() {
    return this.offers.filter(offer => {
      const matchesSearch = offer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        offer.role.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'All Status' || offer.status === this.statusFilter;
      const matchesType = this.typeFilter === 'All Types' || offer.type === this.typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }
}
