import { Routes } from '@angular/router';
import { LandingPage } from './views/pages/landing-page/landing-page';
import { TalentMarketplacePage } from './views/pages/talent-marketplace-page/talent-marketplace-page';
import { FindWorkPage } from './views/pages/find-work-page/find-work-page';
import { RecruitmentPage } from './views/pages/recruitment-page/recruitment-page';
import { InterviewPage } from './views/pages/interview-page/interview-page';
import { ResumeBuilderPage } from './views/pages/resume-builder-page/resume-builder-page';
import { BlogPage } from './views/pages/blog-page/blog-page';
import { AboutPage } from './views/pages/about-page/about-page';

export const routes: Routes = [
  { path: 'home', component: LandingPage, title: 'Landing page' },
  { path: 'talent-marketplace', component: TalentMarketplacePage, title: 'Skills page' },
  { path: 'find-work', component: FindWorkPage, title: 'Skills page' },
  { path: 'recruitment-process', component: RecruitmentPage, title: 'Hire page' },
  { path: 'interview-process', component: InterviewPage, title: 'Hire page' },
  { path: 'resume-builder', component: ResumeBuilderPage, title: 'Hire page' },
  { path: 'about', component: AboutPage, title: 'Hire page' },
  { path: 'blog', component: BlogPage, title: 'Hire page' },
  { path: '**', redirectTo: 'home' },
];
