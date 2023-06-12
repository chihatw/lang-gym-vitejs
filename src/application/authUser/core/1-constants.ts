import { IAuthUser } from './0-interface';

export const initialState: IAuthUser = {
  initializing: true,
  currentUid: '',
  loginUser: null,
};

export const CURRENT_UID_LOCAL_STORAGE_KEY = 'currentUid@lang-gym';
