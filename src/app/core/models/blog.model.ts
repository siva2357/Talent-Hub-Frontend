export interface Blog {
  _id: string;
  blogTitle: string;
  category: string;
  tags: string[];
  blogDescription: string;
  blogMedia: string;
  isPublished: boolean;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}
