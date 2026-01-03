export interface CompanyLogo {
  fileName: string;
  url: string;
}

export interface CompanyDetails {
  _id:string;
  companyId: string;
  companyLogo: CompanyLogo;
  companyName: string;
  companyAddress: string;
  industry: string;
  companyDescription: string;
  companyWebsiteUrl: string;
}

export interface Company {
  _id?: string;
  adminId?: string;
  companyDetails: CompanyDetails;
  createdAt?: string;
  updatedAt?: string;
}
