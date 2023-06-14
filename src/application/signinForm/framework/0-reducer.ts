import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const signinFormSlice = createSlice({
  name: 'signinForm',
  initialState,
  reducers: {
    changeEmail: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: payload,
      password: state.password,
    }),
    changePassword: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: state.email,
      password: payload,
    }),
    signInStart: (state) => {
      state.isLoading = true;
    },
    signInSuccess: (state) => {
      state.isLoading = false;
      state.email = '';
      state.password = '';
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

export const signInFormActions = signinFormSlice.actions;

export default signinFormSlice.reducer;
