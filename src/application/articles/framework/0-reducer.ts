import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'main';
import { IArticle } from '../core/0-interface';

const articleAdapter = createEntityAdapter<IArticle>();

const articlesSlice = createSlice({
  name: 'articles',
  initialState: articleAdapter.getInitialState(),
  reducers: {
    upsertArticles: (state, { payload }: { payload: IArticle[] }) => {
      articleAdapter.upsertMany(state, payload);
    },
    addArticle: (state, { payload }: { payload: IArticle }) => {
      articleAdapter.addOne(state, payload);
    },
  },
});

export const articlesActions = articlesSlice.actions;

export default articlesSlice.reducer;

export const { selectById: selectArticleById } = articleAdapter.getSelectors(
  (state: RootState) => state.articles
);
