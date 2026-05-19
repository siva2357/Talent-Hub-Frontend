import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  viewMode: 'freelancer' | 'client' = 'freelancer';

  user = {
    name: 'Sarah Connor',
    avatar: 'S',
    location: 'San Francisco, CA',
    joinedDate: 'Joined Oct 2025',
    email: 'sarah.connor@cyberdyne.io',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    dribbble: 'https://dribbble.com'
  };

  freelancerProfile = {
    title: 'Lead Full-Stack & UI/UX Engineer',
    hourlyRate: 85,
    rating: 4.9,
    successRate: 98,
    summary: 'Passionate Full-Stack Developer with 7+ years of experience crafting enterprise-grade web applications. Expert in Angular, TypeScript, and responsive CSS architectures. Focused on high-fidelity visual design, performance tuning, and creating premium glassmorphic user experiences that elevate standard interface paradigms.',
    skills: ['Angular', 'TypeScript', 'Node.js', 'UI/UX Design', 'Glassmorphism', 'RxJS', 'Sass/SCSS', 'Bootstrap', 'REST APIs', 'DevOps'],
    portfolio: [
      { title: 'FinTech App Re-architecture', category: 'Web App', image: 'FinTech App', desc: 'Overhauled a legacy banking application into a pixel-perfect, responsive dark dashboard.' },
      { title: 'AI Agent Configuration Portal', category: 'SaaS Platform', image: 'AI Portal', desc: 'Designed custom conversation nodes and drag-and-drop workflow visualizers.' },
      { title: 'E-Commerce Glass UI Suite', category: 'Visual Concept', image: 'Glass UI', desc: 'Crafted a collection of modern glassmorphic web store templates and charts.' }
    ],
    contracts: [
      {
        id: 'CON-802',
        title: 'Enterprise Analytics Dashboard',
        client: 'Cyberdyne Systems',
        avatar: 'C',
        budget: 12500,
        completedDate: 'Dec 2025',
        deliverables: 'Interactive charting libraries, responsive grid systems, RxJS state management layer.',
        rating: 5.0,
        review: 'Sarah delivered an exceptional dashboard ahead of schedule. Her architectural choices in RxJS state management made the system run unbelievably fast!',
        attendance: {
          hoursTracked: 180,
          startDate: 'Oct 01',
          endDate: 'Dec 15',
          weeklyAverage: '40 hrs/wk',
          avgAttendanceRate: 98.8
        }
      },
      {
        id: 'CON-749',
        title: 'SaaS Payment API Gateway Integration',
        client: 'Aether Labs',
        avatar: 'A',
        budget: 8200,
        completedDate: 'Oct 2025',
        deliverables: 'Stripe webhook processor, microservice integrations, Angular form security filters.',
        rating: 4.8,
        review: 'Highly technical and great communicator. Integrated the Stripe billing APIs seamlessly and resolved several edge-case webhook validation issues.',
        attendance: {
          hoursTracked: 96,
          startDate: 'Sep 01',
          endDate: 'Oct 24',
          weeklyAverage: '32 hrs/wk',
          avgAttendanceRate: 100
        }
      },
      {
        id: 'CON-611',
        title: 'Premium Branding & Web Storefront',
        client: 'Wayne Enterprises',
        avatar: 'W',
        budget: 15000,
        completedDate: 'Aug 2025',
        deliverables: 'High-fidelity dark landing screens, three-phase digital asset delivery system.',
        rating: 5.0,
        review: 'Outstanding creative and technical skills. Built a gorgeous premium storefront that completely elevated our brand\'s web presence.',
        attendance: {
          hoursTracked: 240,
          startDate: 'May 01',
          endDate: 'Aug 01',
          weeklyAverage: '40 hrs/wk',
          avgAttendanceRate: 97.5
        }
      }
    ]
  };

  clientProfile = {
    company: 'Aether Tech Labs',
    website: 'https://aetherlabs.io',
    jobsPosted: 14,
    hireRate: 93,
    totalSpent: 18400,
    summary: 'Aether Tech Labs is a fast-growing digital design agency building premium SaaS portals and secure financial systems. We hire top-tier developers and believe in clean collaboration, transparent escrow models, and high-fidelity project execution.',
    completedContracts: [
      {
        id: 'CON-104',
        title: 'Mobile Banking App UI/UX Development',
        freelancer: 'John Connor',
        avatar: 'J',
        budget: 3250,
        date: 'Jun 2026',
        deliverables: 'High-fidelity dynamic prototypes, banking dark layouts, standard form elements and security screens.',
        rating: 5.0,
        review: 'John Connor delivered absolutely stunning work. Pixel-perfect, high-fidelity components that perfectly adhere to the banking guidelines.',
        attendance: {
          hoursTracked: 80,
          startDate: 'May 01',
          endDate: 'Jun 15',
          weeklyAverage: '20 hrs/wk',
          avgAttendanceRate: 100
        }
      },
      {
        id: 'CON-405',
        title: 'AI Chatbot Integration & Agent Workflows',
        freelancer: 'Sarah Connor',
        avatar: 'S',
        budget: 1950,
        date: 'May 2026',
        deliverables: 'Node.js flow logic parser, vector DB integration, chat widget UI controls and responsive layouts.',
        rating: 4.8,
        review: 'Sarah Connor did a stellar job. The flow integrations are incredibly fast and the UX transitions feel extremely smooth and premium.',
        attendance: {
          hoursTracked: 45,
          startDate: 'Apr 10',
          endDate: 'May 05',
          weeklyAverage: '15 hrs/wk',
          avgAttendanceRate: 98.0
        }
      },
      {
        id: 'CON-307',
        title: 'Cloud Infrastructure Migration & DevOps Setup',
        freelancer: 'T-800 Cyberdyne',
        avatar: 'T',
        budget: 5500,
        date: 'Apr 2026',
        deliverables: 'Terraform multi-zone configuration, Dockerized CI/CD pipeline, Kubernetes automated pod auto-scaling.',
        rating: 5.0,
        review: 'Total tactical perfection. Extremely reliable setup. T-800 optimized our resource utilization and completely modernized our build pipelines.',
        attendance: {
          hoursTracked: 110,
          startDate: 'Mar 01',
          endDate: 'Apr 20',
          weeklyAverage: '30 hrs/wk',
          avgAttendanceRate: 100
        }
      }
    ]
  };

  toggleView(mode: 'freelancer' | 'client') {
    this.viewMode = mode;
  }

  getStarsArray(rating: number): string[] {
    const stars: string[] = [];
    const rounded = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalf = rounded % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push('bi-star-fill');
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push('bi-star-half');
      } else {
        stars.push('bi-star');
      }
    }
    return stars;
  }
}
