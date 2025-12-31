import { Routes } from '@angular/router';
import { Jobposts } from './jobposts/jobposts';
import { Admin } from './admin';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { Interviews } from './interviews/interviews';
import { JobApplicants } from './job-applicants/job-applicants';
import { RecruiterProfilePage } from './recruiter-profile-page/recruiter-profile-page';
import { SeekerProfilePage } from './seeker-profile-page/seeker-profile-page';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { JobApplicantsList } from './job-applicants-list/job-applicants-list';
import { SupportRequests } from './support-requests/support-requests';
import { Companies } from './companies/companies';
import { CompanyDetails } from './company-details/company-details';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'companies', component: Companies },
      { path: 'companies/:id/company-details', component: CompanyDetails },
      { path: 'recruiters-list', component: Recruiters },
      { path: 'recruiters-list/:id/profile', component: RecruiterProfilePage },
      { path: 'seekers-list', component: Seekers },
      { path: 'seekers-list/:id/profile', component: SeekerProfilePage },
      { path: 'jobposts', component: Jobposts },
      { path: 'jobposts/:id/details', component: JobDetailsPage },
      { path: 'job-applicants', component: JobApplicants},
      { path: 'job-applicants/:id/list', component: JobApplicantsList},
      { path: 'interviews', component: Interviews },
      { path: 'support-requests', component: SupportRequests },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
  },

];
