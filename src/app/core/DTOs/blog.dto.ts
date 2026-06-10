export interface CreateBlogDto {
  title: string;
  category: string;
  description: string;
  mediaUrl?: string | null;
  status?: 'Published' | 'Draft';
}


export interface UpdateBlogDto {
  title?: string;
  category?: string;
  description?: string;
  mediaUrl?: string | null;
  status?: 'Published' | 'Draft';
}