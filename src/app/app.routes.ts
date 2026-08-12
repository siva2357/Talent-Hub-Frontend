import { Routes } from '@angular/router';
import { PublicLayout } from './library/ui/layouts/public-layout/public-layout';
import { AccountPages } from './views/account-pages/account-pages';
import { Admin } from './views/admin/admin';
import { Client } from './views/client/client';
import { Freelancer } from './views/freelancer/freelancer';
import { UiComponents } from './ui-components/ui-components';

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
    path: '',
    component: AccountPages,
    loadChildren: () => import('./views/account-pages/account-pages.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: '',
    component: Admin,
    loadChildren: () => import('./views/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '',
    component: Client,
    loadChildren: () => import('./views/client/client.routes').then(m => m.CLIENT_ROUTES)
  },
  {
    path: '',
    component: Freelancer,
    loadChildren: () => import('./views/freelancer/freelancer.routes').then(m => m.FREELANCER_ROUTES)
  },
  { path: '**', redirectTo: '' }
];