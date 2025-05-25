import { Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';

import { articleListActions } from 'application/articleList/framework/0-reducer';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { audioBuffersActions } from 'application/audioBuffers/framework/0-reducer';
import { ARTILCE_STORAGE_PATH } from 'application/audioBuffers/infrastructure/api';
import { sentencesActions } from 'application/sentences/framework/0-reducer';
import { topPageActions } from 'application/topPage/framework/0-reducer';
import { articlesActions } from './0-reducer';

const articlesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'topPage/initiate': {
        (async () => {
          const uid = (getState() as RootState).authUser.currentUid;
          const articles = await services.api.articles.fetchArticles(uid, 4);
          dispatch(articlesActions.upsertArticles(articles));
          const articleIds = Object.values(articles)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((article) => article.id);
          const hasMore = articleIds.length === 4;
          if (hasMore) {
            articleIds.pop();
          }
          dispatch(topPageActions.setArticleIds({ articleIds, hasMore }));
        })();
        break;
      }
      case 'articleList/initiate': {
        (async () => {
          const uid = (getState() as RootState).authUser.currentUid;
          const articles = await services.api.articles.fetchArticles(uid, 11);
          dispatch(articlesActions.upsertArticles(articles));
          const articleIds = articles
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((article) => article.id);
          const hasMore = articleIds.length === 11;
          let startAfter = 0;
          if (hasMore) {
            articleIds.pop();
            const lastArticleId = [...articleIds].slice(-1)[0];
            const lastArticle = articles.find(
              (article) => article.id === lastArticleId
            )!;
            startAfter = lastArticle.createdAt;
          }
          dispatch(
            articleListActions.setArticleIds({
              articleIds,
              hasMore,
              startAfter,
            })
          );
        })();
        break;
      }
      case 'articleList/getMoreArticles': {
        (async () => {
          const uid = (getState() as RootState).authUser.currentUid;
          let { startAfter, articleIds: currentArticleIds } = (
            getState() as RootState
          ).articleList;
          const articles = await services.api.articles.fetchArticles(
            uid,
            11,
            startAfter
          );
          dispatch(articlesActions.upsertArticles(articles));
          const articleIds = articles
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((article) => article.id);
          const hasMore = articleIds.length === 11;
          startAfter = 0;
          if (hasMore) {
            articleIds.pop();
            const lastArticleId = [...articleIds].slice(-1)[0];
            const lastArticle = articles.find(
              (article) => article.id === lastArticleId
            )!;
            startAfter = lastArticle.createdAt;
          }
          dispatch(
            articleListActions.setArticleIds({
              articleIds: [...currentArticleIds, ...articleIds],
              hasMore,
              startAfter,
            })
          );
        })();
        break;
      }
      case 'articlePage/initiate': {
        (async () => {
          const articleId = typedAction.payload as string;
          const uid = (getState() as RootState).authUser.currentUid;
          const articles = (getState() as RootState).articles;
          const articleIds = Object.keys(articles);
          if (articleIds.includes(articleId)) {
            dispatch(
              audioBuffersActions.getAudioBufferStart(
                ARTILCE_STORAGE_PATH + articleId
              )
            );
            dispatch(sentencesActions.getSentencesStart(articleId));
            dispatch(articlePageActions.setArticleId(articleId));
            return;
          }
          const article = await services.api.articles.fetchArtice(
            uid,
            articleId
          );
          if (!article) return;
          dispatch(articlesActions.addArticle(article));
          dispatch(articlePageActions.setArticleId(article.id));
          dispatch(
            audioBuffersActions.getAudioBufferStart(
              ARTILCE_STORAGE_PATH + article.id
            )
          );
          dispatch(sentencesActions.getSentencesStart(article.id));
        })();
        break;
      }
      default:
    }
    return next(action as any);
  };

export default [articlesMiddleware];
