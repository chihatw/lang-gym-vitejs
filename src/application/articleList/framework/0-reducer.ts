import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';

const articleListSlice = createSlice({
  name: 'articleList',
  initialState,
  reducers: {
    initiate: (state) => {
      state.initializing = false;
    },
    setArticleIds: (
      state,
      {
        payload,
      }: {
        payload: { articleIds: string[]; hasMore: boolean; startAfter: number };
      }
    ) => {
      state.articleIds = payload.articleIds;
      state.hasMore = payload.hasMore;
      state.startAfter = payload.startAfter;
    },
    getMoreArticles: (state) => state,
    resetState: () => initialState,
  },
});

export const articleListActions = articleListSlice.actions;

export default articleListSlice.reducer;
