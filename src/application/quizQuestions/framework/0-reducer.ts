import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IQuizQuestion } from '../core/0-interface';

const quizQuestionsSlice = createSlice({
  name: 'quizQuestions',
  initialState,
  reducers: {
    mergeQuizQuestions: (
      state,
      { payload }: { payload: { [id: string]: IQuizQuestion } }
    ) => ({ ...state, ...payload }),
  },
});

export const quizQuestionsActions = quizQuestionsSlice.actions;

export default quizQuestionsSlice.reducer;
