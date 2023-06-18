import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectScoreByScoreId = createSelector(
  [(state: RootState) => state.quizScores, (state, scoreId) => scoreId],
  (quizScores, scoreId) => quizScores[scoreId]
);
