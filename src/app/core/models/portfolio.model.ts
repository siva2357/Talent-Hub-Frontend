export interface ProjectDetails {
  files: PortfolioFile[];          // single OR multiple
  projectTitle: string;
  projectType: string;             // frontend controlled
  projectDescription: string;
  softwares: string[];
  tags: string[];
}

export interface PortfolioFile {
  fileName: string;
  url: string;
}


export interface Projects {
  _id: string;
  jobSeekerId: string;
  projectDetails: ProjectDetails;
  createdAt: string;
  updatedAt: string;
}


export interface CreatePortfolioPayload {
  projectDetails: ProjectDetails;
}

export interface UpdatePortfolioPayload {
  projectDetails: Partial<ProjectDetails>;
}

export interface PortfolioResponse {
  message: string;
  project: Projects;
}

export interface GetPortfoliosResponse {
  totalProjects: number;
  projects: Projects[];
}
