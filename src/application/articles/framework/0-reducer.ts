import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { IArticle } from '../core/0-interface';

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    mergeArticles: (
      state,
      { payload }: { payload: { [id: string]: IArticle | null } }
    ) => ({ ...state, ...payload }),
  },
});

export const articlesActions = articlesSlice.actions;

export default articlesSlice.reducer;
