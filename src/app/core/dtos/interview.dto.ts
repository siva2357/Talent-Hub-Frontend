export interface CreateInterviewDTO {
  jobSeekerId: string;
  jobPostId: string;
  interviewTitle: string;
  interviewDescription?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  meetingJoinUrl: string;
}

export interface UpdateInterviewDTO {
  interviewTitle?: string;
  interviewDescription?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  meetingJoinUrl?: string;
  status?: 'Scheduled' | 'Completed' | 'Not Completed';
}
