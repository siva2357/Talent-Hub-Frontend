import { SupportAttachment } from "../model/support-request.model";

export interface CreateSupportTicketDto {
  ticketId?: string;
  category: string;
  subcategory?: string;
  description: string;
  attachments?: SupportAttachment[];
}

export interface SupportTicketReplyDto {
  message: string;
  attachments?: SupportAttachment[];
}

export interface UpdateTicketStatusDto {
  status:
    | 'Open'
    | 'WaitingForAdmin'
    | 'WaitingForUser'
    | 'Resolved'
    | 'Closed';
}