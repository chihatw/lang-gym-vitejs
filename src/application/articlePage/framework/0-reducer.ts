import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const articlePageSlice = createSlice({
  name: 'articlePage',
  initialState,
  reducers: {
    initiate: (state, { payload }: { payload: string }) => {
      state.initializing = false;
    },
    setArticleId: (state, { payload }: { payload: string }) => {
      state.articleId = payload;
    },
    setRecordSentenceId: (state, { payload }: { payload: string }) => {
      state.recordSentenceId = payload;
    },
    startRecording: (state) => {
      state.isRecording = true;
    },
    stopRecording: (state) => {
      state.isRecording = false;
      state.isChecking = true;
    },
    playedRecordedAudio: (state) => {
      state.playedRecordedAudio = true;
    },
    resetRecordedAudio: (state) => ({
      ...initialState,
      articleId: state.articleId,
    }),
    clearState: () => initialState,
  },
});

export const articlePageActions = articlePageSlice.actions;

export default articlePageSlice.reducer;
