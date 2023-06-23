export interface IQuizPage {
  quizId: string;
  initializing: boolean;
  inputPitchStrs: { [questionId: string]: string };
  inputSpecialMoraArrays: { [questionId: string]: string[][] };
  monitorSpecialMoraArrays: { [questionId: string]: string[][] };
}
