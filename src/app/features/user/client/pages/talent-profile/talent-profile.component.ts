import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-talent-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './talent-profile.component.html',
  styleUrl: './talent-profile.component.css'
})
export class TalentProfileComponent {
  talent = {
    name: 'Alex Johnson',
    title: 'UI/UX Designer',
    location: 'New York, USA',
    avatar: '/assets/images/profiles/avatar-1.jpg',
    coverImage: '/assets/images/workspace.png',
    performance: 98,
    performanceTier: 'High',
    rating: 4.9,
    projects: 82,
    hourlyRate: 75,
    hoursWorked: '2,450',
    experience: '3+ Years',
    jobSuccess: '100%',
    bio: 'Passionate UI/UX designer with 3+ years of experience creating intuitive and user-centered digital experiences. I specialize in turning complex problems into simple, beautiful and functional designs.',
    skills: ['UI Design', 'Figma', 'Prototyping', 'User Research', 'Wireframing', 'Design Systems'],
    contractHistory: [
      {
        role: 'Enterprise Dashboard Redesign',
        company: 'TechNova Inc.',
        amount: '$12,500',
        duration: 'Jan 2024 - Mar 2024',
        rating: 5.0,
        icon: 'bi-window-stack',
        color: 'bg-primary'
      },
      {
        role: 'Mobile App UX Audit',
        company: 'PixelCraft Studio',
        amount: '$4,200',
        duration: 'Dec 2023 - Jan 2024',
        rating: 4.9,
        icon: 'bi-phone-vibrate',
        color: 'bg-purple'
      },
      {
        role: 'E-commerce Brand Identity',
        company: 'DesignHub',
        amount: '$8,000',
        duration: 'Oct 2023 - Nov 2023',
        rating: 5.0,
        icon: 'bi-bag-check',
        color: 'bg-success'
      }
    ],
    portfolio: [
      { id: 1, title: 'FinTech App Design', category: 'Mobile App', image: '/assets/images/Talent profile.png', performance: '98% Client Satisfaction' },
      { id: 2, title: 'SaaS Analytics Dashboard', category: 'Web App', image: '/assets/images/dashboard.png', performance: 'Reduced churn by 15%' },
      { id: 3, title: 'E-learning Platform', category: 'EdTech', image: '/assets/images/workspace.png', performance: '4.9/5 Average Rating' }
    ],
    socialMedia: [
      { name: 'LinkedIn', icon: 'bi-linkedin', url: '#', handle: '@alexjohnson' },
      { name: 'Behance', icon: 'bi-behance', url: '#', handle: 'alex_ux' },
      { name: 'Dribbble', icon: 'bi-dribbble', url: '#', handle: 'alexj_design' },
      { name: 'Twitter', icon: 'bi-twitter-x', url: '#', handle: '@alex_designs' }
    ],
    availability: 'Available',
    weeklyHours: '40 hrs/week',
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Conversational' }
    ]
  };
}
