export interface MeetCardData {
  _id: string;
  interview: {
    title: string;
    description: string;
    date: string;
    status: string;
    feedback: string;
  };
  contractTitle: string;
  otherUser: {
    name: string;
    email: string;
  };
  applicationStatus: string;
}
