import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private tokenService = inject(TokenService);
  private route = inject(ActivatedRoute);

  role: string = '';
  userData: any = null;
  profileData: any = null;
  contracts: any[] = [];
  diaries: any[] = [];
  portfolio: any[] = [];
  
  metrics: { active: number, completed: number, jobSuccess: number, hiringRisk: string } = { active: 0, completed: 0, jobSuccess: 0, hiringRisk: 'Low' };

  // Static Job Seeker Profile Data (for Worksphere Gateway preview)
  jobSeekerStaticProfile = {
    fullName: 'Aarav Sharma',
    headline: 'Senior Full Stack Engineer | Angular & Node.js Specialist',
    email: 'aarav.sharma@talenthub.io',
    phoneNumber: '+91 98765 43210',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    joiningDate: 'Jan 2026',
    shortBio: 'Passionate Full Stack Engineer with 5+ years of experience building scalable enterprise web applications, microservices, and cloud-native solutions. Actively exploring full-time product engineering roles via Worksphere partner companies.',
    skills: ['Angular', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Docker', 'AWS', 'System Design'],
    experienceYears: '5+ Years',
    preferredWorkMode: 'Hybrid / Remote',
    noticePeriod: '15 Days (Immediate Negotiable)',
    expectedCtc: '₹24 LPA - ₹30 LPA',
    resumeFileName: 'Aarav_Sharma_FullStack_Resume_2026.pdf',
    resumeUpdated: 'Updated 3 days ago',
    metrics: {
      applicationsSubmitted: 12,
      assessmentsCleared: 5,
      interviewsScheduled: 2,
      offersReceived: 1
    },
    workExperience: [
      {
        id: 1,
        role: 'Senior Software Engineer',
        company: 'InnovateX Technologies',
        duration: '2023 - Present',
        location: 'Bengaluru, India',
        description: 'Lead frontend and API architecture for enterprise SaaS modules serving 100k+ daily users.'
      },
      {
        id: 2,
        role: 'Software Engineer',
        company: 'ByteCraft Digital',
        duration: '2021 - 2023',
        location: 'Hyderabad, India',
        description: 'Developed responsive Angular dashboards and RESTful Node.js microservices.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology (NIT)',
        year: '2017 - 2021',
        score: '8.7 CGPA'
      }
    ],
    recentApplications: [
      {
        id: 'WS-1042',
        jobTitle: 'Principal Frontend Engineer',
        companyName: 'TechNova Solutions',
        portalSource: 'Worksphere Enterprise Portal',
        appliedDate: '2026-11-12',
        package: '₹28 LPA',
        status: 'Interview Scheduled'
      },
      {
        id: 'WS-1039',
        jobTitle: 'Full Stack Lead',
        companyName: 'FinEdge Corp',
        portalSource: 'Worksphere Enterprise Portal',
        appliedDate: '2026-11-05',
        package: '₹30 LPA',
        status: 'Offer Received'
      },
      {
        id: 'WS-1031',
        jobTitle: 'Cloud Application Developer',
        companyName: 'CloudScale Systems',
        portalSource: 'Worksphere Enterprise Portal',
        appliedDate: '2026-11-01',
        package: '₹25 LPA',
        status: 'Assessment Pending'
      }
    ],
    languages: [
      { language: 'English', proficiency: 'Native / Bilingual' },
      { language: 'Hindi', proficiency: 'Native / Bilingual' }
    ],
    socialLinks: [
      { platform: 'LinkedIn', profileUrl: 'https://linkedin.com/in/aarav-sharma-dev' },
      { platform: 'GitHub', profileUrl: 'https://github.com/aarav-sharma-dev' }
    ]
  };
  
  isLoading: boolean = true;
  error: string = '';
  isPublicView: boolean = false;

  ngOnInit() {
    this.role = this.tokenService.getRole()?.toLowerCase() || '';
    
    if (this.role === 'job-seeker') {
      this.isLoading = false;
      return;
    }

    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.isPublicView = true;
        this.loadProfileData(params['id']);
      } else {
        this.isPublicView = false;
        this.loadProfileData();
      }
    });
  }

  loadProfileData(id?: string) {
    this.isLoading = true;
    
    const request = id ? this.profileService.getProfileById(id) : this.profileService.getMyProfile();
    
    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          this.userData = res.user;
          this.profileData = res.profile;
          this.contracts = res.contracts || [];
          this.diaries = res.diaries || [];
          this.portfolio = res.portfolio || [];
          
          // Compute metrics
          const completed = this.diaries.filter((d: any) => d.status === 'completed' || d.status === 'closed').length;
          const active = this.diaries.filter((d: any) => d.status === 'active' || d.status === 'in progress' || d.status === 'open').length;
          const total = completed + active;
          const jobSuccess = total > 0 ? Math.round((completed / total) * 100) : 0;
          
          let hiringRisk = 'Medium';
          if (total === 0) {
             hiringRisk = 'Medium'; // Default for new freelancers
          } else if (jobSuccess >= 85) {
             hiringRisk = 'Low';
          } else if (jobSuccess >= 60) {
             hiringRisk = 'Medium';
          } else {
             hiringRisk = 'High';
          }

          this.metrics = { active, completed, jobSuccess, hiringRisk };

          if (!id) {
            this.role = this.userData.role.toLowerCase();
          } else {
            this.role = this.userData.role.toLowerCase();
          }
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching profile:', err);
        this.error = 'Failed to load profile data.';
        this.isLoading = false;
      }
    });
  }
}
