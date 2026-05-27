import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/layouts/public-layout/public-layout.component';
import { HomeComponent } from './features/public/home/home.component';
import { HireTalentComponent } from './features/public/hire-talent/hire-talent.component';
import { FindWorkComponent } from './features/public/find-work/find-work.component';
import { WhyTalenthubComponent } from './features/public/why-talenthub/why-talenthub.component';
import { ServicesComponent } from './features/public/services/services.component';
import { AboutUsComponent } from './features/public/about-us/about-us.component';
import { BlogComponent } from './features/public/blog/blog.component';
import { BlogDetailsComponent } from './features/public/blog-details/blog-details.component';

// Account Components
import { SigninComponent } from './features/account/signin/signin.component';
import { SignupComponent } from './features/account/signup/signup.component';
import { ForgotPasswordComponent } from './features/account/forgot-password/forgot-password.component';
import { OtpVerificationComponent } from './features/account/otp-verification/otp-verification.component';
import { ConfirmationComponent } from './features/account/confirmation/confirmation.component';
import { ResetPasswordComponent } from './features/account/reset-password/reset-password.component';
import { ProfileFormComponent } from './features/account/profile-form/profile-form.component';
import { RegistrationComponent } from './features/account/registration/registration.component';

// User Layout & Features
import { UserLayoutComponent } from './core/layouts/user-layout/user-layout.component';


import { UserProfileComponent } from './shared/pages/user-profile/user-profile.component';
import { AccountSettingsComponent } from './shared/pages/account-settings/account-settings.component';
import { ChatComponent } from './shared/pages/chat/chat.component';
import { ContactSupportComponent } from './shared/pages/contact-support/contact-support.component';
import { InterviewSetupComponent } from './shared/pages/interview-setup/interview-setup.component';
import { InterviewRoomComponent } from './shared/pages/interview-room/interview-room.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

// Freelancer Pages
import { FreelancerDashboardComponent } from './features/user/freelancer/pages/freelancer-dashboard/freelancer-dashboard.component';
import { ProposalsComponent } from './features/user/freelancer/pages/proposals/proposals.component';
import { ActiveContractsComponent } from './features/user/freelancer/pages/active-contracts/active-contracts.component';
import { ContractDiaryComponent } from './features/user/freelancer/pages/contract-diary/contract-diary.component';
import { HourlyWorkDiaryComponent } from './features/user/freelancer/pages/hourly-work-diary/hourly-work-diary.component';
import { AttendanceOverviewComponent } from './features/user/freelancer/pages/attendance-overview/attendance-overview.component';
import { MarkAttendanceComponent } from './features/user/freelancer/pages/mark-attendance/mark-attendance.component';
import { CaptureAttendanceComponent } from './features/user/freelancer/pages/capture-attendance/capture-attendance.component';
import { FinanceOverviewComponent } from './features/user/freelancer/pages/finance-overview/finance-overview.component';
import { FinanceReportComponent } from './features/user/freelancer/pages/finance-report/finance-report.component';
import { FinanceManagementComponent } from './features/user/freelancer/pages/finance-management/finance-management.component';

// Error/Utility Components
import { AccessDeniedComponent } from './shared/pages/access-denied/access-denied.component';
import { FindContractsComponent } from './features/user/freelancer/pages/find-contracts/find-contracts.component';
import { SavedContractsComponent } from './features/user/freelancer/pages/saved-contracts/saved-contracts.component';
import { ContractDetailsComponent } from './features/user/freelancer/pages/contract-details/contract-details.component';
import { LegalContractComponent } from './features/user/freelancer/pages/legal-contract/legal-contract.component';

// Client Pages
import { ClientDashboardComponent } from './features/user/client/pages/client-dashboard/client-dashboard.component';
import { YourContractsComponent } from './features/user/client/pages/your-contracts/your-contracts.component';
import { ContractProposalsComponent } from './features/user/client/pages/contract-proposals/contract-proposals.component';
import { ContractProgressComponent } from './features/user/client/pages/contract-progress/contract-progress.component';
import { ContractTimesheetComponent } from './features/user/client/pages/contract-timesheet/contract-timesheet.component';
import { SearchTalentComponent } from './features/user/client/pages/search-talent/search-talent.component';
import { TalentProfileComponent } from './features/user/client/pages/talent-profile/talent-profile.component';
import { SavedTalentComponent } from './features/user/client/pages/saved-talent/saved-talent.component';
import { PendingOffersComponent } from './features/user/client/pages/pending-offers/pending-offers.component';
import { HiredTalentComponent } from './features/user/client/pages/hired-talent/hired-talent.component';
import { FinancialSummaryComponent } from './features/user/client/pages/financial-summary/financial-summary.component';
import { TransactionHistoryComponent } from './features/user/client/pages/transaction-history/transaction-history.component';
import { SpendingActivitiesComponent } from './features/user/client/pages/spending-activities/spending-activities.component';
import { ContractFormComponent } from './features/user/client/pages/contract-form/contract-form.component';
import { ContractViewDetailsComponent } from './features/user/client/pages/contract-view-details/contract-view-details.component';
import { ProjectDetailsComponent } from './features/user/client/pages/project-details/project-details.component';
import { ContractProfileComponent } from './features/user/client/pages/contract-profile/contract-profile.component';
import { LegalFormComponent } from './features/user/client/pages/legal-form/legal-form.component';

// Admin Component
import { AdminComponent } from './features/user/admin/admin.component';

export const routes: Routes = [
  // Public Routes (With Navbar and Footer)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'hire-talent', component: HireTalentComponent },
      { path: 'find-work', component: FindWorkComponent },
      { path: 'why-talenthub', component: WhyTalenthubComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog-details/:slug', component: BlogDetailsComponent },

    ]
  },

  // Account Routes (Without Navbar and Footer)
  {
    path: 'account',
    children: [
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'otp-verification', component: OtpVerificationComponent },
      { path: 'confirmation', component: ConfirmationComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'profile-form', component: ProfileFormComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'access-denied', component: AccessDeniedComponent },
    ]
  },

  // User Dashboard Routes (With User Navbar)
  {
    path: 'user', component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: '/account/signin', pathMatch: 'full' },

      // Client Pages
      { path: 'client-dashboard', component: ClientDashboardComponent },

      { path: 'your-contracts', component: YourContractsComponent },
      { path: 'contract-form', component: ContractFormComponent },
      { path: 'contract-view-details', component: ContractViewDetailsComponent },
      { path: 'contract-proposals', component: ContractProposalsComponent },
      { path: 'contract-progress', component: ContractProgressComponent },
      { path: 'contract-timesheet', component: ContractTimesheetComponent },

      { path: 'search-talent', component: SearchTalentComponent },
      { path: 'talent-profile', component: TalentProfileComponent },
      { path: 'project-details/:id', component: ProjectDetailsComponent },
      { path: 'contract-profile/:id', component: ContractProfileComponent },
      { path: 'saved-talent', component: SavedTalentComponent },
      { path: 'hired-talent', component: HiredTalentComponent },

      { path: 'financial-summary', component: FinancialSummaryComponent },
      { path: 'transaction-history', component: TransactionHistoryComponent },
      { path: 'spending-activities', component: SpendingActivitiesComponent },



      // Freelancer Page
      { path: 'my-dashboard', component: FreelancerDashboardComponent },
      { path: 'find-contracts', component: FindContractsComponent },
      { path: 'contract-details', component: ContractDetailsComponent },
      { path: 'saved-contracts', component: SavedContractsComponent },
      { path: 'proposals', component: ProposalsComponent },
      { path: 'offers', component: ProposalsComponent, data: { defaultTab: 'offers' } },
      { path: 'active-contracts', component: ActiveContractsComponent },
      { path: 'contract-diary', component: ContractDiaryComponent },
      { path: 'hourly-work-diary', component: HourlyWorkDiaryComponent },
      { path: 'attendance-overview', component: AttendanceOverviewComponent },
      { path: 'mark-attendance', component: MarkAttendanceComponent },
      { path: 'capture-attendance', component: CaptureAttendanceComponent },
      { path: 'finance-overview', component: FinanceOverviewComponent },
      { path: 'finance-report', component: FinanceReportComponent },
      { path: 'finance-management', component: FinanceManagementComponent },

      // Admin Route
      { path: 'admin', component: AdminComponent }
    ]
  },

  // Independent User Utility Routes (Without User Navbar)
  {
    path: 'user',
    children: [
      { path: 'profile', component: UserProfileComponent },
      { path: 'settings', component: AccountSettingsComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'contact-support', component: ContactSupportComponent },
      { path: 'interview-setup', component: InterviewSetupComponent },
      { path: 'interview-room', component: InterviewRoomComponent },
      { path: 'legal-contract/:id', component: LegalContractComponent },
      { path: 'legal-form/:contractId', component: LegalFormComponent },
    ]
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
