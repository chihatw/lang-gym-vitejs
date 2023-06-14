export type User = {
  id: string;
  displayname: string;
};

export type QuizScore = {
  score: number;
  createdAt: number;
  pitchAnswers: string[];
  rhythmAnswers: string[];
};

export const INITIAL_QUIZ_SCORE: QuizScore = {
  score: 0,
  createdAt: 0,
  pitchAnswers: [],
  rhythmAnswers: [],
};

export type QuizQuestion = {
  japanese: string; // pitchQuiz で利用
  pitchStr: string; // pitchQuiz で利用
  disableds: number[]; // pitchQuiz, rhythmQuiz の非題化を wordIndex で指定
  end: number; // rhythmQuiz で利用
  start: number; // rhythmQuiz で利用
  syllables: { [index: number]: Syllable[] }; // rhythmQuiz で利用
};

export const INITIAL_QUIZ_QUESTION: QuizQuestion = {
  end: 0,
  start: 0,
  pitchStr: '',
  japanese: '',
  disableds: [],
  syllables: {},
};

export type QuizScores = { [createdAt: number]: QuizScore };
export type QuizQuestions = { [index: number]: QuizQuestion };

export type Quiz = {
  id: string;
  uid: string;
  type: string;
  title: string;
  scores: QuizScores;
  questions: QuizQuestions;
  createdAt: number;
  downloadURL: string;
  questionCount: number;
};

export const INITIAL_QUIZ: Quiz = {
  id: '',
  uid: '',
  type: '',
  title: '',
  scores: {},
  questions: {},
  createdAt: 0,
  downloadURL: '',
  questionCount: 0,
};

export type Syllable = {
  kana: string;
  longVowel: string;
  specialMora: string;
};

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
  isFetching: boolean;
  quizzes: Quiz[];
  blobs: { [downloadURL: string]: Blob };
  blobURLs: {
    [imagePath: string]: string;
  };
};

export const INITIAL_STATE: State = {
  workout: INITIAL_RANDOM_WORKOUT_STATE,
  isFetching: false,
  blobURLs: {},
  quizzes: [],
  blobs: {},
};
