import { environment } from '../../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${environment.apiGatewayUrl}/auth/login`,
    REGISTER: `${environment.apiGatewayUrl}/auth/register`,
    VERIFY_OTP: `${environment.apiGatewayUrl}/auth/verify-otp`,
    FORGOT_PASSWORD: `${environment.apiGatewayUrl}/auth/forgot-password`,
    RESET_PASSWORD: `${environment.apiGatewayUrl}/auth/reset-password`
  },
  PROFILE: {
    GET_MY_PROFILE: `${environment.apiGatewayUrl}/profile/my-profile`,
    CREATE_PROFILE: `${environment.apiGatewayUrl}/profile/create`,
    UPDATE_PROFILE: `${environment.apiGatewayUrl}/profile/update`
  },
  CONTRACTS: {
    GET_ALL: `${environment.apiGatewayUrl}/contracts`,
    GET_BY_ID: (id: string) => `${environment.apiGatewayUrl}/contracts/${id}`,
    CREATE: `${environment.apiGatewayUrl}/contracts/create`,
    UPDATE: (id: string) => `${environment.apiGatewayUrl}/contracts/${id}`,
    DELETE: (id: string) => `${environment.apiGatewayUrl}/contracts/${id}`
  },
  PAYMENTS: {
    CREATE: `${environment.apiGatewayUrl}/payments/create`,
    VERIFY: `${environment.apiGatewayUrl}/payments/verify`
  },
  NOTIFICATIONS: {
    GET_ALL: `${environment.apiGatewayUrl}/notifications/notifications`,
    MARK_READ: (id: string) => `${environment.apiGatewayUrl}/notifications/notifications/${id}/read`,
    MARK_ALL_READ: `${environment.apiGatewayUrl}/notifications/notifications/read-all`,
    CLEAR_ALL: `${environment.apiGatewayUrl}/notifications/notifications/clear`
  }
};
