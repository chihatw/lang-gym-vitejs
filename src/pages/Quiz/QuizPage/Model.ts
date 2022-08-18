import { Syllable } from '../../../Model';

// type は pitch と rhythm に簡略化？
export const QuizTypes = {
  articleAccents: 'articleAccents',
  articleRhythms: 'articleRhythms',
};

export type QuizQuestion = {
  id: string;
  end: number;
  start: number;
  japanese: string;
  disableds: number[]; // pitchQuiz の非題化を wordIndex で指定
  syllablesArray: Syllable[][];
  inputPitchesArray: string[][][];
  correctPitchesArray: string[][][];
  inputSpecialMoraArray: string[][];
  monitorSpecialMoraArray: string[][];
};

export const INITIAL_QUIZ_QUESTION: QuizQuestion = {
  id: '',
  end: 0,
  start: 0,
  japanese: '',
  disableds: [],
  syllablesArray: [],
  inputPitchesArray: [],
  correctPitchesArray: [],
  inputSpecialMoraArray: [],
  monitorSpecialMoraArray: [],
};

export type QuizFormState = {
  audioContext: AudioContext | null;
  title: string;
  createdAt: number;
  type: string;
  questions: QuizQuestion[];
  quizBlob: Blob | null;
  questionCount: number;
};

export const INITIAL_QUIZ_FORM_STATE: QuizFormState = {
  type: '',
  title: '',
  quizBlob: null,
  createdAt: 0,
  questions: [],
  audioContext: null,
  questionCount: 0,
};
