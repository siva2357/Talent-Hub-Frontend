import { Component } from '@angular/core';

interface Feature {
  title: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
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
        'Our AI analyzes skills, experience, behavior, and project needs to connect you with the perfect talent—faster and smarter.'
    },
    {
      title: 'Smart Project Management',
      description:
        'Plan, assign, track, and deliver projects efficiently with AI insights, risk detection, and deadline predictions.'
    },
    {
      title: 'AI Financial Insights',
      description:
        'Track budgets, revenue, and profitability with AI forecasting and automated financial reports in real time.'
    },
    {
      title: 'Growth & Performance Analytics',
      description:
        'AI analyzes performance, engagement, and retention to help you make data-driven decisions and scale faster.'
    },
    {
      title: 'Performance & Reliability Monitoring',
      description:
        'AI continuously monitors system health, team performance, and project risks to ensure reliability.'
    },
    {
      title: 'Smart Communication',
      description:
        'AI-powered assistance, auto-summaries, and smart notifications keep your team aligned and productive.'
    }
  ];

  benefits: Benefit[] = [
    {
      title: 'Intelligent Talent Matching',
      description:
        'Find the best-fit talent and projects with AI-powered recommendations.'
    },
    {
      title: 'Faster Hiring Decisions',
      description:
        'Accelerate hiring with AI-driven screening, insights, and smart recommendations.'
    },
    {
      title: 'AI Project Intelligence',
      description:
        'Monitor project progress, analyze contract performance, and predict potential risks.'
    },
    {
      title: 'Secure & Trusted Platform',
      description:
        'Protect every collaboration with AI-powered identity verification and fraud detection.'
    }
  ];
}