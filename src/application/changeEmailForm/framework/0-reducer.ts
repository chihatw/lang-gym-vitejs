import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const changeEmailFormSlice = createSlice({
  name: 'changeEmailForm',
  initialState,
  reducers: {
    changeEmail: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: payload,
      password: state.password,
      newEmail: state.newEmail,
    }),
    changePassword: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: state.email,
      password: payload,
      newEmail: state.newEmail,
    }),
    changeNewEmail: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: state.email,
      password: state.password,
      newEmail: payload,
    }),
    updateEmailStart: (state) => {
      state.isLoading = true;
    },
    updateEmailSuccess: (state, { payload }: { payload: string }) => {
      state.isLoading = false;
      state.email = payload;
      state.password = '';
      state.newEmail = '';
      state.message = `メールアドレスを「${payload}」に変更しました`;
    },
    updateEmailFail: (
      state,
      {
        payload,
      }: {
        payload: {
          emailErrMsg: string;
          passwordErrMsg: string;
          newEmailErrMsg: string;
        };
      }
    ) => {
      state.isLoading = false;
      state.emailErrMsg = payload.emailErrMsg;
      state.passwordErrMsg = payload.passwordErrMsg;
      state.newEmailErrMsg = payload.newEmailErrMsg;
    },
    resetError: (state) => {
      state.message = '';
      state.emailErrMsg = '';
      state.passwordErrMsg = '';
      state.newEmailErrMsg = '';
    },
  },
});

export const changeEmailFormActions = changeEmailFormSlice.actions;

export default changeEmailFormSlice.reducer;
