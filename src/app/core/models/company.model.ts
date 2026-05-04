import { CompanySize, CompanyStatus } from "../enums/company.enum";


export interface Company {
  _id: string;

  companyName: string;
  companyLocation: string;
  industry: string;

  email: string;
  phone: string;

  companyDescription: string;
  companyWebsite?: string;   // ✅ optional

  companyLogo: string;
  companyFoundedDate: Date;

  companySize: CompanySize;  // ✅ strict type
  totalEmployees: number;

  status: CompanyStatus;     // ✅ strict enum

  createdAt: Date;
  updatedAt: Date;
    // ✅ ADD THIS
  actions?: {
    canBlock: boolean;
    canUnblock: boolean;
    canClose: boolean;
    canReopen: boolean;
     canDelete: boolean;
  };
}
