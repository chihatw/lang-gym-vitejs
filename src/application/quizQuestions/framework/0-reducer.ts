import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';
import { IQuizQuestion } from '../core/0-interface';

const quizQuestionAdapter = createEntityAdapter<IQuizQuestion>();

const quizQuestionsSlice = createSlice({
  name: 'quizQuestions',
  initialState: quizQuestionAdapter.getInitialState(),
  reducers: {
    setQuizQuestions: (state, { payload }: { payload: IQuizQuestion[] }) => {
      quizQuestionAdapter.setAll(state, payload);
    },
    addQuizQuestions: (state, { payload }: { payload: IQuizQuestion[] }) => {
      quizQuestionAdapter.upsertMany(state, payload);
    },
  },
});

export const quizQuestionsActions = quizQuestionsSlice.actions;

export default quizQuestionsSlice.reducer;

export const { selectById: selectQuestionById } =
  quizQuestionAdapter.getSelectors((state: RootState) => state.quizQuestions);
