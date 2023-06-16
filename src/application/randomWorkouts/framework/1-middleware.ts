import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { randomWorkoutsActions } from './0-reducer';
import { randomWorkoutListActions } from 'application/randomWorkoutList/framework/0-reducer';
import { audioActions } from 'application/audio/framework/0-reducer';
import { RANDOM_WORKOUT_STORAGE_PATH } from '../core/1-constants';
import { randomWorkoutPageActions } from 'application/randomWorkoutPage/framework/0-reducer';
import { buildCueIds, calcBpm, miliSecondsToSeconds } from '../core/2-services';

const randomWorkoutsMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'randomWorkoutList/initiate': {
        const uid = (getState() as RootState).authUser.currentUid;

        const randomWorkouts =
          await services.api.randomWorkouts.fetchRandomWorkouts(uid);

        const workoutIds = Object.values(randomWorkouts)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((randomWorkout) => randomWorkout.id);

        dispatch(randomWorkoutsActions.mergeRandomWorkouts(randomWorkouts));
        dispatch(randomWorkoutListActions.setWorkoutIds(workoutIds));

        const paths = Object.values(randomWorkouts)
          .map((workout) => workout.storagePath)
          .filter((i) => i);

        dispatch(audioActions.getAudioBuffersStart(paths));
        return;
      }
      case 'randomWorkouts/clearStoragePath': {
        const workoutId = action.payload as string;
        const path = RANDOM_WORKOUT_STORAGE_PATH + workoutId;
        dispatch(audioActions.removeFetchedAudioBuffer(path));
        await services.api.randomWorkouts.clearStoragePath(workoutId);
        return;
      }
      case 'randomWorkoutPage/initiate': {
        const workoutId = action.payload as string;

        const randomWorkouts = (getState() as RootState).randomWorkouts;

        const randomWorkoutIds = Object.keys(randomWorkouts);

        // fetch 済みの場合、
        if (randomWorkoutIds.includes(workoutId)) {
          dispatch(randomWorkoutPageActions.setWorkoutId(workoutId));
          return;
        }

        // randomWorkout の取得
        const randomWorkout =
          await services.api.randomWorkouts.fetchRandomWorkout(workoutId);

        dispatch(
          randomWorkoutsActions.mergeRandomWorkouts({
            [workoutId]: randomWorkout,
          })
        );
        dispatch(
          randomWorkoutPageActions.setWorkoutId(randomWorkout?.id || '')
        );
        break;
      }
      case 'randomWorkoutPage/startRecording': {
        const { workoutId } = (getState() as RootState).randomWorkoutPage;
        const randomWorkouts = (getState() as RootState).randomWorkouts;

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

        return;
      }
      case 'randomWorkoutPage/stopRecording': {
        const { workoutId, miliSeconds } = (getState() as RootState)
          .randomWorkoutPage;
        const randomWorkouts = (getState() as RootState).randomWorkouts;

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

        return;
      }
      case 'randomWorkoutPage/saveRecordedAudioBuffer': {
        const workoutId = action.payload as string;
        const randomWorkouts = (getState() as RootState).randomWorkouts;

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

        return;
      }
      default:
    }
  };

export default [randomWorkoutsMiddleware];
