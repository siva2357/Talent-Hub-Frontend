import { Routes } from '@angular/router';

import { Dashboard } from '../shared/dashboard/dashboard';
import { ClientManagement } from './client-management/client-management';
import { FreelancerManagement } from './freelancer-management/freelancer-management';
import { FinancialSummary } from './financial-summary/financial-summary';
import { Reports } from './reports/reports';
import { SupportRequest } from './support-request/support-request';
import { BlogManager } from './blog-manager/blog-manager';

export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'client-management', component: ClientManagement },
  { path: 'freelancer-management', component: FreelancerManagement },
  { path: 'financial-summary', component: FinancialSummary },
  { path: 'reports', component: Reports },
  { path: 'support-request', component: SupportRequest },
  { path: 'blog-manager', component: BlogManager }
];
