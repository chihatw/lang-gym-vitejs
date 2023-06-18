import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';

import { articlesActions } from './0-reducer';
import { topPageActions } from 'application/topPage/framework/0-reducer';
import { articleListActions } from 'application/articleList/framework/0-reducer';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';
import { audioActions } from 'application/audio/framework/0-reducer';
import { sentencesActions } from 'application/sentences/framework/0-reducer';

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
        dispatch(articlesActions.upsertArticles(articles));

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

        break;
      }
      case 'articlePage/initiate': {
        const articleId = action.payload as string;

        const uid = (getState() as RootState).authUser.currentUid;
        const articles = (getState() as RootState).articles;

        const articleIds = Object.keys(articles);

        // fetch済みのarticleIdの場合、audioBuffer と Sentences を取得
        if (articleIds.includes(articleId)) {
          dispatch(
            audioActions.getAudioBufferStart(ARTILCE_STORAGE_PATH + articleId)
          );
          dispatch(sentencesActions.getSentencesStart(articleId));
          dispatch(articlePageActions.setArticleId(articleId));
          return;
        }

        // article の取得
        const article = await services.api.articles.fetchArtice(uid, articleId);

        // article がない場合、終了
        if (!article) break;

        dispatch(articlesActions.addArticle(article));
        dispatch(articlePageActions.setArticleId(article.id));

        // articleがあれば、articleIdの場合、audioBuffer と Sentences を取得
        dispatch(
          audioActions.getAudioBufferStart(ARTILCE_STORAGE_PATH + article.id)
        );
        dispatch(sentencesActions.getSentencesStart(article.id));
        break;
      }
      default:
    }
  };

export default [articlesMiddleware];
