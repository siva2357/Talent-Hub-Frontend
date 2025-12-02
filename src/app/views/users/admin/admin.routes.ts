import { Routes } from '@angular/router';
import { Jobposts } from './jobposts/jobposts';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { Interviews } from './interviews/interviews';
import { JobApplicants } from './job-applicants/job-applicants';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'recruiters-list', component: Recruiters },
      { path: 'seekers-list', component: Seekers },
      { path: 'jobposts', component: Jobposts },
      { path: 'job-applicants', component: JobApplicants},
      { path: 'interviews', component: Interviews },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },

];
