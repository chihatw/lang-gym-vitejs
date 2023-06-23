import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectAudioBuffer = createSelector(
  [
    (state: RootState) => state.randomWorkouts.entities,
    (state: RootState) => state.audioBuffers.entities,
    (state, workoutId) => workoutId,
  ],
  (randomWorkouts, audioBuffers, workoutId) => {
    const randomWorkout = randomWorkouts[workoutId];
    if (!randomWorkout || !randomWorkout.storagePath) return;
    return audioBuffers[randomWorkout.storagePath]?.audioBuffer;
  }
);
