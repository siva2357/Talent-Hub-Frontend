export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  profilePhoto?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
}
