import { ISyllable } from 'application/quizQuestions/core/0-interface';

export type QuizFormQuestion = {
  id: string;
  end: number;
  start: number;
  japanese: string;
  disableds: number[]; // pitchQuiz の非題化を wordIndex で指定
  syllablesArray: ISyllable[][];
  inputPitchStr: string;
  correctPitchStr: string;
  inputSpecialMoraArray: string[][];
  monitorSpecialMoraArray: string[][];
};

export type QuizFormState = {
  type: string;
  title: string;
  quizBlob: Blob | null;
  createdAt: number;
  questions: QuizFormQuestion[];
  questionCount: number;
};

export const INITIAL_QUIZ_FORM_STATE: QuizFormState = {
  type: '',
  title: '',
  quizBlob: null,
  createdAt: 0,
  questions: [],
  questionCount: 0,
};
