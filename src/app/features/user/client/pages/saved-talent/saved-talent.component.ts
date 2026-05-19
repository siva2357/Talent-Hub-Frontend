import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saved-talent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-talent.component.html',
  styleUrl: './saved-talent.component.css'
})
export class SavedTalentComponent {
  savedTalents = [
    {
      id: 2,
      name: 'Priyanka Nair',
      role: 'Full Stack Developer',
      location: 'Bangalore, India',
      avatar: '/assets/images/profiles/avatar-2.jpg',
      performance: 96,
      performanceTier: 'High',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      hourlyRate: 65,
      projectsCount: 64,
      rating: 4.8,
      totalHours: 1980,
      isAvailable: true,
      dateSaved: 'Oct 12, 2023'
    },
    {
      id: 3,
      name: 'Rahul Varma',
      role: 'Product Manager',
      location: 'Hyderabad, India',
      avatar: '/assets/images/profiles/avatar-3.jpg',
      performance: 94,
      performanceTier: 'High',
      skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Analytics'],
      hourlyRate: 85,
      projectsCount: 51,
      rating: 4.7,
      totalHours: 1650,
      isAvailable: true,
      dateSaved: 'Oct 14, 2023'
    }
  ];
}
