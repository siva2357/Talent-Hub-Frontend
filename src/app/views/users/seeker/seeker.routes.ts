import { Routes } from '@angular/router';
import { Jobposts } from './jobposts/jobposts';
import { ScheduledMeetings } from './scheduled-meetings/scheduled-meetings';
import { ChatPage } from './chat-page/chat-page';
import { UserProfile } from './user-profile/user-profile';
import { Seeker } from './seeker';
import { Portfolio } from './portfolio/portfolio';
import { UserAccountSettings } from './user-account-settings/user-account-settings';
import { ProjectForm } from './project-form/project-form';
import { EditProjectForm } from './edit-project-form/edit-project-form';
import { JobDetailsPage } from './job-details-page/job-details-page';
import { ProjectDetailsPage } from './project-details-page/project-details-page';
import { CompanyDetailsPage } from './company-details-page/company-details-page';
import { AnalyticsPerformancePage } from './analytics-performance-page/analytics-performance-page';
import { InterviewPrepPage } from './interview-prep-page/interview-prep-page';
import { AiMockInterviewPage } from './ai-mock-interview-page/ai-mock-interview-page';
import { MockInterviewSessionPage } from './mock-interview-session-page/mock-interview-session-page';
import { PracticeTopicPage } from './practice-topic-page/practice-topic-page';
import { PracticeRoomPage } from './practice-room-page/practice-room-page';
import { LiveAssessmentPage } from './live-assessment-page/live-assessment-page';
import { AssessmentsRoomPage } from './assessments-room-page/assessments-room-page';
import { InterviewMeetingPage } from '../../shared/interview-meeting-page/interview-meeting-page';
import { InterviewSessionPage } from '../../shared/interview-session-page/interview-session-page';
import { ResumeAnalyzer } from './resume-analyzer/resume-analyzer';
import { ResumeAnalyzerReport } from './resume-analyzer-report/resume-analyzer-report';
import { ResumeBuilder } from './resume-builder/resume-builder';
import { ResumeMaking } from './resume-making/resume-making';

export const SEEKER_ROUTES: Routes = [
  {
    path: '',
    component: Seeker,
    children: [
      { path: 'jobposts', component: Jobposts },
      { path: 'jobposts/:id/job-details', component: JobDetailsPage },
      { path: 'company/:id/company-details', component: CompanyDetailsPage },

      { path: 'assessments', component: AssessmentsRoomPage },
      { path: 'assessments/live-test', component: LiveAssessmentPage },
      { path: 'scheduled-meetings', component: ScheduledMeetings },

      { path: 'my-portfolio', component: Portfolio },
      { path: 'post-project', component: ProjectForm },
      { path: 'project/:id/edit-project', component: EditProjectForm },
      { path: 'project/:id/project-details', component:ProjectDetailsPage },
      { path: 'analytics-performance', component:  AnalyticsPerformancePage  },
      { path: 'resume-builder', component:  ResumeBuilder  },
      { path: 'resume-making', component:  ResumeMaking  },
      { path: 'analytics-performance/resume-analyzer', component:  ResumeAnalyzer  },
      { path: 'analytics-performance/resume-analyzer-report', component: ResumeAnalyzerReport  },
      { path: 'interview-prep', component:  InterviewPrepPage  },
      { path: 'ai-mock', component: AiMockInterviewPage },
      { path: 'ai-mock/live-session', component: MockInterviewSessionPage },
      { path: 'practice-room', component: PracticeRoomPage },
      { path: 'practice-room/:topicName', component: PracticeTopicPage },
      { path: '', redirectTo: 'jobposts', pathMatch: 'full' }
    ],
  },
  { path: 'chat-page', component: ChatPage },
  { path: 'profile', component: UserProfile },
  { path: 'account-settings', component: UserAccountSettings },
];
