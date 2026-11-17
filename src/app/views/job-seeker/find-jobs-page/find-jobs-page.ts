import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Loader } from '../../../library/ui/components/loader/loader';
import { JobCard } from '../../../library/shared/components/job-card/job-card';
import { JobCardData } from '../../../core/models/job.model';

export const STATIC_WORKSPHERE_JOBS: JobCardData[] = [
  {
    _id: 'ws-job-101',
    jobCode: 'WS-TN-1042',
    jobTitle: 'Principal Frontend Engineer (Angular)',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=4a3aff&color=fff&bold=true&size=128',
    department: 'Product Engineering',
    industry: 'Enterprise SaaS',
    location: 'Bengaluru, India',
    workMode: 'Hybrid',
    employmentType: 'Full-Time',
    experienceRange: '5 - 8 Years',
    salaryRange: '₹28 LPA - ₹36 LPA',
    jobDescription:
      'Lead the frontend architecture of TechNova’s flagship cloud analytics suite. You will build modular Angular micro-frontends, high-performance data visualizations, and mentor a team of 6 frontend developers.',
    skills: ['Angular 18+', 'TypeScript', 'RxJS', 'Micro-Frontends', 'Tailwind / Bootstrap', 'System Design'],
    postedDate: '2026-11-12',
    applicationDeadline: '2026-12-15',
    openings: 2,
    portalSource: 'Worksphere Enterprise',
    hasApplied: true,
    hasSaved: true,
    matchPercentage: 95,
    matchCategory: 'High'
  },
  {
    _id: 'ws-job-102',
    jobCode: 'WS-CS-1088',
    jobTitle: 'Senior Cloud & Backend Architect',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://ui-avatars.com/api/?name=Cloud+Scale&background=0284c7&color=fff&bold=true&size=128',
    department: 'Cloud Infrastructure',
    industry: 'Cloud Computing & DevOps',
    location: 'Hyderabad, India',
    workMode: 'Remote',
    employmentType: 'Full-Time',
    experienceRange: '4 - 7 Years',
    salaryRange: '₹24 LPA - ₹32 LPA',
    jobDescription:
      'Design and scale distributed backend microservices handling 50,000+ requests per second. Collaborate directly with SRE and platform teams on Kubernetes orchestration and multi-region AWS deployments.',
    skills: ['Node.js', 'NestJS', 'AWS', 'Kubernetes', 'PostgreSQL', 'Redis', 'Docker'],
    postedDate: '2026-11-14',
    applicationDeadline: '2026-12-20',
    openings: 3,
    portalSource: 'Worksphere Enterprise',
    hasApplied: false,
    hasSaved: false,
    matchPercentage: 89,
    matchCategory: 'High'
  },
  {
    _id: 'ws-job-103',
    jobCode: 'WS-FE-1104',
    jobTitle: 'Full Stack Lead Engineer',
    companyName: 'FinEdge Corp',
    companyLogo: 'https://ui-avatars.com/api/?name=Fin+Edge&background=059669&color=fff&bold=true&size=128',
    department: 'Digital Banking',
    industry: 'FinTech & Banking',
    location: 'Mumbai, India',
    workMode: 'Hybrid',
    employmentType: 'Full-Time',
    experienceRange: '6 - 9 Years',
    salaryRange: '₹30 LPA - ₹40 LPA',
    jobDescription:
      'Build secure, real-time wealth management and payment settlement portals. Responsible for end-to-end delivery from Angular UI workflows to high-throughput Node.js & Kafka event pipelines.',
    skills: ['Angular', 'Node.js', 'Kafka', 'MongoDB', 'TypeScript', 'OAuth2 / JWT'],
    postedDate: '2026-11-05',
    applicationDeadline: '2026-12-05',
    openings: 1,
    portalSource: 'Worksphere FinTech Hub',
    hasApplied: true,
    hasSaved: true,
    matchPercentage: 92,
    matchCategory: 'High'
  },
  {
    _id: 'ws-job-104',
    jobCode: 'WS-AA-1129',
    jobTitle: 'AI Product Engineer (LLM & Web)',
    companyName: 'Aether AI Labs',
    companyLogo: 'https://ui-avatars.com/api/?name=Aether+AI&background=7c3aed&color=fff&bold=true&size=128',
    department: 'Applied AI',
    industry: 'Artificial Intelligence',
    location: 'Bengaluru, India',
    workMode: 'Remote',
    employmentType: 'Full-Time',
    experienceRange: '3 - 6 Years',
    salaryRange: '₹22 LPA - ₹30 LPA',
    jobDescription:
      'Integrate generative AI workflows, RAG pipelines, and interactive copilot experiences into enterprise workforce products. Work closely with ML researchers and product designers.',
    skills: ['TypeScript', 'Python', 'FastAPI', 'Angular', 'LangChain', 'Vector DBs'],
    postedDate: '2026-11-15',
    applicationDeadline: '2026-12-25',
    openings: 4,
    portalSource: 'Worksphere AI Partner',
    hasApplied: false,
    hasSaved: true,
    matchPercentage: 78,
    matchCategory: 'Average'
  },
  {
    _id: 'ws-job-105',
    jobCode: 'WS-NX-1150',
    jobTitle: 'Staff UI/UX & Design Systems Engineer',
    companyName: 'NexaVerse Commerce',
    companyLogo: 'https://ui-avatars.com/api/?name=Nexa+Verse&background=ea580c&color=fff&bold=true&size=128',
    department: 'Design Engineering',
    industry: 'E-Commerce',
    location: 'Pune, India',
    workMode: 'On-site',
    employmentType: 'Full-Time',
    experienceRange: '4 - 7 Years',
    salaryRange: '₹20 LPA - ₹27 LPA',
    jobDescription:
      'Own the enterprise component library used across 12 storefront applications. Translate Figma tokens into accessible, reusable Angular components with strict performance budgets.',
    skills: ['Angular', 'Design Systems', 'Figma', 'CSS Architecture', 'Accessibility (WCAG)', 'Storybook'],
    postedDate: '2026-11-10',
    applicationDeadline: '2026-12-10',
    openings: 2,
    portalSource: 'Worksphere Retail Portal',
    hasApplied: false,
    hasSaved: false,
    matchPercentage: 84,
    matchCategory: 'High'
  },
  {
    _id: 'ws-job-106',
    jobCode: 'WS-HL-1172',
    jobTitle: 'Full Stack Software Engineer',
    companyName: 'HealthPulse Diagnostics',
    companyLogo: 'https://ui-avatars.com/api/?name=Health+Pulse&background=dc2626&color=fff&bold=true&size=128',
    department: 'Connected Health',
    industry: 'HealthTech',
    location: 'Chennai, India',
    workMode: 'Hybrid',
    employmentType: 'Contract-to-Hire',
    experienceRange: '2 - 5 Years',
    salaryRange: '₹16 LPA - ₹22 LPA',
    jobDescription:
      'Develop HIPAA-compliant telemedicine portals, real-time doctor-patient consultation scheduling, and diagnostic reporting dashboards.',
    skills: ['Angular', 'Express.js', 'PostgreSQL', 'WebRTC', 'REST APIs', 'Docker'],
    postedDate: '2026-11-16',
    applicationDeadline: '2026-12-30',
    openings: 5,
    portalSource: 'Worksphere Health Portal',
    hasApplied: false,
    hasSaved: false,
    matchPercentage: 74,
    matchCategory: 'Average'
  }
];

@Component({
  selector: 'app-find-jobs-page',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Loader, JobCard],
  templateUrl: './find-jobs-page.html',
  styleUrl: './find-jobs-page.css'
})
export class FindJobsPage implements OnInit {
  allJobs: JobCardData[] = [];
  filteredJobs: JobCardData[] = [];
  isLoading = false;
  isAIMatching = false;
  isAIApplied = false;

  searchQuery = '';
  selectedDepartment = 'all';
  selectedWorkMode = 'all';

  departmentOptions: InputOption[] = [
    { label: 'All Departments', value: 'all' },
    { label: 'Product Engineering', value: 'Product Engineering' },
    { label: 'Cloud Infrastructure', value: 'Cloud Infrastructure' },
    { label: 'Digital Banking', value: 'Digital Banking' },
    { label: 'Applied AI', value: 'Applied AI' },
    { label: 'Design Engineering', value: 'Design Engineering' },
    { label: 'Connected Health', value: 'Connected Health' }
  ];

  workModeOptions: InputOption[] = [
    { label: 'All Work Modes', value: 'all' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'On-site', value: 'On-site' }
  ];

  activeFilters = [
    { label: 'Full-Time Roles', value: 'Full-Time' },
    { label: 'Worksphere Verified', value: 'verified' },
    { label: 'Angular & Node.js', value: 'stack' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.allJobs = STATIC_WORKSPHERE_JOBS.map(j => ({
      ...j,
      matchPercentage: undefined,
      matchCategory: undefined
    }));
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredJobs = this.allJobs.filter(job => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        job.jobTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchesDept =
        this.selectedDepartment === 'all' || job.department === this.selectedDepartment;

      const matchesMode =
        this.selectedWorkMode === 'all' || job.workMode === this.selectedWorkMode;

      return matchesSearch && matchesDept && matchesMode;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedDepartment = 'all';
    this.selectedWorkMode = 'all';
    this.activeFilters = [
      { label: 'Full-Time Roles', value: 'Full-Time' },
      { label: 'Worksphere Verified', value: 'verified' }
    ];
    this.applyFilters();
  }

  removeFilter(filterToRemove: any): void {
    this.activeFilters = this.activeFilters.filter(f => f.value !== filterToRemove.value);
  }

  toggleSave(job: JobCardData): void {
    job.hasSaved = !job.hasSaved;
  }

  viewDetails(job: JobCardData): void {
    this.router.navigate(['/job-details', job._id]);
  }

  matchWithAI(): void {
    this.isAIMatching = true;
    setTimeout(() => {
      this.allJobs = this.allJobs.map(job => {
        const template = STATIC_WORKSPHERE_JOBS.find(s => s._id === job._id);
        return {
          ...job,
          matchPercentage: template?.matchPercentage,
          matchCategory: template?.matchCategory
        };
      });
      this.allJobs.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
      this.applyFilters();
      this.isAIMatching = false;
      this.isAIApplied = true;
    }, 600);
  }

  clearAIMatch(): void {
    this.isAIApplied = false;
    this.allJobs = this.allJobs.map(job => ({
      ...job,
      matchPercentage: undefined,
      matchCategory: undefined
    }));
    this.applyFilters();
  }
}
