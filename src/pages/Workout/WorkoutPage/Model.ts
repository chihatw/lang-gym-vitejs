export type WorkoutFormState = {
  isRunning: boolean;
  isChecking: boolean;
  currentIndex: number;
};

export const INITIAL_WORKOUT_FORM_STATE: WorkoutFormState = {
  isRunning: false,
  isChecking: false,
  currentIndex: 0,
};
