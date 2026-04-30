import { CompanySize, CompanyStatus } from "../enums/company.enum";

export interface CreateCompanyDTO {
  companyName: string;
  companyLocation: string;
  companyDescription: string;
  companyLogo: string;
  companyWebsite: string;
  companyFoundedDate: string;
  companySize: CompanySize;
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
  companyWebsite?: string;
  companyFoundedDate?: string;
  companySize?: CompanySize;
  totalEmployees?: number;
  email?: string;
  phone?: string;
  industry?: string;
  status?: CompanyStatus;
}
