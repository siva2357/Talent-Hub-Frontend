import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  projectUrl?: string;
  imageUrl?: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private initialItems: PortfolioItem[] = [
    {
      id: 'p1',
      title: 'E-Commerce Mobile Application',
      description: 'Developed a premium e-commerce application for iOS and Android with secure Stripe checkout integration, real-time push notifications, and personalized product recommendations powered by an on-device recommendation model.',
      role: 'Lead Mobile Developer',
      technologies: ['React Native', 'Redux Toolkit', 'Stripe API', 'Firebase'],
      projectUrl: 'https://github.com/example/ecommerce-app',
      imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
      createdDate: 'May 10, 2026'
    },
    {
      id: 'p2',
      title: 'Real-time Chat & Video Workspace',
      description: 'Built a real-time collaborative workspace featuring custom chat rooms, secure file sharing, markdown editing, and WebRTC-based multi-user audio/video call streams.',
      role: 'Fullstack Architect',
      technologies: ['Angular', 'Socket.io', 'Node.js', 'WebRTC', 'MongoDB'],
      projectUrl: 'https://github.com/example/chat-workspace',
      imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80',
      createdDate: 'April 15, 2026'
    },
    {
      id: 'p3',
      title: 'Fintech Dashboard & Analytics Portal',
      description: 'Created a high-fidelity dashboard for a financial services platform, providing real-time SVG charting, transaction search filters, PDF invoice downloads, and automated accounting logs.',
      role: 'Frontend Engineer',
      technologies: ['Angular', 'TypeScript', 'Chart.js', 'Bootstrap 5'],
      projectUrl: 'https://github.com/example/fintech-dashboard',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
      createdDate: 'March 01, 2026'
    }
  ];

  private portfolioSubject = new BehaviorSubject<PortfolioItem[]>(this.initialItems);

  getPortfolioItems(): Observable<PortfolioItem[]> {
    return this.portfolioSubject.asObservable();
  }

  addPortfolioItem(title: string, description: string, role: string, technologies: string[], projectUrl?: string, imageUrl?: string): void {
    const newItem: PortfolioItem = {
      id: `p${this.portfolioSubject.value.length + 1}`,
      title,
      description,
      role,
      technologies,
      projectUrl: projectUrl || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', // Default fallback
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    this.portfolioSubject.next([newItem, ...this.portfolioSubject.value]);
  }

  deletePortfolioItem(id: string): void {
    const updated = this.portfolioSubject.value.filter(item => item.id !== id);
    this.portfolioSubject.next(updated);
  }

  updatePortfolioItem(id: string, updatedFields: Partial<PortfolioItem>): void {
    const updated = this.portfolioSubject.value.map((item): PortfolioItem => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });
    this.portfolioSubject.next(updated);
  }
}
