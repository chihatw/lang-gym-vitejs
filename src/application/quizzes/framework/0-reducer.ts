import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IQuiz } from '../core/0-interface';

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    mergeQuizzes: (
      state,
      { payload }: { payload: { [id: string]: IQuiz | null } }
    ) => ({ ...state, ...payload }),
  },
});

export const quizzesActions = quizzesSlice.actions;

export default quizzesSlice.reducer;
