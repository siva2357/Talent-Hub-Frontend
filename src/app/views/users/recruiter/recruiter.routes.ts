import { Routes } from '@angular/router';
import { Recruiter } from './recruiter';
import { Jobposts } from './jobposts/jobposts';
import { Talents } from './talents/talents';
import { SavedTalents } from './saved-talents/saved-talents';
import { HiredTalents } from './hired-talents/hired-talents';
import { JobApplications } from './job-applications/job-applications';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { ChatPage } from './chat-page/chat-page';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { UserProfile } from './user-profile/user-profile';
import { RecruiterProfileForm } from './recruiter-profile-form/recruiter-profile-form';

export const RECRUITER_ROUTES: Routes = [
  {
    path: '',
    component: Recruiter,
    children: [
      { path: 'my-jobs', component: Jobposts },
      { path: 'job-applications', component: JobApplications },
      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'talents', component: Talents },
      { path: 'saved-talents', component: SavedTalents },
      { path: 'hired-talents', component: HiredTalents },
      { path: '', redirectTo: 'my-jobs', pathMatch: 'full' }
    ],
  },
  { path: 'chat-page', component: ChatPage },
    { path: 'profile-form', component: RecruiterProfileForm },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
