import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { articleSentenceIdsActions } from 'application/articleSentenceIds/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { sentencesActions } from './0-reducer';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audio/core/1-constants';

const sentencesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'articlePage/getSentencesStart': {
        const articleId = action.payload as string;
        const articleSentenceIds = (getState() as RootState).articleSentenceIds;
        const articleIds = Object.keys(articleSentenceIds);

        // sentencesがfetch済みの場合、assignmentAudioBuffers を取得
        if (articleIds.includes(articleId)) {
          const sentenceIds = articleSentenceIds[articleId];
          const paths = sentenceIds.map(
            (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
          );
          dispatch(articlePageActions.getAssignmentAudioBuffersStart(paths));
          return;
        }

        // sentencesが未fetchの場合、fetch
        const sentences = await services.api.sentences.fetchSentences(
          articleId
        );

        // sentences がある場合
        if (Object.keys(sentences).length) {
          const sentenceIds = Object.values(sentences)
            .sort((a, b) => a.line - b.line)
            .map((sentence) => sentence.id);
          dispatch(
            articleSentenceIdsActions.mergeArticleSentenceIds({
              [articleId]: sentenceIds,
            })
          );
          dispatch(sentencesActions.mergeSentences(sentences));

          const paths = sentenceIds.map(
            (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
          );
          dispatch(articlePageActions.getAssignmentAudioBuffersStart(paths));
        }
        // sentences がない場合
        else {
          dispatch(
            articleSentenceIdsActions.mergeArticleSentenceIds({
              [articleId]: [],
            })
          );
          dispatch(articlePageActions.initiated());
        }
        break;
      }
      default:
    }
  };

export default [sentencesMiddleware];
