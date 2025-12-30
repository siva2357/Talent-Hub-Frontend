export interface AppNotification {
  _id: string;
  userId: string;
  userType: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  time?:Date
}
