import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';
import { IUser } from '../core/0-interface';

const userAdapter = createEntityAdapter<IUser>();

const usersSlice = createSlice({
  name: 'user',
  initialState: userAdapter.getInitialState(),
  reducers: {
    setUsers: (state, { payload }: { payload: IUser[] }) => {
      userAdapter.setAll(state, payload);
    },
  },
});

export const usersAcions = usersSlice.actions;

export default usersSlice.reducer;

export const { selectAll: selectAllUsers } = userAdapter.getSelectors(
  (state: RootState) => state.users
);
