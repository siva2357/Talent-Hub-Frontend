import { Routes } from '@angular/router';

import { InterviewLoginPage } from '../interview-login-page/interview-login-page';
import { InterviewMainPage } from './interview-main-page';
import { InterviewAnalyticsPerformancePage } from './interview-analytics-performance-page/interview-analytics-performance-page';
import { AiMockInterviewPage } from './ai-mock-interview-page/ai-mock-interview-page';
import { AssessmentsRoomPage } from './assessments-room-page/assessments-room-page';
import { PracticeRoomPage } from './practice-room-page/practice-room-page';
import { ScheduledInterviewsPage } from './scheduled-interviews-page/scheduled-interviews-page';
import { UpcomingInterviewsPage } from './upcoming-interviews-page/upcoming-interviews-page';
import { InterviewLandingPage } from './interview-landing-page/interview-landing-page';
import { PracticeTopicPage } from './practice-topic-page/practice-topic-page';

export const INTERVIEW_PLATFORM_ROUTES: Routes = [


  /** MAIN DASHBOARD + CHILDREN */
  {
    path: '',
    component: InterviewMainPage,
    children: [
      { path: 'main', component: InterviewLandingPage },
      { path: 'analytics-performance', component: InterviewAnalyticsPerformancePage },
      { path: 'ai-mock', component: AiMockInterviewPage },
      { path: 'assessments', component: AssessmentsRoomPage },
      { path: 'practice-room', component: PracticeRoomPage },
      { path: 'practice-room/:topicName', component: PracticeTopicPage },

      /** INTERVIEW FLOWS */
      { path: 'scheduled-interviews', component: ScheduledInterviewsPage },
      { path: 'upcoming-interviews', component: UpcomingInterviewsPage },

      { path: '', redirectTo: 'main', pathMatch: 'full' }
    ],
  }
];
