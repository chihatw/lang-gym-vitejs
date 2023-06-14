export interface IUpdatePasswordForm {
  isLoading: boolean;
  email: string;
  password: string;
  newPassword: string;
  emailErrMsg: string;
  passwordErrMsg: string;
  newPasswordErrMsg: string;
  message: string;
}
