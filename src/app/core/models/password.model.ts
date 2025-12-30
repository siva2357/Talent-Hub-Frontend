export interface ChangePassword {
    oldPassword: string;          // Current password of the user
    newPassword: string;          // New password for the account
}

export interface ChangePasswordResponse {
    success: boolean;          // Email address
    message: string;       // Password for the account
}


export interface ForgotPasswordCode {
    email: string;// Email address
    providedCode: string;       // Password for the account
}


export interface ForgotPassword {
    email: string;// Email address
    newPassword:string;
}

