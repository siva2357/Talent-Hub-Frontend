export interface CreateBlogDTO {
  blogTitle: string;
  category: string;
  tags: string[];
  blogDescription: string;
  blogMedia: string;
}

export interface UpdateBlogDTO {
  blogTitle?: string;
  category?: string;
  tags?: string[];
  blogDescription?: string;
  blogMedia?: string;
  isPublished?: boolean;
}
