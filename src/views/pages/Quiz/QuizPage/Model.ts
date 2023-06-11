import { Syllable } from '../../../../Model';

// type は pitch と rhythm に簡略化？
export const QuizTypes = {
  articleAccents: 'articleAccents',
  articleRhythms: 'articleRhythms',
};

export type QuizFormQuestion = {
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

export type QuizFormState = {
  audioContext: AudioContext | null;
  title: string;
  createdAt: number;
  type: string;
  questions: QuizFormQuestion[];
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
