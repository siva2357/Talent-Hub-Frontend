
import { Routes } from '@angular/router';
import { UserPages } from './user-pages';
import { AppliedJobpostsPage } from './applied-jobposts-page/applied-jobposts-page';
import { AssessmentsRoomPage } from './assessments-room-page/assessments-room-page';
import { Portfolio } from './portfolio/portfolio';
import { ProjectDetailsPage } from './project-details-page/project-details-page';
import { ResumeAnalytics } from './resume-analytics/resume-analytics';
import { JobApplications } from './job-applications/job-applications';
import { ApplicantsListPage } from './applicants-list-page/applicants-list-page';
import { ApplicantListProfilePage } from './applicant-list-profile-page/applicant-list-profile-page';
import { TalentProfilePage } from './talent-profile-page/talent-profile-page';
import { Talents } from './talents/talents';
import { HiredTalents } from './hired-talents/hired-talents';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { Dashboard } from './dashboard/dashboard';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { Companies } from './companies/companies';
import { BlogPage } from './blog-page/blog-page';
import { UserProfile } from './user-profile/user-profile';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { ManageJobsPage } from './manage-jobs-page/manage-jobs-page';
import { JobProfilesPage } from './job-profiles-page/job-profiles-page';
import { InterviewManagementPage } from './interview-management-page/interview-management-page';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserPages,
    children: [
      // -------- SEEKER --------
      { path: 'jobprofile', component: JobProfilesPage },
      { path: 'applied-jobposts', component: AppliedJobpostsPage },
      { path: 'assessments', component: AssessmentsRoomPage },
      { path: 'my-portfolio', component: Portfolio },
      { path: 'project/:id/project-details', component: ProjectDetailsPage },
      { path: 'resume-analytics', component: ResumeAnalytics },

      // -------- RECRUITER --------
      { path: 'my-jobposts', component: ManageJobsPage },
      { path: 'job-applications', component: JobApplications },
      { path: 'job-applications/:jobId/applicant-list', component: ApplicantsListPage },
      { path: 'job-applications/:jobId/applicant-list/:applicantId/profile', component: ApplicantListProfilePage,},
      { path: 'talents', component: Talents },
      { path: 'talents/:id/profile', component: TalentProfilePage },
      { path: 'hired-talents', component: HiredTalents },

      // -------- COMMON --------

      { path: 'scheduled-meetings', component: ScheduledMeetings },
      { path: 'manage-interviews', component: InterviewManagementPage },
      // -------- ADMIN --------
      { path: 'dashboard', component: Dashboard },
      { path: 'recruiters-list', component: Recruiters },
      { path: 'seekers-list', component: Seekers },
      { path: 'company-list', component: Companies },
      { path: 'blog-list', component: BlogPage },

      // default route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
