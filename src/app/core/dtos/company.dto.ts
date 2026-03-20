export interface CreateCompanyDTO {
  companyName: string;
  companyLocation: string;
  companyDescription: string;
  companyLogo: string;
  companyFoundedDate: Date;
  companySize: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  totalEmployees: number;

  email: string;
  phone: string;
  industry: string;
}


export interface UpdateCompanyDTO {
  companyName?: string;
  companyLocation?: string;
  companyDescription?: string;
  companyLogo?: string;
  companyFoundedDate?: Date;
  companySize?: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  totalEmployees?: number;

  email: string;
  phone: string;
  industry: string;
}
