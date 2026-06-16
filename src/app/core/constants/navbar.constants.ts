import { UserRole } from '../enums/user-role.enum';

export const ROLE_LABELS = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.CLIENT]: 'Client',
  [UserRole.FREELANCER]: 'Freelancer',
};

export const DASHBOARD_ROUTES = {
  [UserRole.ADMIN]: '/user/admin/dashboard',
  [UserRole.CLIENT]: '/user/client-dashboard',
  [UserRole.FREELANCER]: '/user/my-dashboard',
};