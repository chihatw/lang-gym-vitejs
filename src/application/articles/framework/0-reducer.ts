import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IArticle } from '../core/0-interface';
import { RootState } from 'main';

const articleAdapter = createEntityAdapter<IArticle>({
  selectId: (article) => article.id,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

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
