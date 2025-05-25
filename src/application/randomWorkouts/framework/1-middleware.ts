import { Middleware } from '@reduxjs/toolkit';
import { audioBuffersActions } from 'application/audioBuffers/framework/0-reducer';
import { randomWorkoutListActions } from 'application/randomWorkoutList/framework/0-reducer';
import { randomWorkoutPageActions } from 'application/randomWorkoutPage/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { RANDOM_WORKOUT_STORAGE_PATH } from '../core/1-constants';
import { buildCueIds, calcBpm, miliSecondsToSeconds } from '../core/2-services';
import { randomWorkoutsActions } from './0-reducer';

const randomWorkoutsMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'randomWorkoutList/initiate': {
        (async () => {
          const uid = (getState() as RootState).authUser.currentUid;
          const randomWorkouts =
            await services.api.randomWorkouts.fetchRandomWorkouts(uid);
          const workoutIds = Object.values(randomWorkouts)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((randomWorkout) => randomWorkout.id);
          dispatch(randomWorkoutsActions.upsertWorkouts(randomWorkouts));
          dispatch(randomWorkoutListActions.setWorkoutIds(workoutIds));
          const paths = Object.values(randomWorkouts)
            .map((workout) => workout.storagePath)
            .filter((i) => i);
          dispatch(audioBuffersActions.getAudioBuffersStart(paths));
        })();
        return;
      }
      case 'randomWorkouts/clearStoragePath': {
        (async () => {
          const workoutId = typedAction.payload as string;
          const path = RANDOM_WORKOUT_STORAGE_PATH + workoutId;
          dispatch(audioBuffersActions.removeFetchedAudioBuffer(path));
          await services.api.randomWorkouts.clearStoragePath(workoutId);
        })();
        return;
      }
      case 'randomWorkoutPage/initiate': {
        (async () => {
          const workoutId = typedAction.payload as string;
          const randomWorkouts = (getState() as RootState).randomWorkouts
            .entities;
          if (randomWorkouts[workoutId]) {
            dispatch(randomWorkoutPageActions.setWorkoutId(workoutId));
            return;
          }
          const randomWorkout =
            await services.api.randomWorkouts.fetchRandomWorkout(workoutId);
          if (!randomWorkout) return;
          dispatch(randomWorkoutsActions.addWorkout(randomWorkout));
          dispatch(randomWorkoutPageActions.setWorkoutId(randomWorkout.id));
        })();
        break;
      }
      case 'randomWorkoutPage/startRecording': {
        (async () => {
          const { workoutId } = (getState() as RootState).randomWorkoutPage;
          const randomWorkouts = (getState() as RootState).randomWorkouts
            .entities;
          const workout = randomWorkouts[workoutId];
          if (!workout) return;
          const updatedCueIds = buildCueIds(workout.cues, workout.roundCount);
          dispatch(
            randomWorkoutsActions.startRecording({
              workoutId,
              cueIds: updatedCueIds,
            })
          );
          await services.api.randomWorkouts.startRecording(
            workoutId,
            updatedCueIds,
            workout.recordCount + 1
          );
        })();
        return;
      }
      case 'randomWorkoutPage/stopRecording': {
        (async () => {
          const { workoutId, miliSeconds } = (getState() as RootState)
            .randomWorkoutPage;
          const randomWorkouts = (getState() as RootState).randomWorkouts
            .entities;
          const workout = randomWorkouts[workoutId];
          if (!workout) return;
          const bpm = calcBpm(
            miliSeconds,
            workout.beatCount,
            workout.roundCount,
            workout.cueIds.length
          );
          const seconds = miliSecondsToSeconds(miliSeconds);
          dispatch(
            randomWorkoutsActions.stopRecording({ workoutId, bpm, seconds })
          );
        })();
        return;
      }
      case 'randomWorkoutPage/saveRecordedAudioBuffer': {
        (async () => {
          const workoutId = typedAction.payload as string;
          const randomWorkouts = (getState() as RootState).randomWorkouts
            .entities;
          const workout = randomWorkouts[workoutId];
          if (!workout) return;
          const storagePath = RANDOM_WORKOUT_STORAGE_PATH + workoutId;
          dispatch(
            randomWorkoutsActions.setStoragePath({ workoutId, storagePath })
          );
          await services.api.randomWorkouts.saveRecordedAudioBuffer({
            workoutId,
            storagePath,
            recordCount: workout.recordCount,
            resultBpm: workout.resultBpm,
            resultSeconds: workout.resultSeconds,
          });
        })();
        return;
      }
      default:
    }
    return next(action as any);
  };

export default [randomWorkoutsMiddleware];
