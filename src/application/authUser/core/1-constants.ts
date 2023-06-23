import { IAuthUser } from './0-interface';

export const initialState: IAuthUser = {
  initializing: true,
  currentUid: '',
  loginUser: { uid: '' },
};

export const CURRENT_UID_LOCAL_STORAGE_KEY = 'currentUid@lang-gym';

export const GUEST_UID = '6uzpa2xAxebOsrchccTgAkMdaKq1';
