import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';
import { IQuiz } from '../core/0-interface';

const quizAdapter = createEntityAdapter<IQuiz>();

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState: quizAdapter.getInitialState(),
  reducers: {
    setQuizzes: (state, { payload }: { payload: IQuiz[] }) => {
      quizAdapter.setAll(state, payload);
    },
    addQuiz: (state, { payload }: { payload: IQuiz }) => {
      quizAdapter.addOne(state, payload);
    },
    unshiftScoreId: (
      state,
      {
        payload: { quizId, scoreId },
      }: { payload: { quizId: string; scoreId: string } }
    ) => {
      const targetQuiz = state.entities[quizId];
      if (!targetQuiz) return state;
      state.entities[quizId] = {
        ...targetQuiz,
        scoreIds: [scoreId, ...targetQuiz.scoreIds],
      };
    },
  },
});

export const quizzesActions = quizzesSlice.actions;

export default quizzesSlice.reducer;

export const { selectById: selectQuizById } = quizAdapter.getSelectors(
  (state: RootState) => state.quizzes
);
