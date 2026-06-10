import { PortfolioMedia } from "../model/portfolio.model";

export interface CreatePortfolioDto {
  title: string;
  description: string;
  role: string;
  projectType: string;
  tags: string[];
  media: PortfolioMedia[];
  projectUrl?: string;
}

export interface UpdatePortfolioDto {
  title?: string;
  description?: string;
  role?: string;
  projectType?: string;
  tags?: string[];
  media?: PortfolioMedia[];
  projectUrl?: string;
}