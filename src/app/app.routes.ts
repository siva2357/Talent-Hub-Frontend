import { Routes } from '@angular/router';
import { LandingPage } from './views/pages/landing-page/landing-page';
import { TalentMarketplacePage } from './views/pages/talent-marketplace-page/talent-marketplace-page';
import { FindWorkPage } from './views/pages/find-work-page/find-work-page';
import { RecruitmentPage } from './views/pages/recruitment-page/recruitment-page';
import { InterviewPage } from './views/pages/interview-page/interview-page';
import { ResumeBuilderPage } from './views/pages/resume-builder-page/resume-builder-page';
import { BlogPage } from './views/pages/blog-page/blog-page';
import { AboutPage } from './views/pages/about-page/about-page';
import { SingupPage } from './views/account/singup-page/singup-page';
import { LoginPage } from './views/account/login-page/login-page';
import { RegisterRecruiterPage } from './views/account/register-recruiter-page/register-recruiter-page';
import { RegisterSeekerPage } from './views/account/register-seeker-page/register-seeker-page';
import { OtpVerificationPage } from './views/account/otp-verification-page/otp-verification-page';
import { ConfirmationPage } from './views/account/confirmation-page/confirmation-page';
import { ForgotPasswordPage } from './views/account/forgot-password-page/forgot-password-page';
import { ResetOtpVerificationPage } from './views/account/reset-otp-verification-page/reset-otp-verification-page';
import { ResetPasswordPage } from './views/account/reset-password-page/reset-password-page';
import { ErrorPage } from './views/extra-pages/error-page/error-page';
import { ComingSoonPage } from './views/extra-pages/coming-soon-page/coming-soon-page';
import { MaintenancePage } from './views/extra-pages/maintenance-page/maintenance-page';
import { UnauthorizedPage } from './views/extra-pages/unauthorized-page/unauthorized-page';
import { RECRUITER_ROUTES } from './views/users/recruiter/recruiter.routes';
import { SEEKER_ROUTES } from './views/users/seeker/seeker.routes';
import { ADMIN_ROUTES } from './views/users/admin/admin.routes';
import { SeekerProfileForm } from './views/account/seeker-profile-form/seeker-profile-form';
import { RecruiterProfileForm } from './views/account/recruiter-profile-form/recruiter-profile-form';
import { AccountRegisteredPage } from './views/account/account-registered-page/account-registered-page';
import { InterviewLoginPage } from './views/interview-platform/interview-login-page/interview-login-page';
import { INTERVIEW_PLATFORM_ROUTES } from './views/interview-platform/interview-main-page/interview-main.routes';

export const routes: Routes = [

  //public
  { path: 'home', component: LandingPage, title: 'Landing' },
  { path: 'talent-marketplace', component: TalentMarketplacePage, title: 'Talent marketplace' },
  { path: 'find-work', component: FindWorkPage, title: 'Find work' },
  { path: 'recruitment-process', component: RecruitmentPage, title: 'Recruitment' },

  { path: 'resume-builder', component: ResumeBuilderPage, title: 'Resume builder' },
  { path: 'about', component: AboutPage, title: 'About' },
  { path: 'blog', component: BlogPage, title: 'Blog' },

  //auth pages
  { path: 'sign-up', component: SingupPage, title: 'Singup' },
  { path: 'sign-up/recruiter', component: RegisterRecruiterPage, title: 'Register recruiter' },
  { path: 'sign-up/recruiter-profile-form', component: RecruiterProfileForm },
  { path: 'sign-up/seeker', component: RegisterSeekerPage, title: 'Register seeker' },
  { path: 'sign-up/seeker-profile-form', component: SeekerProfileForm },
  { path: 'account-registered', component: AccountRegisteredPage, title: 'Confirmation' },
  { path: 'sign-up/otp-verification', component: OtpVerificationPage, title: 'OTP Verification' },
  { path: 'confirmation-page', component: ConfirmationPage, title: 'Confirmation' },
  { path: 'login', component: LoginPage, title: 'Login' },
  { path: 'forgot-password', component: ForgotPasswordPage, title: 'OTP Verification' },
  { path: 'reset-otp-verification', component: ResetOtpVerificationPage,title: 'OTP Verification'},
  { path: 'reset-password', component: ResetPasswordPage, title: 'Reset password' },

  //extra pages
  { path: 'coming-soon', component: ComingSoonPage, title: 'Coming soon' },
  { path: 'maintenance', component: MaintenancePage, title: 'Maintenance' },
  { path: 'error', component: ErrorPage, title: 'Error' },
  { path: 'access-denied', component: UnauthorizedPage, title: 'Access denied' },



  {
  path: 'interview',
  component: InterviewPage,
  title: 'Interview Login'
},
{
  path: 'interview-platform/login',
  component: InterviewLoginPage,
  title: 'Interview Login'
},

{
  path: 'interview-platform',
  loadChildren: () => INTERVIEW_PLATFORM_ROUTES
},



  //User routes
  { path: 'admin', loadChildren: () => ADMIN_ROUTES },
  { path: 'recruiter', loadChildren: () => RECRUITER_ROUTES },
  { path: 'seeker', loadChildren: () => SEEKER_ROUTES },
  { path: '**', redirectTo: 'home' },
];
