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
      state.loginUser.uid = payload.loginUserUid;
    },
    setCurrentUid: (state, { payload }: { payload: string }) => {
      state.currentUid = payload;
    },
    removeUser: (state) => {
      state.initializing = false;
      state.currentUid = '';
      state.loginUser.uid = '';
    },
    setLoginUser: (state, { payload }: { payload: string }) => {
      state.currentUid = payload;
      state.loginUser.uid = payload;
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
