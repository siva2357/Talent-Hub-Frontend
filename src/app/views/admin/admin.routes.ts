import { Routes } from '@angular/router';

import { Dashboard } from '../shared/dashboard/dashboard';
import { ClientManagement } from './client-management/client-management';
import { FreelancerManagement } from './freelancer-management/freelancer-management';
import { FinancialSummary } from './financial-summary/financial-summary';
import { Reports } from './reports/reports';
import { SupportRequest } from './support-request/support-request';
import { BlogManager } from './blog-manager/blog-manager';
import { CreateBlog } from './create-blog/create-blog';
import { ViewReport } from './view-report/view-report';

import { MeetPage } from '../shared/meet-page/meet-page';
import { ChatPage } from '../shared/chat-page/chat-page';


export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'client-management', component: ClientManagement },
  { path: 'freelancer-management', component: FreelancerManagement },
  { path: 'financial-management', component: FinancialSummary },
  { path: 'reports', component: Reports },
  { path: 'support-request', component: SupportRequest },
  { path: 'blog-manager', component: BlogManager },
  { path: 'create-blog', component: CreateBlog },
  { path: 'view-report/:id', component: ViewReport },
  { path: 'meet-page', component: MeetPage },
  { path: 'chat-page', component: ChatPage }
];
