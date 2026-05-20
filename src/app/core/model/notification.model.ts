export interface AppNotification {
  _id: string;
  userId: string;
  role: 'admin' | 'client' | 'freelancer';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
