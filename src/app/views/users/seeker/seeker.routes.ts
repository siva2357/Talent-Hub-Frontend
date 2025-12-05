import { Routes } from '@angular/router';
import { Jobposts } from './jobposts/jobposts';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { ChatPage } from './chat-page/chat-page';
import { UserProfile } from './user-profile/user-profile';
import { Seeker } from './seeker';
import { AppliedJobs } from './applied-jobs/applied-jobs';
import { SavedJobs } from './saved-jobs/saved-jobs';
import { Portfolio } from './portfolio/portfolio';
import { JobOffers } from './job-offers/job-offers';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { ProjectForm } from './project-form/project-form';
import { EditProjectForm } from './edit-project-form/edit-project-form';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { ProjectDetailsPage } from './project-details-page/project-details-page';
import { CompanyDetailsPage } from './company-details-page/company-details-page';

export const SEEKER_ROUTES: Routes = [
  {
    path: '',
    component: Seeker,
    children: [
      { path: 'jobposts', component: Jobposts },
      { path: 'jobposts/:id/job-details', component: JobDetailsPage },
      { path: 'company/:id/company-details', component: CompanyDetailsPage },
      { path: 'saved-jobs', component: SavedJobs },
      { path: 'applied-jobs', component: AppliedJobs },
      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'my-portfolio', component: Portfolio },
      { path: 'post-project', component: ProjectForm },
      { path: 'project/:id/edit-project', component: EditProjectForm },
      { path: 'project/:id/project-details', component:ProjectDetailsPage },
      { path: 'my-job-offers', component: JobOffers },
      { path: '', redirectTo: 'jobposts', pathMatch: 'full' }
    ],
  },
  { path: 'chat-page', component: ChatPage },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
