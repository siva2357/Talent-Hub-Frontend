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
import { AdminComponent } from './features/user/admin/admin.component';
import { ClientComponent } from './features/user/client/client.component';

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
import { OffersComponent } from './features/user/freelancer/pages/offers/offers.component';
import { ActiveContractsComponent } from './features/user/freelancer/pages/active-contracts/active-contracts.component';
import { ContractDiaryComponent } from './features/user/freelancer/pages/contract-diary/contract-diary.component';
import { HourlyWorkDiaryComponent } from './features/user/freelancer/pages/hourly-work-diary/hourly-work-diary.component';
import { AttendanceOverviewComponent } from './features/user/freelancer/pages/attendance-overview/attendance-overview.component';
import { MarkAttendanceComponent } from './features/user/freelancer/pages/mark-attendance/mark-attendance.component';
import { FinanceOverviewComponent } from './features/user/freelancer/pages/finance-overview/finance-overview.component';
import { FinanceReportComponent } from './features/user/freelancer/pages/finance-report/finance-report.component';
import { FinanceManagementComponent } from './features/user/freelancer/pages/finance-management/finance-management.component';

// Error/Utility Components
import { AccessDeniedComponent } from './shared/pages/access-denied/access-denied.component';
import { FindContractsComponent } from './features/user/freelancer/pages/find-contracts/find-contracts.component';
import { SavedContractsComponent } from './features/user/freelancer/pages/saved-contracts/saved-contracts.component';
import { ContractDetailsComponent } from './features/user/freelancer/pages/contract-details/contract-details.component';
import { LegalContractComponent } from './features/user/freelancer/pages/legal-contract/legal-contract.component';

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
      { path: 'admin', component: AdminComponent },
      { path: 'client', component: ClientComponent },


      // Freelancer Pages
      { path: 'my-dashboard', component: FreelancerDashboardComponent },
      { path: 'find-contracts', component: FindContractsComponent },
      { path: 'contract-details/:id', component: ContractDetailsComponent },
      { path: 'saved-contracts', component: SavedContractsComponent },
      { path: 'proposals', component: ProposalsComponent },
      { path: 'offers', component: OffersComponent },
      { path: 'active-contracts', component: ActiveContractsComponent },
      { path: 'contract-diary', component: ContractDiaryComponent },
      { path: 'hourly-work-diary', component: HourlyWorkDiaryComponent },
      { path: 'attendance-overview', component: AttendanceOverviewComponent },
      { path: 'mark-attendance', component: MarkAttendanceComponent },
      { path: 'finance-overview', component: FinanceOverviewComponent },
      { path: 'finance-report', component: FinanceReportComponent },
      { path: 'finance-management', component: FinanceManagementComponent },

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
    ]
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
