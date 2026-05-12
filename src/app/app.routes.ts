import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/layouts/public-layout';
import { HomeComponent } from './features/public/home/home.component';
import { HireTalentComponent } from './features/public/hire-talent/hire-talent';
import { FindWorkComponent } from './features/public/find-work/find-work';
import { WhyTalenthubComponent } from './features/public/why-talenthub/why-talenthub';
import { ServicesComponent } from './features/public/services/services';
import { AboutUsComponent } from './features/public/about-us/about-us';
import { BlogComponent } from './features/public/blog/blog';

// Account Components
import { SigninComponent } from './features/account/signin/signin';
import { SignupComponent } from './features/account/signup/signup';
import { ForgotPasswordComponent } from './features/account/forgot-password/forgot-password';
import { OtpVerificationComponent } from './features/account/otp-verification/otp-verification';
import { ConfirmationComponent } from './features/account/confirmation/confirmation';
import { ResetPasswordComponent } from './features/account/reset-password/reset-password';

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
