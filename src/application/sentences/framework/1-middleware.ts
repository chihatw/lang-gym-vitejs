import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { articlePageActions } from 'application/articlePage/framework/0-reducer';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { sentencesActions } from './0-reducer';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audio/core/1-constants';
import { getSentenceIds } from '../core/2-services';

const sentencesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'articlePage/getSentencesStart': {
        const articleId = action.payload as string;
        const sentences = (getState() as RootState).sentences;
        const sentenceIds = getSentenceIds(articleId, sentences);

        // sentencesがfetch済みの場合、assignmentAudioBuffers を取得
        if (!!sentenceIds.length) {
          const paths = sentenceIds.map(
            (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
          );
          dispatch(articlePageActions.getAssignmentAudioBuffersStart(paths));
          return;
        }

        // sentencesが未fetchの場合、fetch
        const gotSentences = await services.api.sentences.fetchSentences(
          articleId
        );

        // sentences がある場合
        if (Object.keys(gotSentences).length) {
          const sentenceIds = getSentenceIds(articleId, gotSentences);
          dispatch(sentencesActions.mergeSentences(gotSentences));

          const paths = sentenceIds.map(
            (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
          );
          dispatch(articlePageActions.getAssignmentAudioBuffersStart(paths));
        }
        break;
      }
      default:
    }
  };

export default [sentencesMiddleware];
