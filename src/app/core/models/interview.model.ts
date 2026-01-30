export interface Interview {
  _id: string;
  recruiterId: string;
  recruiterName: string;
  jobSeekerId: string;
  jobSeekerName: string;
  jobPostId: string;
  jobId: string;
  jobTitle: string;
  interviewTitle: string;
  interviewDescription?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  meetingJoinUrl: string;
  status: 'Scheduled' | 'Completed' | 'Not Completed';
  createdAt: string;
}


export interface MeetingsResponse {
  totalMeetings: number;
  meetings: Interview[];
}

export interface JobSeekerInterview extends Interview {
  companyName: string;
  companyLogo?: string | null;
}
