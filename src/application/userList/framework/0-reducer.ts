import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    // currentUid を payload で指定
    initiate: (state, { payload }: { payload: string }) => {
      state.initializing = false;
    },
    setSelectedUid: (state, { payload }: { payload: string }) => {
      state.selectedUid = payload;
    },
  },
});

export const userListActions = userListSlice.actions;

export default userListSlice.reducer;
