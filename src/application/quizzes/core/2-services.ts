import { IQuiz } from './0-interface';

export function getAnsweredIds(quizzes: IQuiz[]) {
  return quizzes
    .filter((quiz) => !!quiz.scoreIds.length)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((q) => q.id);
}

export function getUnansweredIds(quizzes: IQuiz[]) {
  return quizzes
    .filter((quiz) => !quiz.scoreIds.length)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((q) => q.id);
}
