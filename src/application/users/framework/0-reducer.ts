import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../core/0-interface';
import { RootState } from 'main';

const userAdapter = createEntityAdapter<IUser>({
  selectId: (user) => user.uid,
});

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
