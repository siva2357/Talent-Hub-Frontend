import { Routes } from '@angular/router';

import { Dashboard } from '../shared/dashboard/dashboard';
import { FindContracts } from './find-contracts/find-contracts';
import { ContractDetails } from './contract-details/contract-details';
import { ProposalOffers } from './proposal-offers/proposal-offers';
import { MyContracts } from './my-contracts/my-contracts';
import { ContractDiary } from './contract-diary/contract-diary';
import { FinanceOverview } from './finance-overview/finance-overview';
import { Portfolio } from './portfolio/portfolio';

import { Profile } from '../shared/profile/profile';
import { AccountSettings } from '../shared/account-settings/account-settings';
import { ContactSupport } from '../shared/contact-support/contact-support';

export const FREELANCER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'find-contracts', component: FindContracts },
  { path: 'contract-details', component: ContractDetails },
  { path: 'proposal-offers', component: ProposalOffers },
  { path: 'my-contracts', component: MyContracts },
  { path: 'contract-diary', component: ContractDiary },
  { path: 'finance-overview', component: FinanceOverview },
  { path: 'portfolio', component: Portfolio },
  { path: 'profile', component: Profile },
  { path: 'account-settings', component: AccountSettings },
  { path: 'contact-support', component: ContactSupport }
];
