/* ===============================
   INTERVIEW REPORT INTERFACES
================================ */

export interface InterviewReport {
  _id: string;
  interviewId: string;
  meetingId: string;
  sessionId: string;
  recruiterId: string;
  recruiterName: string;
  jobSeekerId: string;
  jobSeekerName: string;
  jobPostId: string;
  jobId: string;
  jobTitle: string;
  interviewVideoUrl: string;
  rating: number;
  remarks?: string;
  decision?: 'Hire' | 'Hold' | 'Reject';
  createdAt: string;
  updatedAt: string;
}

/* ===============================
   SUBMIT REPORT PAYLOAD
================================ */

export interface SubmitInterviewReportPayload {
  interviewId: string;
  meetingId: string;

  interviewVideoUrl: string;
  rating: number;
  remarks?: string;
  decision?: 'Hire' | 'Hold' | 'Reject';
}

/* ===============================
   API RESPONSES
================================ */

export interface SubmitInterviewReportResponse {
  message: string;
  report: InterviewReport;
}

export interface RecruiterInterviewReportsResponse {
  total: number;
  reports: InterviewReport[];
}
