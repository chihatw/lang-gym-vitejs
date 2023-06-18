import { IRandomWorkoutPage } from './0-interface';

export const initialState: IRandomWorkoutPage = {
  workoutId: '',
  currentIndex: 0,
  miliSeconds: 0,
  isRunning: false,
  isChecking: false,
  initializing: true,
};
