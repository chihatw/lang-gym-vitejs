import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectArticleRowProps = createSelector(
  [
    (state: RootState) => state.articles.entities,
    (state, articleId) => articleId,
  ],
  (articles, articleId) => {
    const article = articles[articleId];
    if (!article) {
      return { title: '', year: 0, month: 0, day: 0 };
    }
    const date = new Date(article.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return { title: article.title, year, month, day };
  }
);
