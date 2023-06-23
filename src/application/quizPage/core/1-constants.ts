import { IQuizPage } from './0-interface';

export const initialState: IQuizPage = {
  quizId: '',
  initializing: true,
  inputPitchStrs: {},
  inputSpecialMoraArrays: {},
  monitorSpecialMoraArrays: {},
};

export const QUIZ_TIPE = {
  articleAccents: 'articleAccents',
  articleRhythms: 'articleRhythms',
};

export const SPECIAL_MORAS = ['っ', 'ん', 'ー', 'ーん', 'ーっ'];
