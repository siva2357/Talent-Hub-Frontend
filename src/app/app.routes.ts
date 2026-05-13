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
    ]
  },

  { path: '**', redirectTo: '' }
];
