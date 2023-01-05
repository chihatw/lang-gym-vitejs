export type WorkingMemoryCard = {
  id: string;
  end: number;
  type: string;
  start: number;
  label?: string;
  pitchStr?: string;
};

export type PitchCard = {
  id: string;
  end: number;
  start: number;
  pitchStr: string;
};

export type User = {
  id: string;
  displayname: string;
};

export type AuthState = {
  uid: string;
  users: User[];
  isAdmin: boolean;
  initializing: boolean; // auth を cloud から受け取る前にサインイン画面が表示されるのを防ぐ
};

const INITIAL_AUTH_STATE: AuthState = {
  uid: '',
  users: [],
  isAdmin: false,
  initializing: true,
};

export type Article = {
  id: string;
  uid: string;
  marks: string[];
  title: string;
  embedID: string;
  createdAt: number;
  downloadURL: string;
  isShowAccents: boolean;
};

const INITIAL_ARTICLE: Article = {
  id: '',
  uid: '',
  title: '',
  marks: [],
  embedID: '',
  createdAt: 0,
  downloadURL: '',
  isShowAccents: false,
};

export type ArticleListParams = {
  hasMore: boolean;
  startAfter: number;
};

export const INITIAL_ARTICLE_LIST_PARAMS: ArticleListParams = {
  hasMore: false,
  startAfter: 0,
};

export type Sentence = {
  id: string;
  end: number;
  kana: string;
  line: number;
  title: string;
  start: number;
  article: string;
  chinese: string;
  japanese: string;
  original: string;
  createdAt: number;
  pitchesArray: string[][][];
  storagePath: string;
  storageDuration: number;
};

export const INITIAL_SENTENCE: Sentence = {
  id: '',
  end: 0,
  kana: '',
  line: 0,
  title: '',
  start: 0,
  article: '',
  chinese: '',
  japanese: '',
  original: '',
  createdAt: 0,
  pitchesArray: [],
  storagePath: '',
  storageDuration: 0,
};

export type AssignmentBlobs = { [key: string]: Blob | null };

export type ArticleState = {
  article: Article;
  sentences: Sentence[];
  articleBlob: Blob | null;
  assignmentBlobs: AssignmentBlobs;
};

export const INITIAL_ARTICLE_STATE: ArticleState = {
  article: INITIAL_ARTICLE,
  sentences: [],
  articleBlob: null,
  assignmentBlobs: {},
};

export type LayoutState = {
  width: number;
  height: number;
};

const INITIAL_LAYOUT_STATE: LayoutState = {
  width: window.innerWidth,
  height: window.innerHeight,
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

export type WorkingMemoryLog = {
  id: string;
  cueIds: string[];
  offset: number;
  createdAt: number;
  removedAt: number;
  practice: {
    [index: number]: {
      createdAt: number;
      playedAts: number[];
      selected: string;
    };
  };
  result: {
    createdAt: number;
    tappeds: string[];
  };
  correctRatio: number;
};

export const INITIAL_WORKING_MEMORY_LOG: WorkingMemoryLog = {
  id: '',
  cueIds: [],
  offset: 0,
  createdAt: 0,
  removedAt: 0,
  practice: {},
  result: { createdAt: 0, tappeds: [] },
  correctRatio: 0,
};

export type WorkingMemory = {
  id: string;
  uid: string;
  logs: { [id: string]: WorkingMemoryLog };
  step: number;
  title: string;
  cueIds: string[];
  offset: number;
  isActive: boolean;
  createdAt: number;
  baseCueCount: number;
};

export const INITIAL_WORKING_MEMORY: WorkingMemory = {
  id: '',
  uid: '',
  cueIds: [],
  title: '',
  offset: 0,
  logs: {},
  isActive: false,
  createdAt: 0,
  step: 0,
  baseCueCount: 0,
};

export type State = {
  auth: AuthState;
  layout: LayoutState;
  workout: RandomWorkoutState;
  workingMemories: { [id: string]: WorkingMemory };
  isFetching: boolean;
  articleList: Article[];
  articlePages: { [articleId: string]: ArticleState };
  audioContext: AudioContext | null;
  articleListParams: ArticleListParams;
  quizzes: Quiz[];
  blobs: { [downloadURL: string]: Blob };
  blobURLs: {
    [imagePath: string]: string;
  };
};

export const INITIAL_STATE: State = {
  auth: INITIAL_AUTH_STATE,
  layout: INITIAL_LAYOUT_STATE,
  workout: INITIAL_RANDOM_WORKOUT_STATE,
  isFetching: false,
  articleList: [],
  articlePages: {},
  audioContext: null,
  workingMemories: {},
  articleListParams: INITIAL_ARTICLE_LIST_PARAMS,
  blobURLs: {},
  quizzes: [],
  blobs: {},
};
