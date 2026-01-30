export interface SignupRequestDto {
  registrationDetails: {
    fullName: string;
    email: string;
    password: string;
  };
}
