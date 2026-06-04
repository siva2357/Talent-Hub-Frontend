export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_OTP: '/auth/verify-reset-otp',
    RESET_PASSWORD: '/auth/reset-password',
    FORGOT_PASSWORD_CODE: '/forgot-password/auth/forgot-password-code',
    VERIFY_FORGOT_PASSWORD_CODE: '/forgot-password/auth/verify-forgotPassword-code',
    RESET_PASSWORD_WITH_CODE: '/forgot-password/auth/reset-password',
    CHANGE_PASSWORD: '/change-password/auth/change-password'
  },
  
  // Profile & Portfolio Endpoints
  PROFILE: {
    COMPLETE: '/profile/complete',
    ME: '/profile/me',
    UPDATE: '/profile/update',
    DELETE: '/profile/delete',
    SEND_PHONE_OTP: '/profile/phone/send-otp',
    VERIFY_PHONE_OTP: '/profile/phone/verify-otp',
    FREELANCERS: '/profile/freelancers',
    FREELANCER: (id: string) => `/profile/freelancer/${id}`,
    SAVE_TALENT: (id: string) => `/profile/save-talent/${id}`,
    UNSAVE_TALENT: (id: string) => `/profile/unsave-talent/${id}`,
    SAVED_TALENTS: '/profile/saved-talents',
    PORTFOLIO: '/profile/portfolio',
    PORTFOLIO_ITEM: (id: string) => `/profile/portfolio/${id}`
  },

  // Upload Endpoints
  UPLOADS: {
    UPLOAD: '/uploads/upload'
  },

  // Notification Endpoints
  NOTIFICATIONS: {
    GET_ALL: '/notifications/notifications',
    MARK_READ: (id: string) => `/notifications/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/notifications/read-all',
    DELETE: (id: string) => `/notifications/notifications/${id}/delete`,
    CLEAR: '/notifications/notifications/clear'
  },

  // Finance Endpoints
  FINANCE: {
    STATS: '/finance/stats',
    TRANSACTIONS: '/finance/transactions',
    INVOICES: '/finance/invoices',
    RAZORPAY_ORDER: '/finance/razorpay/order',
    RAZORPAY_VERIFY: '/finance/razorpay/verify',
    WITHDRAW: '/finance/withdraw'
  },

  // Dashboard Endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats'
  },

  // Contract Endpoints
  CONTRACTS: {
    BASE: '/contracts',
    MY_CONTRACTS: '/contracts/my-contracts',
    MY_CONTRACT: (id: string) => `/contracts/my-contracts/${id}`,
    ITEM: (id: string) => `/contracts/${id}`,
    SAVE: (id: string) => `/contracts/save/${id}`,
    UNSAVE: (id: string) => `/contracts/unsave/${id}`,
    SAVED: '/contracts/saved-contracts',
    APPLY: (id: string) => `/contracts/apply/${id}`,
    WITHDRAW: (id: string) => `/contracts/withdraw/${id}`,
    APPLIED: '/contracts/applied-contracts',
    APPLICANTS: '/contracts/my-contracts/applicants',
    HIRED: '/contracts/hired-talents'
  },

  // Contract Diary Endpoints
  CONTRACT_DIARY: {
    BASE: '/contract-diary',
    PHASES: (diaryId: string) => `/contract-diary/${diaryId}/phases`,
    REVIEW_PHASE: (diaryId: string, phaseId: string) => `/contract-diary/${diaryId}/phases/${phaseId}/review`,
    MY_DIARIES: '/contract-diary/my-diaries',
    MY_DIARY: '/contract-diary/my-diary',
    START_PHASE: (diaryId: string, phaseId: string) => `/contract-diary/${diaryId}/phases/${phaseId}/start`,
    SUBMIT_PHASE: (diaryId: string, phaseId: string) => `/contract-diary/${diaryId}/phases/${phaseId}/submit`,
    ITEM: (diaryId: string) => `/contract-diary/${diaryId}`
  },

  // Attendance & Timesheet Endpoints
  ATTENDANCE: {
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    STATUS: (contractId: string) => `/attendance/status/${contractId}`,
    OVERVIEW: (contractId: string) => `/attendance/overview/${contractId}`,
    TIMESHEETS_CLIENT: '/timesheets/client',
    TIMESHEET_APPROVE: (timesheetId: string) => `/timesheets/${timesheetId}/approve`
  },

  // Application Endpoints
  APPLICATIONS: {
    BASE: '/applications',
    SHORTLIST: (id: string) => `/applications/${id}/shortlist`,
    REJECT: (id: string) => `/applications/${id}/reject`,
    ASSESSMENT: (id: string) => `/applications/${id}/assessment`,
    ASSESSMENT_RESULT: (id: string) => `/applications/${id}/assessment-result`,
    INTERVIEW: (id: string) => `/applications/${id}/interview`,
    INTERVIEW_RESULT: (id: string) => `/applications/${id}/interview-result`,
    FINALIZE: (id: string) => `/applications/${id}/finalize`,
    SUBMIT_ASSESSMENT: (id: string) => `/applications/${id}/submit-assessment`,
    SEND_OFFER: (id: string) => `/applications/${id}/send-offer`,
    SIGN_OFFER: (id: string) => `/applications/${id}/sign-offer`,
    DECLINE_OFFER: (id: string) => `/applications/${id}/decline-offer`,
    MY_OFFERS: '/applications/my-offers',
    ITEM: (id: string) => `/applications/${id}`,
    CONTRACT_PDF: (id: string, token: string) => `/applications/${id}/contract-pdf?token=${token}`
  }
};
