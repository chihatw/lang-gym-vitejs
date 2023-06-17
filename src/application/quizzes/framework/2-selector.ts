import { RootState } from 'main';
import { createSelector } from 'reselect';

export const selectQuizByQuizId = createSelector(
  [(state: RootState) => state.quizzes, (state, quizId) => quizId],
  (quizzes, quizId) =>
    Object.values(quizzes).find((quiz) => quiz && quiz.id === String(quizId)) ||
    null
);
