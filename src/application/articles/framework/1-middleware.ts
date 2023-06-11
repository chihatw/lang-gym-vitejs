import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { articlesActions } from './0-reducer';
import { topPageActions } from 'application/topPage/framework/0-reducer';
import { articleListActions } from 'application/articleList/framework/0-reducer';

const articlesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'topPage/initiate': {
        const uid = (getState() as RootState).authUser.currentUid;
        // articles の取得
        const articles = await services.api.articles.fetchArticles(uid, 4);
        dispatch(articlesActions.concatArticles(articles));

        const articleIds = Object.values(articles)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((article) => article.id);

        const hasMore = articleIds.length === 4;

        if (hasMore) {
          articleIds.pop();
        }
        dispatch(topPageActions.setArticleIds({ articleIds, hasMore }));
        break;
      }
      case 'articleList/initiate': {
        const uid = (getState() as RootState).authUser.currentUid;
        // articles の取得
        const articles = await services.api.articles.fetchArticles(uid, 11);
        dispatch(articlesActions.concatArticles(articles));

        const articleIds = Object.values(articles)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((article) => article.id);

        const hasMore = articleIds.length === 11;

        let startAfter = 0;

        if (hasMore) {
          articleIds.pop();
          const lastArticleId = [...articleIds].slice(-1)[0];
          const lastArticle = articles[lastArticleId];
          startAfter = lastArticle.createdAt;
        }

        dispatch(
          articleListActions.setArticleIds({ articleIds, hasMore, startAfter })
        );

        break;
      }
      case 'articleList/getMoreArticles': {
        const uid = (getState() as RootState).authUser.currentUid;
        let { startAfter, articleIds: currentArticleIds } = (
          getState() as RootState
        ).articleList;

        // articles の取得
        const articles = await services.api.articles.fetchArticles(
          uid,
          11,
          startAfter
        );
        dispatch(articlesActions.concatArticles(articles));

        const articleIds = Object.values(articles)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((article) => article.id);

        const hasMore = articleIds.length === 11;

        startAfter = 0;

        if (hasMore) {
          articleIds.pop();
          const lastArticleId = [...articleIds].slice(-1)[0];
          const lastArticle = articles[lastArticleId];
          startAfter = lastArticle.createdAt;
        }

        dispatch(
          articleListActions.setArticleIds({
            articleIds: [...currentArticleIds, ...articleIds],
            hasMore,
            startAfter,
          })
        );

        break;
      }
      default:
    }
  };

export default [articlesMiddleware];
