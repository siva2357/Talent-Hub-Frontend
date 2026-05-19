import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hired-talent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hired-talent.component.html',
  styleUrl: './hired-talent.component.css'
})
export class HiredTalentComponent {
  hiredTalent = [
    {
      id: 1,
      name: 'Aryan Sharma',
      role: 'UI/UX Designer',
      location: 'Mumbai, India',
      avatar: '/assets/images/profiles/avatar-1.jpg',
      performance: 98,
      performanceTier: 'High',
      skills: ['UI Design', 'Figma', 'Prototyping', 'User Research'],
      hourlyRate: 75,
      projectsCount: 82,
      rating: 4.9,
      totalHours: 2450,
      isAvailable: true,
      contractStatus: 'Active',
      hoursLogged: '120 hrs'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Frontend Developer',
      location: 'Delhi, India',
      avatar: '/assets/images/profiles/avatar-5.jpg',
      performance: 63,
      performanceTier: 'Medium',
      skills: ['React', 'Next.js', 'Tailwind', 'JavaScript'],
      hourlyRate: 70,
      projectsCount: 96,
      rating: 4.8,
      totalHours: 2780,
      isAvailable: true,
      contractStatus: 'Active',
      hoursLogged: '45 hrs'
    }
  ];
}
