export interface IQuizPage {
  quizId: string;
  inputPitchStrs: { [questionId: string]: string };
  inputSpecialMoraArrays: { [questionId: string]: string[][] };
  monitorSpecialMoraArrays: { [questionId: string]: string[][] };
}
