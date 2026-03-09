import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { RecruiterProfilePage } from './recruiter-profile-page/recruiter-profile-page';
import { SeekerProfilePage } from './seeker-profile-page/seeker-profile-page';
import { UserProfile } from './user-profile/user-profile';
import { Companies } from './companies/companies';
import { CompanyDetails } from './company-details/company-details';
import { BlogDetails } from './blog-details/blog-details';
import { BlogPage } from './blog-page/blog-page';

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
      { path: 'company-list', component: Companies },
      { path: 'company-list/:id/details', component: CompanyDetails },
      { path: 'blog-list', component: BlogPage },
      { path: 'blog-list/:id/details', component: BlogDetails  },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },
  { path: 'profile', component: UserProfile },

];
