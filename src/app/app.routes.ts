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
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';

import { UserProfileComponent } from './shared/pages/user-profile/user-profile.component';
import { AccountSettingsComponent } from './shared/pages/account-settings/account-settings.component';
import { ContactSupportComponent } from './shared/pages/contact-support/contact-support.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

// Freelancer Pages
import { FreelancerDashboardComponent } from './features/user/freelancer/pages/freelancer-dashboard/freelancer-dashboard.component';
import { ProposalsComponent } from './features/user/freelancer/pages/proposals/proposals.component';
import { ActiveContractsComponent } from './features/user/freelancer/pages/active-contracts/active-contracts.component';
import { ContractDiaryComponent } from './features/user/freelancer/pages/contract-diary/contract-diary.component';
import { PortfolioComponent } from './features/user/freelancer/pages/portfolio/portfolio.component';
import { FinanceOverviewComponent } from './features/user/freelancer/pages/finance-overview/finance-overview.component';


// Error/Utility Components
import { AccessDeniedComponent } from './shared/pages/access-denied/access-denied.component';
import { FindContractsComponent } from './features/user/freelancer/pages/find-contracts/find-contracts.component';
import { ContractDetailsComponent } from './features/user/freelancer/pages/contract-details/contract-details.component';
import { LegalContractComponent } from './features/user/freelancer/pages/legal-contract/legal-contract.component';

// Client Pages
import { ClientDashboardComponent } from './features/user/client/pages/client-dashboard/client-dashboard.component';
import { YourContractsComponent } from './features/user/client/pages/your-contracts/your-contracts.component';
import { ContractProposalsComponent } from './features/user/client/pages/contract-proposals/contract-proposals.component';
import { ContractProgressComponent } from './features/user/client/pages/contract-progress/contract-progress.component';
import { SearchTalentComponent } from './features/user/client/pages/search-talent/search-talent.component';
import { TalentProfileComponent } from './features/user/client/pages/talent-profile/talent-profile.component';
import { SavedTalentComponent } from './features/user/client/pages/saved-talent/saved-talent.component';
import { HiredTalentComponent } from './features/user/client/pages/hired-talent/hired-talent.component';
import { FinancialSummaryComponent } from './features/user/client/pages/financial-summary/financial-summary.component';
import { PaymentGatewayComponent } from './features/user/client/pages/payment-gateway/payment-gateway.component';
import { TransactionHistoryComponent } from './features/user/client/pages/transaction-history/transaction-history.component';

import { ContractFormComponent } from './features/user/client/pages/contract-form/contract-form.component';
import { ContractViewDetailsComponent } from './features/user/client/pages/contract-view-details/contract-view-details.component';
import { ProjectDetailsComponent } from './features/user/client/pages/project-details/project-details.component';
import { ContractProfileComponent } from './features/user/client/pages/contract-profile/contract-profile.component';
import { LegalFormComponent } from './features/user/client/pages/legal-form/legal-form.component';


import { AdminDashboardComponent } from './features/user/admin/pages/admin-dashboard/admin-dashboard.component';
import { ClientListComponent } from './features/user/admin/pages/client-list/client-list.component';
import { FreelancerListComponent } from './features/user/admin/pages/freelancer-list/freelancer-list.component';
import { AdminFinancialSummaryComponent } from './features/user/admin/pages/financial-summary/financial-summary.component';
import { AdminReportsComponent } from './features/user/admin/pages/reports/reports.component';
import { SupportRequestsComponent } from './features/user/admin/pages/support-requests/support-requests.component';
import { BlogPostComponent } from './features/user/admin/pages/blog-post/blog-post.component';

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
      { path: 'blog-details/:id', component: BlogDetailsComponent },

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
      { path: 'search-talent', component: SearchTalentComponent },
      { path: 'talent-profile/:id', component: TalentProfileComponent },
      { path: 'project-details/:id', component: ProjectDetailsComponent },
      { path: 'contract-profile/:id', component: ContractProfileComponent },
      { path: 'saved-talent', component: SavedTalentComponent },
      { path: 'hired-talent', component: HiredTalentComponent },
      { path: 'financial-summary', component: FinancialSummaryComponent },
      { path: 'transaction-history', component: TransactionHistoryComponent },




      // Freelancer Page
      { path: 'my-dashboard', component: FreelancerDashboardComponent },
      { path: 'find-contracts', component: FindContractsComponent },
      { path: 'contract-details', component: ContractDetailsComponent },
      { path: 'proposals', component: ProposalsComponent },
      { path: 'contracts', component: ActiveContractsComponent },
      { path: 'contract-diary', component: ContractDiaryComponent },
      { path: 'finance-overview', component: FinanceOverviewComponent },

      { path: 'portfolio', component: PortfolioComponent }
    ]
  },

  // Admin Layout Routes (With Admin Sidebar)
  {
    path: 'user/admin', component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'clients', component: ClientListComponent },
      { path: 'freelancers', component: FreelancerListComponent },
      { path: 'finances', component: AdminFinancialSummaryComponent },
      { path: 'reports', component: AdminReportsComponent },
      { path: 'support', component: SupportRequestsComponent },
      { path: 'blog', component: BlogPostComponent }
    ]
  },

  // Independent User Utility Routes (Without User Navbar)
  {
    path: 'user',
    children: [
      { path: 'profile', component: UserProfileComponent },
      { path: 'settings', component: AccountSettingsComponent },
      { path: 'contact-support', component: ContactSupportComponent },
      { path: 'legal-contract/:id', component: LegalContractComponent },
      { path: 'legal-form/:contractId', component: LegalFormComponent },
      { path: 'payment-gateway', component: PaymentGatewayComponent },
      { path: 'payment_gateway', component: PaymentGatewayComponent },
    ]
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
