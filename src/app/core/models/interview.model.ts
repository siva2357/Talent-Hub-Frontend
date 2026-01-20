export interface Interview {
  _id: string;

  meetingId: string;
  sessionId: string;

  recruiterId: string;
  recruiterName: string;

  jobSeekerId: string;
  jobSeekerName: string;

  jobPostId: string;
  jobId: string;
  jobTitle: string;

  // ✅ ADD THESE (YOU MISSED THEM)
  interviewTitle: string;
  interviewDescription?: string;

  scheduledDate: Date;

  startTime: Date;
  endTime: Date;

  meetingJoinUrl: string;

  status: 'Scheduled' | 'Completed' | 'Not Completed';

  createdAt?: Date;
  updatedAt?: Date;
}




export class User {
  room: string = 'principalRoom';
  name: string = '';

  constructor(name: string = '', room: string = 'principalRoom') {
    this.name = name;
    this.room = room;
  }

  getRoom() {
    return this.room;
  }

  setRoom(roomName: string) {
    this.room = roomName;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }
}



export interface CreateInterviewPayload {
  jobSeekerId: string;
  jobPostId: string;

  interviewTitle: string;
  interviewDescription?: string;

  scheduledDate: string; // YYYY-MM-DD
  startTime: Date;
  endTime: Date;

  meetingJoinUrl: string; // ✅ REQUIRED
}
