import { ISigninForm } from './0-interface';

export const initialState: ISigninForm = {
  isLoading: false,
  email: '',
  password: '',
  emailErrMsg: '',
  passwordErrMsg: '',
};
