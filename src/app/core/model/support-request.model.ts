export interface SupportAttachment {
  name: string;
  url: string;
}

export interface SupportReply {
  sender: 'Admin' | 'User';
  message: string;

  attachments?: SupportAttachment[];

  timestamp: string;
}

export interface SupportRequest {
  _id?: string;
  id: string;              // API returns this
  ticketId: string;

  userType: 'Client' | 'Freelancer';

  userName: string;
  userEmail: string;

  subject: string;
  message: string;

  attachments: SupportAttachment[];

  status:
    | 'Open'
    | 'WaitingForAdmin'
    | 'WaitingForUser'
    | 'Resolved'
    | 'Closed';

  replies: SupportReply[];

  createdDate?: string;     // API returns this

  createdAt: string;
  updatedAt: string;
}


export interface SupportTicketResponse {
  success: boolean;
  ticket: SupportRequest;
}

export interface SupportTicketListResponse {
  success: boolean;
  tickets: SupportRequest[];
}

export interface GenericSupportResponse {
  success: boolean;
  message: string;
}


export interface UploadedFileEvent {
  url: string;
  fileName: string;
  fileSize: string;
  fileType: string;
}

export interface Subcategory {
  label: string;
  value: string;
}

export interface SupportCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
}
