import { Routes } from '@angular/router';
import { PublicLayout } from './library/ui/layouts/public-layout/public-layout';
import { AccountPages } from './views/account-pages/account-pages';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    loadChildren: () => import('./library/ui/layouts/public-layout/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: '',
    component: AccountPages,
    loadChildren: () => import('./views/account-pages/account-pages.routes').then(m => m.ACCOUNT_ROUTES)
  },
  { path: '**', redirectTo: '' }
];