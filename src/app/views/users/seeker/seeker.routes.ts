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

export const SEEKER_ROUTES: Routes = [
  {
    path: '',
    component: Seeker,
    children: [
      { path: 'jobposts', component: Jobposts },
      { path: 'saved-jobs', component: SavedJobs },
      { path: 'applied-jobs', component: AppliedJobs },
      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'my-portfolio', component: Portfolio },
      { path: 'my-job-offers', component: JobOffers },
      { path: '', redirectTo: 'jobposts', pathMatch: 'full' }
    ],
  },
  { path: 'chat-page', component: ChatPage },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
