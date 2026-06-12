export interface Blog {
  _id: string;
  adminId: string;
  title: string;
  category: string;
  description: string;
  mediaUrl?: string | null;
  status: 'Published' | 'Draft';
  createdAt: string;
  updatedAt: string;
}