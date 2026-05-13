import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-find-work',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './find-work.component.html',
  styleUrl: './find-work.component.css'
})
export class FindWorkComponent {
  features = [
    {
      id: 1,
      icon: 'bi-cpu',
      subtitle: '01',
      title: 'AI Matches You with Relevant Work',
      description: 'Our AI analyzes your skills, experience, and preferences to recommend the best projects that match you.'
    },
    {
      id: 2,
      icon: 'bi-file-earmark-text',
      subtitle: '02',
      title: 'Choose & Review Contract Details',
      description: 'Browse projects, review requirements, budgets, timelines, and contract terms with full transparency.'
    },
    {
      id: 3,
      icon: 'bi-send',
      subtitle: '03',
      title: 'Apply to Contract & Wait for Selection',
      description: 'Send your proposal or apply directly to the contract. Clients will review and shortlist the best fit.'
    },
    {
      id: 4,
      icon: 'bi-calendar-event',
      subtitle: '04',
      title: 'Schedule Interview with Client',
      description: 'Discuss project goals, expectations, and delivery approach in a meeting scheduled at your convenience.'
    },
    {
      id: 5,
      icon: 'bi-people',
      subtitle: '05',
      title: 'Meet & Start Working with Confidence',
      description: 'Once selected, start collaborating seamlessly with your client and bring the project to life.'
    },
    {
      id: 6,
      icon: 'bi-shield-check',
      subtitle: '06',
      title: 'Get Assured & Legal Contract Issued',
      description: 'We generate a legal contract to protect both you and your client. Work with trust and peace of mind.'
    },
    {
      id: 7,
      icon: 'bi-clock-history',
      subtitle: '07',
      title: 'Track Progress & Daily Attendance',
      description: 'Update tasks, track milestones, and maintain daily attendance to keep everything on track.'
    },
    {
      id: 8,
      icon: 'bi-wallet2',
      subtitle: '08',
      title: 'Receive Payments on Time',
      description: 'Get paid securely as you complete milestones. Timely payments for your hard work.'
    }
  ];

  contracts = [
    {
      id: 1,
      title: 'Senior Angular Developer',
      logo: 'assets/logo/angular.png',
      type: 'Fixed Price',
      level: 'Intermediate',
      description: 'Build and optimize a scalable Angular application with responsive UI, API integrations, authentication, and dashboard management features.',
      techStack: ['Angular', 'TypeScript', 'RxJS', 'REST API', 'SCSS'],
      budget: '$4,500',
      budgetLabel: 'Total Budget',
      duration: '2 Months'
    },
    {
      id: 2,
      title: 'Full Stack MERN Engineer',
      logo: 'assets/logo/mongodb.png',
      type: 'Hourly',
      level: 'Mid to Senior',
      description: 'Develop and maintain a full-stack web platform with secure APIs, real-time chat, authentication, and admin dashboard modules.',
      techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'Socket.IO'],
      budget: '$35/hr',
      budgetLabel: 'Est. Hours: 120 Hours',
      duration: '3 Months'
    },
    {
      id: 3,
      title: 'UI/UX Product Designer',
      logo: 'assets/logo/figma.png',
      type: 'Fixed Price',
      level: 'Senior',
      description: 'Design modern user experiences, wireframes, design systems, and interactive prototypes for a SaaS-based hiring platform.',
      techStack: ['Figma', 'Wireframing', 'UX Research', 'Prototyping'],
      budget: '$2,200',
      budgetLabel: 'Total Budget',
      duration: '5 Weeks'
    },
    {
      id: 4,
      title: 'DevOps & Cloud Engineer',
      logo: 'assets/logo/aws.png',
      type: 'Hourly',
      level: 'Mid to Senior',
      description: 'Configure CI/CD pipelines, containerized deployments, Kubernetes orchestration, and cloud infrastructure monitoring.',
      techStack: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
      budget: '$50/hr',
      budgetLabel: 'Est. Hours: 80 Hours',
      duration: '1 Month'
    },
    {
      id: 5,
      title: 'AI Integration Specialist',
      logo: 'assets/logo/ai-brain.png',
      type: 'Fixed Price',
      level: 'Expert',
      description: 'Integrate AI-powered recommendation systems, intelligent talent matching, and automated workflow analysis features.',
      techStack: ['Python', 'AI APIs', 'TensorFlow', 'NLP', 'Data Analysis'],
      budget: '$6,800',
      budgetLabel: 'Total Budget',
      duration: '4 Months'
    },
    {
      id: 6,
      title: 'Mobile Application Developer',
      logo: 'assets/logo/flutter.png',
      type: 'Hourly',
      level: 'Intermediate',
      description: 'Develop cross-platform mobile applications with real-time notifications, secure login, and responsive user interfaces.',
      techStack: ['Flutter', 'Firebase', 'API Integration', 'Dart'],
      budget: '$28/hr',
      budgetLabel: 'Est. Hours: 140 Hours',
      duration: '2 Months'
    }
  ];
}
