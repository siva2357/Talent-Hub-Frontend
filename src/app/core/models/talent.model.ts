export interface Talent {
  userId: string;
  profilePhoto?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  gender:  string;
  bioDescription: string;
  skills:string[];
  status:string;
  saved?: boolean;
  location?: string;
   sector?: string;

}
