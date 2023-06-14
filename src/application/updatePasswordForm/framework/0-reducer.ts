import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constatns';

const updatePasswordFormSlice = createSlice({
  name: 'updatePasswordForm',
  initialState,
  reducers: {
    changeEmail: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: payload,
      password: state.password,
      newPassword: state.newPassword,
    }),
    changePassword: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: state.email,
      password: payload,
      newPassword: state.newPassword,
    }),
    changeNewPassword: (state, { payload }: { payload: string }) => ({
      ...initialState,
      email: state.email,
      password: state.password,
      newPassword: payload,
    }),
    updatePasswordStart: (state) => {
      state.isLoading = true;
    },
    updatePasswordSuccess: (state) => {
      state.isLoading = false;
      state.email = '';
      state.password = '';
      state.newPassword = '';
      state.message = `パスワードを変更しました`;
    },
    updatePasswordFail: (
      state,
      {
        payload,
      }: {
        payload: {
          emailErrMsg: string;
          passwordErrMsg: string;
          newPasswordErrMsg: string;
        };
      }
    ) => {
      state.isLoading = false;
      state.emailErrMsg = payload.emailErrMsg;
      state.passwordErrMsg = payload.passwordErrMsg;
      state.newPasswordErrMsg = payload.newPasswordErrMsg;
    },
  },
});

export const updatePasswordFormActions = updatePasswordFormSlice.actions;

export default updatePasswordFormSlice.reducer;
