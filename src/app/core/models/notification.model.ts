export interface Notification {
  _id?: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt?: string;
}
