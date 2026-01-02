export interface Talent {
  userId: string;
  profilePhoto?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender: 'Male' | 'Female' | 'Other';
  skills: string[];
  status:string;
  saved?: boolean;
  location?: string;
   sector?: string;

}
