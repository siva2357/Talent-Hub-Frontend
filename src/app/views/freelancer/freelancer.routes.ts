import { Routes } from '@angular/router';

import { Dashboard } from '../shared/dashboard/dashboard';
import { FindContracts } from './find-contracts/find-contracts';
import { ContractDetails } from './contract-details/contract-details';
import { ProposalOffers } from './proposal-offers/proposal-offers';
import { MyContracts } from './my-contracts/my-contracts';
import { ContractDiary } from './contract-diary/contract-diary';
import { ContractPhaseDetails } from './contract-phase-details/contract-phase-details';
import { FinanceOverview } from './finance-overview/finance-overview';
import { Portfolio } from './portfolio/portfolio';

import { Profile } from '../shared/profile/profile';
import { AccountSettings } from '../shared/account-settings/account-settings';
import { ContactSupport } from '../shared/contact-support/contact-support';
import { MeetPage } from '../shared/meet-page/meet-page';
import { ChatPage } from '../shared/chat-page/chat-page';

import { CreatePortfolio } from './create-portfolio/create-portfolio';
import { FeedbackReports } from './feedback-reports/feedback-reports';
import { ViewContractOffer } from './view-contract-offer/view-contract-offer';
import { LegalContractAcceptance } from './legal-contract-acceptance/legal-contract-acceptance';
import { CreateTicket } from '../shared/create-ticket/create-ticket';

export const FREELANCER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'find-contracts', component: FindContracts },
  { path: 'contract-details/:id', component: ContractDetails },
  { path: 'proposal-offers', component: ProposalOffers },
  { path: 'my-contracts', component: MyContracts },
  { path: 'contract-diary/:id', component: ContractDiary },
  { path: 'contract-phase-details/:id', component: ContractPhaseDetails },
  { path: 'finance-overview', component: FinanceOverview },
  { path: 'portfolio', component: Portfolio },
  { path: 'profile', component: Profile },
  { path: 'account-settings', component: AccountSettings },
  { path: 'contact-support', component: ContactSupport },
  { path: 'create-ticket', component: CreateTicket },
  { path: 'create-portfolio', component: CreatePortfolio },
  { path: 'feedback-reports', component: FeedbackReports },
  { path: 'view-contract-offer/:id', component: ViewContractOffer },
  { path: 'legal-contract-acceptance/:id', component: LegalContractAcceptance },
  { path: 'meet-page', component: MeetPage },
  { path: 'chat-page', component: ChatPage }
];
