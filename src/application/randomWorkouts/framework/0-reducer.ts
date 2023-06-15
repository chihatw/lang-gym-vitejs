import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IRandomWorkout } from '../core/0-interface';

const randomWorkoutsSlice = createSlice({
  name: 'randomWorkouts',
  initialState,
  reducers: {
    mergeRandomWorkouts: (
      state,
      { payload }: { payload: { [id: string]: IRandomWorkout } }
    ) => ({ ...state, ...payload }),
    clearStoragePath: (state, { payload }: { payload: string }) => {
      const targetWorkouts = state[payload];
      return {
        ...state,
        [payload]: {
          ...targetWorkouts,
          storagePath: '',
          resultBpm: 0,
          resultSeconds: 0,
        },
      };
    },
  },
});

export const randomWorkoutsActions = randomWorkoutsSlice.actions;

export default randomWorkoutsSlice.reducer;
