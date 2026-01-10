import { Routes } from '@angular/router';
import { Jobposts } from './jobposts/jobposts';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { UserProfile } from './user-profile/user-profile';
import { Seeker } from './seeker';
import { Portfolio } from './portfolio/portfolio';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { ProjectDetailsPage } from './project-details-page/project-details-page';
import { CompanyDetailsPage } from './company-details-page/company-details-page';
import { AnalyticsPerformancePage } from './analytics-performance-page/analytics-performance-page';
import { LiveAssessmentPage } from './live-assessment-page/live-assessment-page';
import { AssessmentsRoomPage } from './assessments-room-page/assessments-room-page';
import { ResumeAnalyzer } from './resume-analyzer/resume-analyzer';
import { ResumeAnalyzerReport } from './resume-analyzer-report/resume-analyzer-report';
import { AppliedJobpostsPage } from './applied-jobposts-page/applied-jobposts-page';

export const SEEKER_ROUTES: Routes = [
  {
    path: '',
    component: Seeker,
    children: [
      { path: 'jobposts', component: Jobposts },
      { path: 'jobposts/:jobPostId/job-details', component: JobDetailsPage },
      { path: 'company/:id/company-details', component: CompanyDetailsPage },
      { path: 'applied-jobposts', component: AppliedJobpostsPage },

      { path: 'assessments', component: AssessmentsRoomPage },
      { path: 'assessments/live-test', component: LiveAssessmentPage },
      { path: 'scheduled-meetings', component: ScheduledMeetings },

      { path: 'my-portfolio', component: Portfolio },

      { path: 'project/:id/project-details', component:ProjectDetailsPage },
      { path: 'analytics-performance', component:  AnalyticsPerformancePage  },
      { path: 'analytics-performance/resume-analyzer', component:  ResumeAnalyzer  },
      { path: 'analytics-performance/resume-analyzer-report', component: ResumeAnalyzerReport  },

      { path: '', redirectTo: 'jobposts', pathMatch: 'full' }
    ],
  },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
