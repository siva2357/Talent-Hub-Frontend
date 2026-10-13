export interface SupportTicketData {
  _id: string;
  ticketId: string;
  userId: string;
  userType: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  attachments: {
    name: string;
    url: string;
    _id: string;
  }[];
  status: string;
  replies: {
    sender: string;
    message: string;
    _id: string;
    attachments: unknown[];
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
