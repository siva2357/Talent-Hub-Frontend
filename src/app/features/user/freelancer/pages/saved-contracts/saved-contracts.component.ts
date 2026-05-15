import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";


interface SavedContract {
  id: string;
  title: string;
  type: string;
  level: string;
  description: string;
  techStack: string[];
  budget: string;
  budgetLabel: string;
  duration: string;
  savedDate: string;
  client: string;
}

@Component({
  selector: 'app-saved-contracts',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './saved-contracts.component.html',
  styleUrl: './saved-contracts.component.css'
})
export class SavedContractsComponent {
  savedContracts: SavedContract[] = [
    {
      id: '1',
      title: 'Senior Angular Developer for Enterprise SaaS',
      type: 'Fixed Price',
      level: 'Expert',
      description: 'We are looking for a highly skilled Angular developer to help us scale our enterprise SaaS platform. Experience with NgRx and complex data visualizations is a must.',
      techStack: ['Angular', 'NgRx', 'D3.js', 'TypeScript'],
      budget: '$5,000 - $8,000',
      budgetLabel: 'Fixed Price',
      duration: '3-6 Months',
      savedDate: '2 days ago',
      client: 'TechNova Solutions'
    },
    {
      id: '2',
      title: 'Mobile App Designer (Figma)',
      type: 'Fixed Price',
      level: 'Expert',
      description: 'Need a creative designer to create 20+ high-fidelity screens for a fintech mobile application. Must have a strong portfolio in dark-themed UI.',
      techStack: ['Figma', 'UI Design', 'Mobile UX', 'Prototyping'],
      budget: '$3,500',
      budgetLabel: 'Project Budget',
      duration: '1 Month',
      savedDate: 'Yesterday',
      client: 'GrowthLabs'
    }
  ];

  removeContract(id: string) {
    this.savedContracts = this.savedContracts.filter(c => c.id !== id);
  }
}
