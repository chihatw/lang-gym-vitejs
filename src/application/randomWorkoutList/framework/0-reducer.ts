import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const randomWorkoutListSlice = createSlice({
  name: 'randomWorkoutList',
  initialState,
  reducers: {
    initiate: (state) => {
      state.initializing = false;
    },
    setWorkoutIds: (state, { payload }: { payload: string[] }) => {
      state.workoutIds = payload;
    },
    resetState: () => initialState,
  },
});

export const randomWorkoutListActions = randomWorkoutListSlice.actions;

export default randomWorkoutListSlice.reducer;
