import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const randomWorkoutPageSlice = createSlice({
  name: 'randomWorkoutPage',
  initialState,
  reducers: {
    initiate: (state, { payload }: { payload: string }) => {
      state.initializing = false;
    },
    setWorkoutId: (state, { payload }: { payload: string }) => {
      state.workoutId = payload;
    },
    setShowOpeningPane: (state, { payload }: { payload: boolean }) => {
      state.showOpeningPane = payload;
    },
    startRecording: (state) => {
      state.isRunning = true;
    },
    stopRecording: (state) => {
      state.isRunning = false;
      state.isChecking = true;
    },
    cancelRecording: (state) => ({
      ...initialState,
      workoutId: state.workoutId,
    }),
    setMiliSeconds: (state, { payload }: { payload: number }) => {
      state.miliSeconds = payload;
    },
    increseCurrentIndex: (state) => {
      state.currentIndex++;
    },
    abandonRecordedAudioBuffer: (state) => ({
      ...initialState,
      workoutId: state.workoutId,
    }),
    saveRecordedAudioBuffer: (state, { payload }: { payload: string }) =>
      initialState,
    clearState: () => initialState,
  },
});

export const randomWorkoutPageActions = randomWorkoutPageSlice.actions;

export default randomWorkoutPageSlice.reducer;
