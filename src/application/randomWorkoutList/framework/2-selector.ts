import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectAudioBuffer = createSelector(
  [
    (state: RootState) => state.randomWorkouts.entities,
    (state: RootState) => state.audio.fetchedAudioBuffers,
    (state, workoutId) => workoutId,
  ],
  (randomWorkouts, fetchedAudioBuffers, workoutId) => {
    const randomWorkout = randomWorkouts[workoutId];
    if (!randomWorkout || !randomWorkout.storagePath) return;
    return fetchedAudioBuffers[randomWorkout.storagePath];
  }
);
