import { Routes } from '@angular/router';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { Interviews } from './interviews/interviews';
import { RecruiterProfilePage } from './recruiter-profile-page/recruiter-profile-page';
import { SeekerProfilePage } from './seeker-profile-page/seeker-profile-page';
import { BlogPostPage } from './blog-post-page/blog-post-page';
import { BlogPostForm } from './blog-post-form/blog-post-form';
import { BlogPostDetails } from './blog-post-details/blog-post-details';



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
      { path: 'blog', component: BlogPostPage },
      { path: 'blog-form', component: BlogPostForm },
      { path: 'blog/:id/blog-details', component: BlogPostDetails },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },

];
