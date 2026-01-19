import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { Interviews } from './interviews/interviews';
import { RecruiterProfilePage } from './recruiter-profile-page/recruiter-profile-page';
import { SeekerProfilePage } from './seeker-profile-page/seeker-profile-page';



export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'recruiters-list', component: Recruiters },
      { path: 'recruiters-list/:id/profile', component: RecruiterProfilePage },
      { path: 'seekers-list', component: Seekers },
      { path: 'seekers-list/:id/profile', component: SeekerProfilePage },
      { path: 'interviews', component: Interviews },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },

];
