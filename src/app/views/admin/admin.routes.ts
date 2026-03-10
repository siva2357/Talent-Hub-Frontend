import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { UserProfile } from './user-profile/user-profile';
import { Companies } from './companies/companies';

import { BlogPage } from './blog-page/blog-page';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'recruiters-list', component: Recruiters },
      { path: 'seekers-list', component: Seekers },
      { path: 'company-list', component: Companies },
      { path: 'blog-list', component: BlogPage },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },
  { path: 'profile', component: UserProfile },

];
