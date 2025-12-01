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

export const routes: Routes = [
  { path: 'home', component: LandingPage, title: 'Landing page' },
  { path: 'talent-marketplace', component: TalentMarketplacePage, title: 'Skills page' },
  { path: 'find-work', component: FindWorkPage, title: 'Skills page' },
  { path: 'recruitment-process', component: RecruitmentPage, title: 'Hire page' },
  { path: 'interview-process', component: InterviewPage, title: 'Hire page' },
  { path: 'resume-builder', component: ResumeBuilderPage, title: 'Hire page' },
  { path: 'about', component: AboutPage, title: 'Hire page' },
  { path: 'blog', component: BlogPage, title: 'Hire page' },

  { path: 'sign-up', component: SingupPage, title: 'Skills page' },
  { path: 'login', component: LoginPage, title: 'Skills page' },
  { path: 'sign-up/recruiter', component: RegisterRecruiterPage, title: 'Skills page' },
  { path: 'sign-up/seeker', component: RegisterSeekerPage, title: 'Skills page' },
  { path: 'sign-up/otp-verification', component: OtpVerificationPage, title: 'Skills page' },
  { path: 'confirmation-page', component: ConfirmationPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'reset-otp-verification', component: ResetOtpVerificationPage },
  { path: 'reset-password', component: ResetPasswordPage },

  { path: '**', redirectTo: 'home' },
];
