import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const quizListSlice = createSlice({
  name: 'quizList',
  initialState,
  reducers: {
    initiate: (state) => {
      state.initializing = false;
    },
    setQuizIds: (
      state,
      {
        payload,
      }: { payload: { answeredIds: string[]; unansweredIds: string[] } }
    ) => {
      state.answeredIds = payload.answeredIds;
      state.unansweredIds = payload.unansweredIds;
    },
    resetState: () => initialState,
  },
});

export const quizListActions = quizListSlice.actions;

export default quizListSlice.reducer;
