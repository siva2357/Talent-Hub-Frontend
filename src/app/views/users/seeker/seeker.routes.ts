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
      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'my-portfolio', component: Portfolio },
      { path: 'project/:id/project-details', component:ProjectDetailsPage },
      { path: '', redirectTo: 'jobposts', pathMatch: 'full' }
    ],
  },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
