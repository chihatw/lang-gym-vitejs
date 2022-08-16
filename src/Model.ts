import { FSentences } from 'fsentence-types';

export type User = {
  id: string;
  displayname: string;
};

export type AuthState = {
  uid: string;
  isAdmin: boolean;
  initializing: boolean;
  users: User[];
};

const INITIAL_AUTH_STATE: AuthState = {
  uid: '',
  isAdmin: false,
  initializing: true,
  users: [],
};

export type Article = {
  id: string;
  uid: string;
  marks: string[];
  title: string;
  embedID: string;
  createdAt: number;
  downloadURL: string;
  isShowParse: boolean;
  hasRecButton: boolean;
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
  isShowParse: false,
  isShowAccents: false,
  hasRecButton: false,
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

export type AssignmentSentence = {
  end: number;
  start: number;
  pitchesArray: string[][][];
};

// const INITIAL_ASSIGNMENT_SENTENCE: AssignmentSentence = {
//   end: 0,
//   start: 0,
//   pitchesArray: [],
// };

export type ArticleCard = {
  id: string;
  title: string;
  date: string;
};

// debug
export type ArticleCardsState = {
  cards: ArticleCard[]; // Article[] にして、表示への調整は View 側で行う？
  hasMore: boolean;
  startAfter: number;
};

export const INITIAL_ARICLE_CARDS: ArticleCardsState = {
  cards: [],
  hasMore: false,
  startAfter: 0,
};

export type SentenceParseNew = {
  units: string;
  words: string;
  branches: string;
  sentences: string;
  sentenceArrays: string;
};

type Branch = {
  lock: boolean;
  border: string;
  unitId: string;
  unitType: string;
  joshiLabels: string[];
  isDraggable: boolean;
  isCommentMeishi: boolean;
};

export type SentenceParseProps = {
  units: {
    [unitId: string]: {
      id: string;
      type: string;
      text: string;
      hinshi: string;
      branches: Branch[];
      isTaigendome: boolean;
      parentUnitId: string;
      setsuzokuJoshi: string;
      parentBranchJoshi: string;
    };
  };
  sentences: {
    [sentenceId: string]: {
      id: string;
      color: string;
      bodyTexts: string[];
      shuuJoshi: string;
      buntouText: string;
      juntaiJoshi: string;
      topicUnitId: string;
      topicBranch: Branch | null;
      isTaigendome: boolean;
      bunmatsuText: string;
      buntouSeibuns: {
        text: string;
        hinshi: string;
      }[];
      commentUnitIds: string[];
      juntaiJoshiBunmatsu: string;
    };
  };
  sentenceArrays: string[][];
};

export type ArticleSentenceForm = {
  id: string;
  lineIndex: number;
  articleId: string;
  sentences: FSentences;
};

export type ArticleState = {
  article: Article;
  sentences: Sentence[];
  articleBlob: Blob | null;
  assignmentBlob: Blob | null; // 旧式
  assignmentBlobs: AssignmentBlobs; // 新式
  assignmentDownloadURL: string;
  articleAssignmentSentences: AssignmentSentence[];
  sentenceParseProps: { [sentenceId: string]: SentenceParseProps };
  articleSentenceForms: ArticleSentenceForm[];
};

export const INITIAL_ARTICLE_STATE: ArticleState = {
  article: INITIAL_ARTICLE,
  sentences: [],
  articleBlob: null,
  assignmentBlob: null,
  assignmentBlobs: {},
  assignmentDownloadURL: '',
  articleAssignmentSentences: [],
  sentenceParseProps: {},
  articleSentenceForms: [],
};

export type SearchState = {
  keywords: string[];
  hitItems: Sentence[];
};

export const INITIAL_SEARCH_STATE: SearchState = {
  keywords: [],
  hitItems: [],
};

export type LayoutState = {
  width: number;
  height: number;
  isBrave: boolean;
};

const INITIAL_LAYOUT_STATE: LayoutState = {
  width: window.innerWidth,
  height: window.innerHeight,
  isBrave: false,
};

export type UnansweredQuiz = {
  id: string;
  title: string;
  createdAt: number;
};

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
  isChecking: boolean;
  questionSet: string;
};

export const INITIAL_SCORE_STATE: ScoreState = {
  id: '',
  uid: '',
  score: 0,
  answers: {},
  createdAt: 0,
  isChecking: false,
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
  userDisplayname: string;
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
  userDisplayname: string;
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
  userDisplayname: '',
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
  isFetching: boolean;
  audioContext: AudioContext | null;
  topPage: ArticleCardsState;
  articlePage: ArticleState;
  articlesPage: ArticleCardsState;
  search: SearchState;
  layout: LayoutState;
  quiz: QuizState;
  score: ScoreState;
  quizzes: QuizListState;
  workout: RandomWorkoutState;
  blobURLs: {
    [imagePath: string]: string;
  };
  memo: {
    articlePages: { [articleId: string]: ArticleState };
    hitItems: { [keywords: string]: Sentence[] };
    quizzes: { [questionSetId: string]: QuizState };
    scores: { [scoreId: string]: ScoreState };
  };
};

export const INITIAL_STATE: State = {
  auth: INITIAL_AUTH_STATE,
  isFetching: false,
  topPage: INITIAL_ARICLE_CARDS,
  articlePage: INITIAL_ARTICLE_STATE,
  articlesPage: INITIAL_ARICLE_CARDS,
  audioContext: null,
  search: INITIAL_SEARCH_STATE,
  layout: INITIAL_LAYOUT_STATE,
  quiz: INITIAL_QUIZ_STATE,
  score: INITIAL_SCORE_STATE,
  quizzes: INITIAL_QUIZ_LIST_STATE,
  workout: INITIAL_RANDOM_WORKOUT_STATE,
  blobURLs: {},
  memo: { articlePages: {}, hitItems: {}, quizzes: {}, scores: {} },
};
