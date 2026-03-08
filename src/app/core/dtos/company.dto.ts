export interface CreateCompanyDTO {
  companyName: string;
  companyLocation: string;
  companyDescription: string;
  companyLogo: string;
  companyFoundedDate: Date;
  companySize: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  totalEmployees: number;
}


export interface UpdateCompanyDTO {
  companyName?: string;
  companyLocation?: string;
  companyDescription?: string;
  companyLogo?: string;
  companyFoundedDate?: Date;
  companySize?: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  totalEmployees?: number;
}
