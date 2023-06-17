import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { User } from 'firebase/auth';

const authUserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setUser: (
      state,
      { payload }: { payload: { loginUser: User; currentUid: string } }
    ) => {
      state.initializing = false;
      state.currentUid = payload.currentUid;
      state.loginUser = payload.loginUser;
    },
    setCurrentUid: (state, { payload }: { payload: string }) => {
      state.currentUid = payload;
    },
    removeUser: (state) => {
      state.initializing = false;
      state.currentUid = '';
      state.loginUser.uid = '';
    },
    setLoginUser: (state, { payload }: { payload: User }) => {
      state.currentUid = payload.uid;
      state.loginUser = payload;
    },
    signoutSuccess: (state) => {
      state.currentUid = '';
      state.loginUser.uid = '';
    },
    signoutInitiate: (state) => state,
  },
});

export const authUserActions = authUserSlice.actions;

export default authUserSlice.reducer;
