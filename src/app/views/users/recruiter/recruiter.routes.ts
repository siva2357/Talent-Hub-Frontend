import { Routes } from '@angular/router';
import { Recruiter } from './recruiter';
import { Jobposts } from './jobposts/jobposts';
import { Talents } from './talents/talents';

import { JobApplications } from './job-applications/job-applications';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { ChatPage } from './chat-page/chat-page';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { UserProfile } from './user-profile/user-profile';
import { ApplicantsListPage } from './applicants-list-page/applicants-list-page';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { TalentProfilePage } from './talent-profile-page/talent-profile-page';
import { AnalyticsPerformancePage } from './analytics-performance-page/analytics-performance-page';
import { InterviewMeetingPage } from '../../shared/interview-meeting-page/interview-meeting-page';

export const RECRUITER_ROUTES: Routes = [
  {
    path: '',
    component: Recruiter,
    children: [
      { path: 'my-jobs', component: Jobposts },
      { path: 'my-jobs/:id/job-details', component: JobDetailsPage },
      { path: 'job-applications', component: JobApplications },
      { path: 'job-applications/:id/applicant-list', component: ApplicantsListPage },
      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'talents', component: Talents },
      { path: 'talents/:id/profile', component: TalentProfilePage },

      { path: 'analytics-performance', component:  AnalyticsPerformancePage  },
      { path: 'interview/meet-session/:id', component: InterviewMeetingPage},
      { path: '', redirectTo: 'my-jobs', pathMatch: 'full' }
    ],
  },
  { path: 'chat-page', component: ChatPage },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
