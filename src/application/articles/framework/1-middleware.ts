import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { articlesActions } from './0-reducer';
import { topPageActions } from 'application/topPage/framework/0-reducer';
import { articleListActions } from 'application/articleList/framework/0-reducer';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { ARTILCE_STORAGE_PATH } from 'application/audio/core/1-constants';

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
      case 'articlePage/initiate': {
        const articleId = action.payload as string;

        const uid = (getState() as RootState).authUser.currentUid;
        const articles = (getState() as RootState).articles;

        const articleIds = Object.keys(articles);

        // fetch済みのarticleIdの場合、audioBuffer と Sentences を取得
        if (articleIds.includes(articleId)) {
          dispatch(
            articlePageActions.getArticleAudioBufferStart(
              ARTILCE_STORAGE_PATH + articleId
            )
          );
          dispatch(articlePageActions.getSentencesStart(articleId));
          return;
        }

        // article の取得
        const article = await services.api.articles.fetchArtice(uid, articleId);
        dispatch(
          articlesActions.concatArticles({ [articleId]: article || null })
        );

        // article がない場合、終了
        if (!article) {
          dispatch(articlePageActions.initiated());
          break;
        }

        // articleがあれば、articleIdの場合、audioBuffer と Sentences を取得
        dispatch(
          articlePageActions.getArticleAudioBufferStart(
            ARTILCE_STORAGE_PATH + article.id
          )
        );
        dispatch(articlePageActions.getSentencesStart(article.id));
        break;
      }
      default:
    }
  };

export default [articlesMiddleware];
