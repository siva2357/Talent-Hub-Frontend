export interface Company {
  _id: string;
  companyName: string;
  companyLocation: string;
  industry: string;
  email:string;
  phone:string;
  companyDescription: string;
  companyLogo: string;
  companyFoundedDate: Date;
  companySize: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  totalEmployees: number;
  createdAt: Date;
  updatedAt: Date;
  status?:string;

}
