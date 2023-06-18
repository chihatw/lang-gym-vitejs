import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IQuizQuestion } from '../core/0-interface';

const quizQuestionAdapter = createEntityAdapter<IQuizQuestion>({
  selectId: (quizQuestion) => quizQuestion.quizQuestionId,
  sortComparer: (a, b) => a.index.toString().localeCompare(b.index.toString()),
});

const quizQuestionsSlice = createSlice({
  name: 'quizQuestions',
  initialState: quizQuestionAdapter.getInitialState(),
  reducers: {
    setQuizQuestions: (state, { payload }: { payload: IQuizQuestion[] }) => {
      quizQuestionAdapter.setAll(state, payload);
    },
    mergeQuizQuestions: (
      state,
      { payload }: { payload: { [id: string]: IQuizQuestion } }
    ) => ({ ...state, ...payload }),
  },
});

export const quizQuestionsActions = quizQuestionsSlice.actions;

export default quizQuestionsSlice.reducer;
