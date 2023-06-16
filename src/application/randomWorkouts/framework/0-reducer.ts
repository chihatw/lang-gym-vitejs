import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IRandomWorkout } from '../core/0-interface';

const randomWorkoutsSlice = createSlice({
  name: 'randomWorkouts',
  initialState,
  reducers: {
    mergeRandomWorkouts: (
      state,
      { payload }: { payload: { [id: string]: IRandomWorkout | null } }
    ) => ({ ...state, ...payload }),
    clearStoragePath: (state, { payload }: { payload: string }) => {
      const targetWorkout = state[payload]!;
      return {
        ...state,
        [payload]: {
          ...targetWorkout,
          storagePath: '',
          resultBpm: 0,
          resultSeconds: 0,
        },
      };
    },
    startRecording: (
      state,
      {
        payload: { workoutId, cueIds },
      }: { payload: { workoutId: string; cueIds: string[] } }
    ) => {
      const targetWorout = state[workoutId]!;
      return {
        ...state,
        [workoutId]: {
          ...targetWorout,
          cueIds,
          recordCount: targetWorout.recordCount + 1,
        },
      };
    },
    stopRecording: (
      state,
      {
        payload: { workoutId, bpm, seconds },
      }: { payload: { workoutId: string; bpm: number; seconds: number } }
    ) => {
      const targetWorkout = state[workoutId]!;
      return {
        ...state,
        [workoutId]: {
          ...targetWorkout,
          resultBpm: bpm,
          resultSeconds: seconds,
        },
      };
    },
    setStoragePath: (
      state,
      {
        payload: { workoutId, storagePath },
      }: { payload: { workoutId: string; storagePath: string } }
    ) => {
      const targetWorkout = state[workoutId]!;
      return { ...state, [workoutId]: { ...targetWorkout, storagePath } };
    },
  },
});

export const randomWorkoutsActions = randomWorkoutsSlice.actions;

export default randomWorkoutsSlice.reducer;
