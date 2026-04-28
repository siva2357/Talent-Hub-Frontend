import { Routes } from '@angular/router';
import { UserPages } from './user-pages';
import { AppliedJobpostsPage } from './applied-jobposts-page/applied-jobposts-page';
import { AssessmentsRoomPage } from './assessments-room-page/assessments-room-page';
import { Portfolio } from './portfolio/portfolio';
import { ProjectDetailsPage } from './project-details-page/project-details-page';
import { ResumeAnalytics } from './resume-analytics/resume-analytics';
import { JobApplications } from './job-applications/job-applications';
import { TalentProfilePage } from './talent-profile-page/talent-profile-page';
import { Talents } from './talents/talents';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { Recruiters } from './recruiters/recruiters';
import { Seekers } from './seekers/seekers';
import { Companies } from './companies/companies';
import { BlogPage } from './blog-page/blog-page';
import { UserProfile } from './user-profile/user-profile';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { ManageJobsPage } from './manage-jobs-page/manage-jobs-page';
import { JobProfilesPage } from './job-profiles-page/job-profiles-page';
import { InterviewManagementPage } from './interview-management-page/interview-management-page';
import { ResumeAtsReport } from './resume-ats-report/resume-ats-report';
import { SavedTalents } from './saved-talents/saved-talents';
import { ManageAssessments } from './manage-assessments/manage-assessments';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { RoleGuard } from '../../../core/guards/role.guard';
import { AuthGuard } from '../../../core/guards/auth.guard';
import { RecruiterDashboard } from './recruiter-dashboard/recruiter-dashboard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { CandidateHiringPipelineProcessPage } from './candidate-hiring-pipeline-process-page/candidate-hiring-pipeline-process-page';


export const USER_ROUTES: Routes = [
  { path: '', component: UserPages,
     children: [
      // -------- SEEKER --------
      { path: 'jobprofile', component: JobProfilesPage, canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' }},
      { path: 'jobprofile/:id/job-details', component: JobDetailsPage ,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' }},
      { path: 'applied-jobposts', component: AppliedJobpostsPage ,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' }},
      { path: 'assessments', component: AssessmentsRoomPage ,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' }},
      { path: 'scheduled-meetings', component: ScheduledMeetings,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' } },
      { path: 'my-portfolio', component: Portfolio, canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' } },
      { path: 'project/:id/project-details', component: ProjectDetailsPage,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' } },
      { path: 'resume-analytics', component: ResumeAnalytics, canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' } },
      { path: 'resume-analytics/ats-report', component: ResumeAtsReport, canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'jobSeeker' } },

      // -------- RECRUITER --------
      { path: 'my-dashboard', component: RecruiterDashboard,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path: 'my-jobposts', component: ManageJobsPage,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path: 'my-jobposts/:id/job-applications', component: JobApplications,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path: 'manage-interviews', component: InterviewManagementPage,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path:  'manage-assessments',component:ManageAssessments,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path: 'talents', component: Talents,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path: 'talents/:id/profile', component: TalentProfilePage,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },
      { path: 'saved-talents', component: SavedTalents,canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'recruiter' } },

      // -------- ADMIN --------
      { path: 'dashboard', component: AdminDashboard,  title:"Admin dashboard", canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'hiring-process', component: CandidateHiringPipelineProcessPage,  title:"Overview hiring pipeline", canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'recruiters-list', component: Recruiters, title:"Recruiters list", canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'seekers-list', component: Seekers, title:"Jobseekers list", canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'company-list', component: Companies, title:"Company list", canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'admin' } },
      { path: 'blog-list', component: BlogPage, title:"Blog list", canActivate: [RoleGuard,AuthGuard], data: { expectedRole: 'admin' } },

      // default route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

{
  path: 'profile',
  component: UserProfile,
  canActivate: [AuthGuard]   // ✅ only login required
},
{
  path: 'account-settings',
  component: UserAccountSettings,
  canActivate: [AuthGuard]   // ✅ only login required
}
];
