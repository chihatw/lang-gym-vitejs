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

export type UnansweredQuiz = {
  id: string;
  title: string;
  createdAt: number;
};

// quiz にまとめる
export type Score = {
  id: string;
  score: number;
  createdAt: number;
  questionCount: number;
};

export type AnsweredQuiz = {
  id: string;
  title: string;
  createdAt: number;
  scores: Score[];
};

export type QuizListState = {
  unansweredList: UnansweredQuiz[];
  answeredList: AnsweredQuiz[];
};

const INITIAL_QUIZ_LIST_STATE: QuizListState = {
  unansweredList: [],
  answeredList: [],
};

export type ScoreState = {
  id: string;
  uid: string;
  score: number;
  answers: { [key: string]: string };
  createdAt: number;
  questionSet: string;
};

export const INITIAL_SCORE_STATE: ScoreState = {
  id: '',
  uid: '',
  score: 0,
  answers: {},
  createdAt: 0,
  questionSet: '',
};

export type QuestionSet = {
  id: string;
  uid: string;
  type: 'articleRhythms' | 'articleAccents';
  title: string;
  createdAt: number;
  questionCount: number;
  questionGroups: string[];
};

export type Accents = {
  moras: string[];
  pitchPoint: number;
};

export type Syllable = {
  mora: string;
  disabled: string;
  syllable: string;
  longVowel?: string;
};

// quiz にまとめる
// form で使う変数は quizParams にする
export type Question = {
  id: string;
  question: string;
  japanese: string;
  disableds: number[];
  inputPitchesArray: string[][][];
  correctPitchesArray: string[][][];
  initialPitchesArray: string[][][];
  start: number;
  end: number;
  downloadURL: string;
  inputSpecialMoraArray: string[][];
  monitorSpecialMoraArray: string[][];
  initialSpecialMoraArray: string[][];
  syllablesArray: Syllable[][];
};

export const INITIAL_QUESTION: Question = {
  id: '',
  question: '',
  japanese: '',
  disableds: [],
  inputPitchesArray: [],
  correctPitchesArray: [],
  initialPitchesArray: [],
  start: 0,
  end: 0,
  downloadURL: '',
  inputSpecialMoraArray: [],
  monitorSpecialMoraArray: [],
  initialSpecialMoraArray: [],
  syllablesArray: [],
};

export type QuizState = {
  id: string;
  uid: string;
  type: string;
  title: string;
  quizBlob: Blob | null;
  questions: Question[];
  createdAt: number;
  initializing: boolean;
  questionCount: number;
};

export const INITIAL_QUIZ_STATE: QuizState = {
  id: '',
  uid: '',
  type: '',
  title: '',
  quizBlob: null,
  questions: [],
  createdAt: 0,
  initializing: true,
  questionCount: 0,
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
  resultSeconds: 0,
  roundCount: 1,
  storagePath: '',
  recordCount: 0,
};

export type RandomWorkoutParams = {
  miliSeconds: number;
  isRunning: boolean;
  currentIndex: number;
  isChecking: boolean;
};

export const INITIAL_RANDOM_WORKOUT_PARAMS: RandomWorkoutParams = {
  miliSeconds: 0,
  isRunning: false,
  currentIndex: 0,
  isChecking: false,
};

export type RandomWorkoutState = {
  blobs: { [workoutId: string]: Blob | null };
  params: RandomWorkoutParams;
  workouts: { [workoutId: string]: RandomWorkout };
};

export const INITIAL_RANDOM_WORKOUT_STATE: RandomWorkoutState = {
  blobs: {},
  params: INITIAL_RANDOM_WORKOUT_PARAMS,
  workouts: {},
};

export type State = {
  auth: AuthState;
  layout: LayoutState;
  quizList: QuizListState;
  workout: RandomWorkoutState;
  isFetching: boolean;
  articleList: Article[];
  articlePages: { [articleId: string]: ArticleState };
  audioContext: AudioContext | null;
  articleListParams: ArticleListParams;
  quizzes: { [questionSetId: string]: QuizState }; // quiz と score はまとめる
  scores: { [scoreId: string]: ScoreState }; // quiz と score はまとめる
  blobURLs: {
    [imagePath: string]: string;
  };
};

export const INITIAL_STATE: State = {
  auth: INITIAL_AUTH_STATE,
  layout: INITIAL_LAYOUT_STATE,
  quizList: INITIAL_QUIZ_LIST_STATE,
  workout: INITIAL_RANDOM_WORKOUT_STATE,
  isFetching: false,
  articleList: [],
  articlePages: {},
  audioContext: null,
  articleListParams: INITIAL_ARTICLE_LIST_PARAMS,
  blobURLs: {},
  quizzes: {},
  scores: {},
};
