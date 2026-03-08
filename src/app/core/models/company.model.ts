export interface Company {
  _id: string;
  companyName: string;
  companyLocation: string;
  companyDescription: string;
  companyLogo: string;
  companyFoundedDate: Date;
  companySize: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  totalEmployees: number;
  createdAt: Date;
  updatedAt: Date;
}
