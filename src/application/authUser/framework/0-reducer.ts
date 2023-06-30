import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setUser: (
      state,
      { payload }: { payload: { loginUserUid: string; currentUid: string } }
    ) => {
      state.initializing = false;
      state.currentUid = payload.currentUid;
      state.loginUserUid = payload.loginUserUid;
    },
    setCurrentUid: (state, { payload }: { payload: string }) => {
      state.currentUid = payload;
    },
    removeUser: (state) => {
      state.initializing = false;
      state.currentUid = '';
      state.loginUserUid = '';
    },
    setLoginUser: (state, { payload }: { payload: string }) => {
      state.currentUid = payload;
      state.loginUserUid = payload;
    },
    signoutSuccess: (state) => {
      state.currentUid = '';
      state.loginUserUid = '';
    },
    signoutInitiate: (state) => state,
  },
});

export const authUserActions = authUserSlice.actions;

export default authUserSlice.reducer;
