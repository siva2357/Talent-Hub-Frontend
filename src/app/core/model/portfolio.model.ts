export interface PortfolioMedia {
  _id?: string;
  mediaType: 'image' | 'video';
  url: string;
}

export interface Portfolio {
  _id?: string;

  freelancerId?: string;

  title: string;
  description: string;

  role: string;
  projectType: string;

  tags: string[];

  media: PortfolioMedia[];

  projectUrl?: string;

  createdAt?: string;
  updatedAt?: string;
}