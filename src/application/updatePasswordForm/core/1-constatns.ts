import { IUpdatePasswordForm } from './0-interface';

export const initialState: IUpdatePasswordForm = {
  isLoading: false,
  message: '',
  emailErrMsg: '',
  passwordErrMsg: '',
  newPasswordErrMsg: '',
  email: '',
  password: '',
  newPassword: '',
};
