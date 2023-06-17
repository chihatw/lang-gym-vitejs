import { createSelector, createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IQuiz } from '../core/0-interface';
import { RootState } from 'main';

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    mergeQuizzes: (
      state,
      { payload }: { payload: { [id: string]: IQuiz | null } }
    ) => ({ ...state, ...payload }),
    unshiftScoreId: (
      state,
      {
        payload: { quizId, scoreId },
      }: { payload: { quizId: string; scoreId: string } }
    ) => {
      const targetQuiz = state[quizId];
      if (!targetQuiz) return state;
      state[quizId] = {
        ...targetQuiz,
        scoreIds: [scoreId, ...targetQuiz.scoreIds],
      };
    },
  },
});

export const quizzesActions = quizzesSlice.actions;

export default quizzesSlice.reducer;
