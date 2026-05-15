import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

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
export class OffersComponent {
  offers: Offer[] = [
    {
      id: '1',
      contractTitle: 'Senior Angular Developer',
      client: 'TechNova',
      date: 'Oct 18, 2023',
      budget: '$5,000',
      contractType: 'Fixed Price',
      level: 'Expert',
      description: 'Lead the frontend development of an enterprise SaaS analytics platform. This role involves managing a team of 4 developers.',
      techStack: ['Angular', 'NgRx', 'RxJS'],
      expiresIn: '2 Days',
      startDate: 'Nov 01, 2023',
      status: 'Pending'
    },
    {
      id: '2',
      contractTitle: 'UI Designer for Mobile App',
      client: 'GrowthLabs',
      date: 'Oct 20, 2023',
      budget: '$3,200',
      contractType: 'Fixed Price',
      level: 'Intermediate',
      description: 'Design a clean and modern user interface for a fitness tracking application with focus on accessibility.',
      techStack: ['Figma', 'UI/UX', 'Mobile Design'],
      expiresIn: '5 Days',
      startDate: 'Oct 25, 2023',
      status: 'Pending'
    }
  ];

  acceptOffer(id: string) {
    console.log('Offer Accepted:', id);
  }

  declineOffer(id: string) {
    console.log('Offer Declined:', id);
  }
}
