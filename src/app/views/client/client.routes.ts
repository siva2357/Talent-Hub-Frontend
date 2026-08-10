import { Routes } from '@angular/router';

import { Dashboard } from '../shared/dashboard/dashboard';
import { ManageContract } from './manage-contract/manage-contract';
import { Applicants } from './applicants/applicants';
import { ContractProgress } from './contract-progress/contract-progress';
import { SearchTalent } from './search-talent/search-talent';
import { FinancialSummary } from './financial-summary/financial-summary';

import { Profile } from '../shared/profile/profile';
import { AccountSettings } from '../shared/account-settings/account-settings';
import { ContactSupport } from '../shared/contact-support/contact-support';

export const CLIENT_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'manage-contract', component: ManageContract },
  { path: 'applicants', component: Applicants },
  { path: 'contract-progress', component: ContractProgress },
  { path: 'search-talent', component: SearchTalent },
  { path: 'financial-summary', component: FinancialSummary },
  { path: 'profile', component: Profile },
  { path: 'account-settings', component: AccountSettings },
  { path: 'contact-support', component: ContactSupport }
];
