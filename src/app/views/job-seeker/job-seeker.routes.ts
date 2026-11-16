import { Routes } from '@angular/router';
import { FindJobsPage } from './find-jobs-page/find-jobs-page';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { MyApplicationsPage } from './my-applications-page/my-applications-page';
import { MyAssessmentsPage } from './my-assessments-page/my-assessments-page';
import { MyInterviewsPage } from './my-interviews-page/my-interviews-page';
import { MyOffersPage } from './my-offers-page/my-offers-page';
import { SavedJobsPage } from './saved-jobs-page/saved-jobs-page';
import { Dashboard } from '../shared/dashboard/dashboard';
import { Profile } from '../shared/profile/profile';
import { AccountSettings } from '../shared/account-settings/account-settings';
import { ContactSupport } from '../shared/contact-support/contact-support';
import { CreateTicket } from '../shared/create-ticket/create-ticket';


export const JOB_SEEKER_ROUTES: Routes = [
    { path: 'dashboard', component: Dashboard },
    { path: 'find-jobs', component: FindJobsPage },
    { path: 'job-details/:id', component: JobDetailsPage },
    { path: 'my-applications', component: MyApplicationsPage },
    { path: 'my-assessments', component: MyAssessmentsPage },
    { path: 'my-interviews', component: MyInterviewsPage },
    { path: 'my-offers', component: MyOffersPage },
    { path: 'saved-jobs', component: SavedJobsPage },
    { path: 'profile', component: Profile },
    { path: 'account-settings', component: AccountSettings },
    { path: 'contact-support', component: ContactSupport },
    { path: 'create-ticket', component: CreateTicket },
];
