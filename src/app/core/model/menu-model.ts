import { UserRole } from '../enums/user-role.enum';

export interface NavSubItem {
  label: string;
  description: string;
  icon: string;
  route: string;
  queryParams?: Record<string, unknown>;
}

export interface NavMenuItem {
  label: string;
  roles: UserRole[];
  activePaths: string[];

  route?: string;
  subItems?: NavSubItem[];

  icon?: string;
}