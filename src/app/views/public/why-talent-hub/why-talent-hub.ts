import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-why-talent-hub',
  standalone: true,
  imports: [],
  templateUrl: './why-talent-hub.html',
  styleUrl: './why-talent-hub.css'
})
export class WhyTalentHub {

  features: Feature[] = [
    {
      title: 'AI-Powered Talent Matching',
      description:
        'Our AI analyzes skills, experience, behavior, and project needs to connect you with the perfect talent—faster and smarter.',
      image: '../../../../assets/why-features/talent-matching.jpg'
    },
    {
      title: 'Smart Project Management',
      description:
        'Plan, assign, track, and deliver projects efficiently with AI insights, risk detection, and deadline predictions.',
      image: '../../../../assets/why-features/project-management.jpg'
    },
    {
      title: 'AI Financial Insights',
      description:
        'Track budgets, revenue, and profitability with AI forecasting and automated financial reports in real time.',
      image: '../../../../assets/why-features/financial-insights.jpg'
    },
    {
      title: 'Growth & Performance Analytics',
      description:
        'AI analyzes performance, engagement, and retention to help you make data-driven decisions and scale faster.',
      image: '../../../../assets/why-features/growth-analytics.jpg'
    },
    {
      title: 'Performance & Reliability Monitoring',
      description:
        'AI continuously monitors system health, team performance, and project risks to ensure reliability.',
      image: '../../../../assets/why-features/system-monitoring.jpg'
    },
    {
      title: 'Smart Communication',
      description:
        'AI-powered assistance, auto-summaries, and smart notifications keep your team aligned and productive.',
      image: '../../../../assets/why-features/smart-communication.jpg'
    }
  ];

  benefits: Benefit[] = [
    {
      title: 'Intelligent Talent Matching',
      description:
        'Find the best-fit talent and projects with AI-powered recommendations.',
      icon: 'bi-magic'
    },
    {
      title: 'Faster Hiring Decisions',
      description:
        'Accelerate hiring with AI-driven screening, insights, and smart recommendations.',
      icon: 'bi-lightning-charge'
    },
    {
      title: 'AI Project Intelligence',
      description:
        'Monitor project progress, analyze contract performance, and predict potential risks.',
      icon: 'bi-bar-chart-steps'
    },
    {
      title: 'Secure & Trusted Platform',
      description:
        'Protect every collaboration with AI-powered identity verification and fraud detection.',
      icon: 'bi-shield-check'
    }
  ];
}