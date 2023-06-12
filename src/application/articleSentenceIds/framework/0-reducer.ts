import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from '../core/1-constans';

const articleSentenceIdsSlice = createSlice({
  name: 'articleSentenceIds',
  initialState: InitialState,
  reducers: {
    mergeArticleSentenceIds: (
      state,
      { payload }: { payload: { [id: string]: string[] } }
    ) => ({ ...state, ...payload }),
  },
});

export const articleSentenceIdsActions = articleSentenceIdsSlice.actions;

export default articleSentenceIdsSlice.reducer;
