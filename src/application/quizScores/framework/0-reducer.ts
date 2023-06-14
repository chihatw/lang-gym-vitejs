import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IQuizScore } from '../core/0-interface';

const quizScoresSlice = createSlice({
  name: 'quizScore',
  initialState: initialState,
  reducers: {
    mergeQuizScores: (
      state,
      { payload }: { payload: { [id: string]: IQuizScore } }
    ) => ({ ...state, ...payload }),
  },
});

export const quizScoresActions = quizScoresSlice.actions;

export default quizScoresSlice.reducer;
