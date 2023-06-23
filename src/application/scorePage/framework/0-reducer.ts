import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const scorePageSlice = createSlice({
  name: 'scorePage',
  initialState,
  reducers: {
    initiate: (
      state,
      { payload }: { payload: { quizId: string; scoreCreatedAt: string } }
    ) => state,
    setQuizIdScoreCreatedAt: (
      state,
      { payload }: { payload: { quizId: string; scoreCreatedAt: string } }
    ) => {
      state.quizId = payload.quizId;
      state.scoreCreatedAt = payload.scoreCreatedAt;
    },
  },
});

export const scorePageActions = scorePageSlice.actions;

export default scorePageSlice.reducer;
