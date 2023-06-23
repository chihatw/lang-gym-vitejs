import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IQuizScore } from '../core/0-interface';
import { RootState } from 'main';

const quizScoreAdapter = createEntityAdapter<IQuizScore>({
  selectId: (quizQuestion) => quizQuestion.scoreId,
});

const quizScoresSlice = createSlice({
  name: 'quizScore',
  initialState: quizScoreAdapter.getInitialState(),
  reducers: {
    setQuizScores: (state, { payload }: { payload: IQuizScore[] }) => {
      quizScoreAdapter.setAll(state, payload);
    },
    addQuizScore: (state, { payload }: { payload: IQuizScore }) => {
      quizScoreAdapter.upsertOne(state, payload);
    },
    addQuizScores: (state, { payload }: { payload: IQuizScore[] }) => {
      quizScoreAdapter.upsertMany(state, payload);
    },
  },
});

export const quizScoresActions = quizScoresSlice.actions;

export default quizScoresSlice.reducer;

export const { selectById: selectScoreById } = quizScoreAdapter.getSelectors(
  (state: RootState) => state.quizScores
);
