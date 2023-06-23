import { IUpdateEmailForm } from './0-interface';

export const initialState: IUpdateEmailForm = {
  isLoading: false,
  message: '',
  emailErrMsg: '',
  passwordErrMsg: '',
  newEmailErrMsg: '',
  email: '',
  password: '',
  newEmail: '',
};
