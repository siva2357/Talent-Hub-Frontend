import { Routes } from '@angular/router';

import { Signup } from './signup/signup';
import { Register } from './register/register';
import { OtpVerification } from './otp-verification/otp-verification';
import { AccountVerification } from './account-verification/account-verification';
import { Login } from './login/login';
import { ProfileForm } from './profile-form/profile-form';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';

export const ACCOUNT_ROUTES: Routes = [
  { path: 'signup', component: Signup },
  { path: 'register', component: Register },
  { path: 'otp-verification', component: OtpVerification },
  { path: 'account-verification', component: AccountVerification },
  { path: 'login', component: Login },
  { path: 'profile-form', component: ProfileForm },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword }
];
