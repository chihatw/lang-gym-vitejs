import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectWorkout = createSelector(
  [
    (state: RootState) => state.randomWorkouts.entities,
    (state: RootState) => state.randomWorkoutPage.workoutId,
  ],
  (randomWorkouts, workoutId) => randomWorkouts[workoutId]
);

export const selectPitchStr = createSelector(
  [
    (state: RootState) => state.randomWorkouts.entities,
    (state: RootState) => state.randomWorkoutPage.workoutId,
    (state, cueId) => cueId,
  ],
  (randomWorkouts, workoutId, cueId) => {
    const workout = randomWorkouts[workoutId];
    if (!workout) return '';

    const cue = workout.cues.find((item) => item.id === cueId);
    if (!cue) return '';

    return cue.pitchStr;
  }
);
