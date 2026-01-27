import { Routes } from '@angular/router';
import { Jobposts } from './jobposts/jobposts';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { UserProfile } from './user-profile/user-profile';
import { Seeker } from './seeker';
import { Portfolio } from './portfolio/portfolio';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { ProjectDetailsPage } from './project-details-page/project-details-page';
import { AppliedJobpostsPage } from './applied-jobposts-page/applied-jobposts-page';
import { AssessmentsRoomPage } from './assessments-room-page/assessments-room-page';


export const SEEKER_ROUTES: Routes = [
  {
    path: '',
    component: Seeker,
    children: [
      { path: 'jobposts', component: Jobposts },
      { path: 'applied-jobposts', component: AppliedJobpostsPage },
      { path: 'assessments', component: AssessmentsRoomPage },
      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'my-portfolio', component: Portfolio },
      { path: 'project/:id/project-details', component:ProjectDetailsPage },
      { path: '', redirectTo: 'jobposts', pathMatch: 'full' }
    ],
  },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
