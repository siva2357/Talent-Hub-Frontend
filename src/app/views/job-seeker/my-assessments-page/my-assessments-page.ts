import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputField, InputOption } from '../../../library/ui/components/input-field/input-field';
import { Chip } from '../../../library/ui/components/chip/chip';
import { Button } from '../../../library/ui/components/button/button';
import { Loader } from '../../../library/ui/components/loader/loader';
import { AssessmentCard } from '../../../library/shared/components/assessment-card/assessment-card';
import { AssessmentCardData } from '../../../core/models/job.model';

export const STATIC_WORKSPHERE_ASSESSMENTS: AssessmentCardData[] = [
  {
    _id: 'asm-101',
    assessmentCode: 'ASM-WS-501',
    assessmentTitle: 'Angular 18 & Micro-Frontend Architecture Test',
    assessmentType: 'Coding Challenge',
    jobId: 'ws-job-101',
    jobCode: 'WS-TN-1042',
    jobTitle: 'Principal Frontend Engineer (Angular)',
    companyName: 'TechNova Solutions',
    companyLogo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=4a3aff&color=fff&bold=true&size=128',
    description:
      'Complete 2 hands-on Angular signal state management tasks and 15 architecture multiple-choice questions on Assessment Studio via Worksphere.',
    skillsTested: ['Angular 18', 'RxJS', 'TypeScript', 'Change Detection', 'Performance'],
    durationMinutes: 90,
    totalQuestions: 17,
    passingScore: '75%',
    assignedDate: '2026-11-14',
    dueDate: '2026-11-22',
    status: 'Pending',
    assessmentLink: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Assessment Studio • Worksphere'
  },
  {
    _id: 'asm-102',
    assessmentCode: 'ASM-WS-502',
    assessmentTitle: 'Distributed Cloud & Kubernetes System Design',
    assessmentType: 'System Design',
    jobId: 'ws-job-102',
    jobCode: 'WS-CS-1088',
    jobTitle: 'Senior Cloud & Backend Architect',
    companyName: 'CloudScale Systems',
    companyLogo: 'https://ui-avatars.com/api/?name=Cloud+Scale&background=0284c7&color=fff&bold=true&size=128',
    description:
      'Design a fault-tolerant multi-region event ingestion pipeline and solve 2 Node.js concurrency problems on Assessment Studio.',
    skillsTested: ['Node.js', 'AWS', 'Kubernetes', 'System Design', 'PostgreSQL'],
    durationMinutes: 120,
    totalQuestions: 4,
    passingScore: '80%',
    assignedDate: '2026-11-15',
    dueDate: '2026-11-24',
    status: 'In Progress',
    assessmentLink: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Assessment Studio • Worksphere'
  },
  {
    _id: 'asm-103',
    assessmentCode: 'ASM-WS-503',
    assessmentTitle: 'LLM RAG Pipeline & FastAPI Engineering Round',
    assessmentType: 'AI Technical Round',
    jobId: 'ws-job-104',
    jobCode: 'WS-AA-1129',
    jobTitle: 'AI Product Engineer (LLM & Web)',
    companyName: 'Aether AI Labs',
    companyLogo: 'https://ui-avatars.com/api/?name=Aether+AI&background=7c3aed&color=fff&bold=true&size=128',
    description:
      'Build a streaming prompt-evaluation endpoint and vector retrieval scoring function in the Assessment Studio sandbox.',
    skillsTested: ['Python', 'FastAPI', 'LangChain', 'TypeScript', 'Vector Search'],
    durationMinutes: 60,
    totalQuestions: 3,
    passingScore: '70%',
    assignedDate: '2026-11-16',
    dueDate: '2026-11-25',
    status: 'Pending',
    assessmentLink: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Assessment Studio • Worksphere'
  },
  {
    _id: 'asm-104',
    assessmentCode: 'ASM-WS-504',
    assessmentTitle: 'Full Stack FinTech Security & Kafka Coding',
    assessmentType: 'Coding Challenge',
    jobId: 'ws-job-103',
    jobCode: 'WS-FE-1104',
    jobTitle: 'Full Stack Lead Engineer',
    companyName: 'FinEdge Corp',
    companyLogo: 'https://ui-avatars.com/api/?name=Fin+Edge&background=059669&color=fff&bold=true&size=128',
    description:
      'Completed technical screening covering idempotent payment APIs, JWT security, and Angular reactive forms.',
    skillsTested: ['Angular', 'Node.js', 'Kafka', 'JWT Security', 'MongoDB'],
    durationMinutes: 90,
    totalQuestions: 12,
    passingScore: '75%',
    assignedDate: '2026-11-06',
    dueDate: '2026-11-10',
    status: 'Completed',
    score: '92%',
    assessmentLink: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Assessment Studio • Worksphere'
  },
  {
    _id: 'asm-105',
    assessmentCode: 'ASM-WS-505',
    assessmentTitle: 'UI/UX Design Systems & WCAG Accessibility Quiz',
    assessmentType: 'MCQ & Aptitude',
    jobId: 'ws-job-105',
    jobCode: 'WS-NX-1150',
    jobTitle: 'Staff UI/UX & Design Systems Engineer',
    companyName: 'NexaVerse Commerce',
    companyLogo: 'https://ui-avatars.com/api/?name=Nexa+Verse&background=ea580c&color=fff&bold=true&size=128',
    description:
      'Assessment covering CSS architecture, design tokens, ARIA roles, and Angular component encapsulation.',
    skillsTested: ['Angular', 'Design Systems', 'WCAG 2.1', 'CSS Grid/Flex', 'Figma Tokens'],
    durationMinutes: 45,
    totalQuestions: 25,
    passingScore: '70%',
    assignedDate: '2026-11-11',
    dueDate: '2026-11-15',
    status: 'Completed',
    score: '88%',
    assessmentLink: 'https://assessment-studio-94716.web.app/',
    portalSource: 'Assessment Studio • Worksphere'
  }
];

@Component({
  selector: 'app-my-assessments-page',
  standalone: true,
  imports: [CommonModule, InputField, Chip, Button, Loader, AssessmentCard],
  templateUrl: './my-assessments-page.html',
  styleUrl: './my-assessments-page.css'
})
export class MyAssessmentsPage implements OnInit {
  activeTab: 'pending' | 'completed' = 'pending';
  allAssessments: AssessmentCardData[] = [];
  filteredAssessments: AssessmentCardData[] = [];
  isLoading: boolean = false;
  actionMessage: string | null = null;

  searchQuery: string = '';
  selectedType: string = 'all';

  typeOptions: InputOption[] = [
    { label: 'All Assessment Types', value: 'all' },
    { label: 'Coding Challenge', value: 'Coding Challenge' },
    { label: 'System Design', value: 'System Design' },
    { label: 'AI Technical Round', value: 'AI Technical Round' },
    { label: 'MCQ & Aptitude', value: 'MCQ & Aptitude' }
  ];

  activeFilters: string[] = ['Worksphere Proctored', 'External Portal'];

  ngOnInit(): void {
    this.allAssessments = STATIC_WORKSPHERE_ASSESSMENTS.map(a => ({ ...a }));
    this.applyFilters();
  }

  get pendingAssessments(): AssessmentCardData[] {
    return this.filteredAssessments.filter(
      a => a.status === 'Pending' || a.status === 'In Progress'
    );
  }

  get completedAssessments(): AssessmentCardData[] {
    return this.filteredAssessments.filter(
      a => a.status === 'Completed' || a.status === 'Expired'
    );
  }

  setTab(tab: 'pending' | 'completed'): void {
    this.activeTab = tab;
  }

  applyFilters(): void {
    this.filteredAssessments = this.allAssessments.filter(a => {
      const matchesSearch =
        !this.searchQuery.trim() ||
        a.assessmentTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.jobTitle.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesType =
        this.selectedType === 'all' || a.assessmentType === this.selectedType;

      return matchesSearch && matchesType;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = 'all';
    this.activeFilters = ['Worksphere Proctored', 'External Portal'];
    this.applyFilters();
  }

  removeFilter(filterToRemove: string): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filterToRemove);
  }

  onStartAssessment(assessment: AssessmentCardData): void {
    if (assessment.status === 'Pending') {
      assessment.status = 'In Progress';
    }
    this.actionMessage = `Opened external assessment portal (${assessment.portalSource}) for "${assessment.assessmentTitle}".`;
  }

  onMarkCompleted(assessment: AssessmentCardData): void {
    assessment.status = 'Completed';
    assessment.score = 'Submitted (Awaiting Sync)';
    this.actionMessage = `Marked "${assessment.assessmentTitle}" for ${assessment.companyName} as completed!`;
  }
}
