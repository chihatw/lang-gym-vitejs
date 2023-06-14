import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const signinFormSlice = createSlice({
  name: 'signinForm',
  initialState,
  reducers: {
    signinInitiate: (
      state,
      { payload }: { payload: { email: string; password: string } }
    ) => {
      state.isLoading = true;
    },
    signInSuccess: (state) => {
      state.isLoading = false;
    },
    signInFail: (
      state,
      { payload }: { payload: { emailErrMsg: string; passwordErrMsg: string } }
    ) => {
      state.isLoading = false;
      state.emailErrMsg = payload.emailErrMsg;
      state.passwordErrMsg = payload.passwordErrMsg;
    },
    resetError: (state) => {
      state.emailErrMsg = '';
      state.passwordErrMsg = '';
    },
  },
});

export const signinFormActions = signinFormSlice.actions;

export default signinFormSlice.reducer;
