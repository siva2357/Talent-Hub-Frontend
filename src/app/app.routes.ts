import { Routes } from '@angular/router';
import { PublicLayout } from './library/ui/layouts/public-layout/public-layout';
import { AccountPages } from './views/account-pages/account-pages';
import { Admin } from './views/admin/admin';
import { Client } from './views/client/client';
import { Freelancer } from './views/freelancer/freelancer';
import { UiComponents } from './ui-components/ui-components';
import { Profile } from './views/shared/profile/profile';
import { AccountSettings } from './views/shared/account-settings/account-settings';
import { ContactSupport } from './views/shared/contact-support/contact-support';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    loadChildren: () => import('./library/ui/layouts/public-layout/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: 'ui-components',
    component: UiComponents
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['client', 'freelancer'] }
  },
  {
    path: 'account-settings',
    component: AccountSettings,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['client', 'freelancer'] }
  },
  {
    path: 'contact-support',
    component: ContactSupport,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['client', 'freelancer'] }
  },
  {
    path: '',
    component: AccountPages,
    loadChildren: () => import('./views/account-pages/account-pages.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: '',
    component: Admin,
    canMatch: [RoleGuard],
    canActivate: [AuthGuard],
    data: { expectedRoles: ['admin'] },
    loadChildren: () => import('./views/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '',
    component: Client,
    canMatch: [RoleGuard],
    canActivate: [AuthGuard],
    data: { expectedRoles: ['client'] },
    loadChildren: () => import('./views/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: '',
    component: Freelancer,
    canMatch: [RoleGuard],
    canActivate: [AuthGuard],
    data: { expectedRoles: ['freelancer'] },
    loadChildren: () => import('./views/freelancer/freelancer.routes').then(m => m.FREELANCER_ROUTES)
  },
  { path: '**', redirectTo: '' }
];