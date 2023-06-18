import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectRandomWorkout = createSelector(
  [(state: RootState) => state.randomWorkouts, (state, workoutId) => workoutId],
  (randomWorkouts, workoutId) => randomWorkouts[workoutId]
);

export const selectAudioBuffer = createSelector(
  [
    (state: RootState) => state.randomWorkouts,
    (state: RootState) => state.audio.fetchedAudioBuffers,
    (state, workoutId) => workoutId,
  ],
  (randomWorkouts, fetchedAudioBuffers, workoutId) => {
    const randomWorkout = randomWorkouts[workoutId];
    if (!randomWorkout || !randomWorkout.storagePath) return null;
    return fetchedAudioBuffers[randomWorkout.storagePath];
  }
);
