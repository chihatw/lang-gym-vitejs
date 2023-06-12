import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const articlePageSlice = createSlice({
  name: 'articlePage',
  initialState,
  reducers: {
    initiate: (state, { payload }: { payload: string }) => {
      state.isLoading = true;
    },
    getArticleAudioBufferStart: (state, { payload }: { payload: string }) =>
      state,
    getSentencesStart: (state, { payload }: { payload: string }) => state,
    getAssignmentAudioBuffersStart: (
      state,
      { payload }: { payload: string[] }
    ) => state,
    initiated: (state) => {
      state.isLoading = false;
    },
  },
});

export const articlePageActions = articlePageSlice.actions;

export default articlePageSlice.reducer;
