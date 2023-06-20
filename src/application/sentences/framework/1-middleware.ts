import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { sentencesActions } from './0-reducer';

import { getSentenceIds } from '../core/2-services';
import { audioBuffersActions } from 'application/audioBuffers/framework/0-reducer';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audioBuffers/infrastructure/api';

const sentencesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    next(action);
    switch (action.type) {
      case 'sentences/getSentencesStart': {
        const articleId = action.payload as string;
        const sentences = (getState() as RootState).sentences.entities;
        const sentenceIds = getSentenceIds(articleId, Object.values(sentences));

        // sentencesがfetch済みの場合、assignmentAudioBuffers を取得
        if (!!sentenceIds.length) {
          const paths = sentenceIds.map(
            (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
          );
          dispatch(audioBuffersActions.getAudioBuffersStart(paths));
          return;
        }

        // sentencesが未fetchの場合、fetch
        const gotSentences = await services.api.sentences.fetchSentences(
          articleId
        );

        // sentences がある場合
        if (gotSentences.length) {
          const sentenceIds = getSentenceIds(articleId, gotSentences);
          dispatch(sentencesActions.upsertSentences(gotSentences));

          const paths = sentenceIds.map(
            (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
          );
          dispatch(audioBuffersActions.getAudioBuffersStart(paths));
        }
        break;
      }
      default:
    }
  };

export default [sentencesMiddleware];
