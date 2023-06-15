import { ISyllable } from 'application/quizQuestions/core/0-interface';

export interface IQuizPage {
  quizId: string;
  inputPitchStrs: { [questionId: string]: string };
  syllablesArrays: { [questionId: string]: ISyllable[][] };
  inputSpecialMoraArrays: { [questionId: string]: string[][] };
  monitorSpecialMoraArrays: { [questionId: string]: string[][] };
}
