export type RandomWorkoutCue = {
  id: string;
  label: string;
  pitchStr: string;
  imagePath: string;
};

export const INITIAL_CUE: RandomWorkoutCue = {
  id: '',
  label: '',
  pitchStr: '',
  imagePath: '',
};

export type RandomWorkout = {
  id: string;
  uid: string;
  cues: RandomWorkoutCue[];
  cueIds: string[];
  title: string;
  beatCount: number;
  targetBpm: number;
  resultBpm: number;
  createdAt: number;
  roundCount: number;
  storagePath: string;
  recordCount: number;
  resultSeconds: number;
};

export const INITIAL_RANDOM_WORKOUT: RandomWorkout = {
  id: '',
  uid: '',
  cues: [],
  title: '',
  cueIds: [],
  beatCount: 0,
  targetBpm: 0,
  resultBpm: 0,
  createdAt: 0,
  roundCount: 1,
  storagePath: '',
  recordCount: 0,
  resultSeconds: 0,
};

// todo 将来的に blobs を、App に統合、params は局部的な RandomWorkoutFormState で対応する
// workouts は App 層で取得するようにして、
// RandomWorkoutFormState 作成時点で blob を作成、メモ化
export type RandomWorkoutState = {
  blobs: { [workoutId: string]: Blob | null };
  workouts: { [workoutId: string]: RandomWorkout };
};

export const INITIAL_RANDOM_WORKOUT_STATE: RandomWorkoutState = {
  blobs: {},
  workouts: {},
};

export type State = {
  workout: RandomWorkoutState;
  blobs: { [downloadURL: string]: Blob };
  blobURLs: {
    [imagePath: string]: string;
  };
};

export const INITIAL_STATE: State = {
  workout: INITIAL_RANDOM_WORKOUT_STATE,
  blobURLs: {},
  blobs: {},
};
