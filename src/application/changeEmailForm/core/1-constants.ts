import { IChangeEmailForm } from './0-interface';

export const initialState: IChangeEmailForm = {
  isLoading: false,
  message: '',
  emailErrMsg: '',
  passwordErrMsg: '',
  newEmailErrMsg: '',
  email: '',
  password: '',
  newEmail: '',
};
