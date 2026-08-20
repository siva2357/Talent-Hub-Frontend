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
import { MeetPage } from '../shared/meet-page/meet-page';
import { ChatPage } from '../shared/chat-page/chat-page';

import { CreateContract } from './create-contract/create-contract';
import { LegalContractPage } from './legal-contract-page/legal-contract-page';
import { RecruitmentWorkflow } from './recruitment-workflow/recruitment-workflow';
import { CreatePhase } from './create-phase/create-phase';
import { PhaseDetails } from './phase-details/phase-details';
import { TransactionHistory } from './transaction-history/transaction-history';
import { CreateTicket } from '../shared/create-ticket/create-ticket';

export const CLIENT_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'manage-contract', component: ManageContract },
  { path: 'applicants/:id', component: Applicants },
  { path: 'contract-progress', component: ContractProgress },
  { path: 'search-talent', component: SearchTalent },
  { path: 'financial-summary', component: FinancialSummary },
  { path: 'profile', component: Profile },
  { path: 'account-settings', component: AccountSettings },
  { path: 'contact-support', component: ContactSupport },
  { path: 'create-ticket', component: CreateTicket },
  { path: 'create-contract', component: CreateContract },
  { path: 'legal-contract-page', component: LegalContractPage },
  { path: 'create-phase', component: CreatePhase },
  { path: 'phase-details', component: PhaseDetails },
  { path: 'transaction-history', component: TransactionHistory },
  { path: 'meet-page', component: MeetPage },
  { path: 'chat-page', component: ChatPage }
];
