import { IQuiz } from './0-interface';

export function getAnsweredIds(quizzes: { [id: string]: IQuiz }) {
  return Object.values(quizzes)
    .filter((quiz) => !!quiz.scoreIds.length)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((q) => q.id);
}

export function getUnansweredIds(quizzes: { [id: string]: IQuiz }) {
  return Object.values(quizzes)
    .filter((quiz) => !quiz.scoreIds.length)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((q) => q.id);
}
