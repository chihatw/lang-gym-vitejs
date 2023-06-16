import { IRandomWorkout } from './0-interface';

export const initialState: { [id: string]: IRandomWorkout | null } = {};

export const RANDOM_WORKOUT_STORE_COLLECTION = 'randomWorkouts';

export const RANDOM_WORKOUT_STORAGE_PATH = 'randomWorkout/';
