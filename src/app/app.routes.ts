import { Routes } from '@angular/router';
import { LandingPage } from './views/pages/public/landing-page/landing-page';
import { TalentMarketplacePage } from './views/pages/public/talent-marketplace-page/talent-marketplace-page';
import { FindWorkPage } from './views/pages/public/find-work-page/find-work-page';
import { RecruitmentPage } from './views/pages/public/recruitment-page/recruitment-page';
import { ResumeBuilderPage } from './views/pages/public/resume-builder-page/resume-builder-page';
import { AboutPage } from './views/pages/public/about-page/about-page';
import { SingupPage } from './views/account/singup-page/singup-page';
import { LoginPage } from './views/account/login-page/login-page';
import { OtpVerificationPage } from './views/account/otp-verification-page/otp-verification-page';
import { ConfirmationPage } from './views/account/confirmation-page/confirmation-page';
import { ForgotPasswordPage } from './views/account/forgot-password-page/forgot-password-page';
import { ResetOtpVerificationPage } from './views/account/reset-otp-verification-page/reset-otp-verification-page';
import { ResetPasswordPage } from './views/account/reset-password-page/reset-password-page';
import { ErrorPage } from './views/extra-pages/error-page/error-page';
import { ComingSoonPage } from './views/extra-pages/coming-soon-page/coming-soon-page';
import { MaintenancePage } from './views/extra-pages/maintenance-page/maintenance-page';
import { UnauthorizedPage } from './views/extra-pages/unauthorized-page/unauthorized-page';
import { RoleGuard } from './core/guards/role.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RegistrationPage } from './views/account/registration-page/registration-page';
import { BlogPage } from './views/pages/public/blog-page/blog-page';
import { USER_ROUTES } from './views/pages/user-pages/user-pages.routes';
import { ProfileForm } from './views/account/profile-form/profile-form';


export const routes: Routes = [
  //public
  { path: 'home', component: LandingPage, title: 'Landing' },
  { path: 'talent-marketplace', component: TalentMarketplacePage, title: 'Talent marketplace' },
  { path: 'find-work', component: FindWorkPage, title: 'Find work' },
  { path: 'recruitment-process', component: RecruitmentPage, title: 'Recruitment' },
  { path: 'resume-analyzer', component: ResumeBuilderPage, title: 'Resume builder' },
  { path: 'about', component: AboutPage, title: 'About' },
  { path: 'blog', component: BlogPage, title: 'About' },

  //auth pages
  { path: 'signup', component: SingupPage, title: 'Singup' },
  { path: 'register', component: RegistrationPage, title: 'Register recruiter' },
  { path: 'register/otp-verification', component: OtpVerificationPage, title: 'OTP Verification' },
  { path: 'confirmation-page', component: ConfirmationPage, title: 'Confirmation' },
  { path: 'login', component: LoginPage, title: 'Login' },
  { path: 'profile-form', component: ProfileForm ,
    // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'recruiter' }
  },
  { path: 'forgot-password', component: ForgotPasswordPage, title: 'OTP Verification' },
  { path: 'reset-otp-verification', component: ResetOtpVerificationPage,title: 'OTP Verification'},
  { path: 'reset-password', component: ResetPasswordPage, title: 'Reset password' },

  //extra pages
  { path: 'coming-soon', component: ComingSoonPage, title: 'Coming soon' },
  { path: 'maintenance', component: MaintenancePage, title: 'Maintenance' },
  { path: 'error', component: ErrorPage, title: 'Error' },
  { path: 'access-denied', component: UnauthorizedPage, title: 'Access denied' },

    // default root
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: '', loadChildren: () => import('./views/pages/user-pages/user-pages.routes') .then(m => m.USER_ROUTES),
     // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'jobSeeker' }
  },

  { path: '**', redirectTo: 'home' },
];
