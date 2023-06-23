import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IRandomWorkout } from '../core/0-interface';
import { RootState } from 'main';

const randomWorkoutAdapter = createEntityAdapter<IRandomWorkout>({
  selectId: (workout) => workout.id,
});

const randomWorkoutsSlice = createSlice({
  name: 'randomWorkouts',
  initialState: randomWorkoutAdapter.getInitialState(),
  reducers: {
    addWorkout: (state, { payload }: { payload: IRandomWorkout }) => {
      randomWorkoutAdapter.addOne(state, payload);
    },
    upsertWorkouts: (state, { payload }: { payload: IRandomWorkout[] }) => {
      randomWorkoutAdapter.upsertMany(state, payload);
    },
    clearStoragePath: (state, { payload }: { payload: string }) => {
      if (!state.entities[payload]) return state;

      state.entities[payload]!.storagePath = '';
      state.entities[payload]!.resultBpm = 0;
      state.entities[payload]!.resultSeconds = 0;
    },
    startRecording: (
      state,
      {
        payload: { workoutId, cueIds },
      }: { payload: { workoutId: string; cueIds: string[] } }
    ) => {
      if (!state.entities[workoutId]) return state;

      state.entities[workoutId]!.cueIds = cueIds;
      state.entities[workoutId]!.recordCount++;
    },
    stopRecording: (
      state,
      {
        payload: { workoutId, bpm, seconds },
      }: { payload: { workoutId: string; bpm: number; seconds: number } }
    ) => {
      if (!state.entities[workoutId]) return state;

      state.entities[workoutId]!.resultBpm = bpm;
      state.entities[workoutId]!.resultSeconds = seconds;
    },
    setStoragePath: (
      state,
      {
        payload: { workoutId, storagePath },
      }: { payload: { workoutId: string; storagePath: string } }
    ) => {
      const targetWorkout = state.entities[workoutId]!;

      if (!state.entities[workoutId]) return state;
      state.entities[workoutId]!.storagePath = storagePath;
    },
  },
});

export const randomWorkoutsActions = randomWorkoutsSlice.actions;

export default randomWorkoutsSlice.reducer;

export const { selectById: selectRandomWorkoutById } =
  randomWorkoutAdapter.getSelectors((state: RootState) => state.randomWorkouts);
