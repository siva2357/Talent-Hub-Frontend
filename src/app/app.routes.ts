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
import { FreelancerComponent } from './features/user/freelancer/freelancer.component';
import { UserProfileComponent } from './shared/pages/user-profile/user-profile.component';
import { AccountSettingsComponent } from './shared/pages/account-settings/account-settings.component';
import { ChatComponent } from './shared/pages/chat/chat.component';

// Error/Utility Components
import { AccessDeniedComponent } from './shared/pages/access-denied/access-denied.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';

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
      { path: 'freelancer', component: FreelancerComponent },
    ]
  },

  // Independent User Utility Routes (Without User Navbar)
  {
    path: 'user',
    children: [
      { path: 'profile', component: UserProfileComponent },
      { path: 'settings', component: AccountSettingsComponent },
      { path: 'chat', component: ChatComponent },
    ]
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];
