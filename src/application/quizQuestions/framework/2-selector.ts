import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectQuizQuestion = createSelector(
  [
    (state: RootState) => state.quizQuestions.entities,
    (state, questionId) => questionId,
  ],
  (quizQuestions, questionId) => {
    return quizQuestions[questionId];
  }
);

export const selectSyllablesArray = createSelector(
  [
    (state: RootState) => state.quizQuestions.entities,
    (state, questionId) => questionId,
  ],
  (quizQuestions, questionId) => {
    const question = quizQuestions[questionId];
    if (!question) return [];
    return Object.values(question.syllables);
  }
);
