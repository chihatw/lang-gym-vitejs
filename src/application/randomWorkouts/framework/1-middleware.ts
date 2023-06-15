import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { randomWorkoutsActions } from './0-reducer';
import { randomWorkoutListActions } from 'application/randomWorkoutList/framework/0-reducer';
import { audioActions } from 'application/audio/framework/0-reducer';
import { RANDOM_WORKOUT_STORAGE_PATH } from '../core/1-constants';

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
      default:
    }
  };

export default [randomWorkoutsMiddleware];
