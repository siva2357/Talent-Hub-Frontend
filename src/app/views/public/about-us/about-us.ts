import { Component } from '@angular/core';

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

interface ValueCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {

  aiIntelligenceFeatures: FeatureCard[] = [
    {
      title: 'AI Talent Discovery',
      description:
        'Advanced AI matches talent based on skill, experience and project requirements.',
      icon: 'bi-search'
    },
    {
      title: 'Smart Screening',
      description:
        'Automated screening of profiles, portfolios, and skills to ensure high reliability.',
      icon: 'bi-funnel'
    },
    {
      title: 'Match & Rank',
      description:
        'Our AI automatically ranks candidates, saving you time in identifying the best fits.',
      icon: 'bi-bar-chart'
    },
    {
      title: 'AI Assistant',
      description:
        'Your AI-powered copilot for writing descriptions, tasks, and smart communication.',
      icon: 'bi-stars'
    },
    {
      title: 'Smart Insights',
      description:
        'Analytics processing to help teams predict performance and mitigate project risks.',
      icon: 'bi-lightbulb'
    },
    {
      title: 'Secure & Safe',
      description:
        'Advanced fraud detection and identity verification ensure a safe working ecosystem.',
      icon: 'bi-shield-check'
    }
  ];

  growthPartnerFeatures: FeatureCard[] = [
    {
      title: 'AI-Powered Matching',
      description:
        'Our proprietary AI finds the right talent for every project or team with high precision.',
      icon: 'bi-person-check'
    },
    {
      title: 'End-to-End Workflow',
      description:
        'Everything from hiring to payments managed seamlessly in a single, powerful platform.',
      icon: 'bi-diagram-3'
    },
    {
      title: 'Verified & Trusted',
      description:
        'Multi-layered verification on skillsets and identity ensures a reliable and trusted ecosystem.',
      icon: 'bi-patch-check'
    },
    {
      title: 'Secure by Design',
      description:
        'Enterprise-grade security keeps all data, contracts, and communication protected at all times.',
      icon: 'bi-lock'
    },
    {
      title: 'Global Talent Network',
      description:
        'Access an exceptional pool of verified talent across different time zones and industries.',
      icon: 'bi-globe2'
    },
    {
      title: 'Built for Scale',
      description:
        'Whether you are a startup or enterprise, Talent Hub scales effortlessly with your needs.',
      icon: 'bi-graph-up-arrow'
    }
  ];

  values: ValueCard[] = [
    {
      title: 'Integrity',
      description:
        'We operate with honesty, transparency and high ethical standards.',
      icon: 'bi-star'
    },
    {
      title: 'Human First',
      description:
        'Our technology empowers humans, not the other way around.',
      icon: 'bi-people'
    },
    {
      title: 'Collaboration',
      description:
        'We believe in working together to achieve greatness.',
      icon: 'bi-people-fill'
    },
    {
      title: 'Innovation',
      description:
        'We continuously innovate to solve real-world problems.',
      icon: 'bi-lightbulb'
    },
    {
      title: 'Impact',
      description:
        'We build solutions that create positive and lasting impact.',
      icon: 'bi-stars'
    }
  ];
}