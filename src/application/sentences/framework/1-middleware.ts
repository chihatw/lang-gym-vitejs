import { Middleware } from '@reduxjs/toolkit';
import { Services } from 'infrastructure/services';
import { RootState } from 'main';
import { sentencesActions } from './0-reducer';

import { audioBuffersActions } from 'application/audioBuffers/framework/0-reducer';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audioBuffers/infrastructure/api';
import { getSentenceIds } from '../core/2-services';

const sentencesMiddleware =
  (services: Services): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action: unknown): unknown => {
    next(action as any);
    const typedAction = action as { type: string; payload?: any };
    switch (typedAction.type) {
      case 'sentences/getSentencesStart': {
        (async () => {
          const articleId = typedAction.payload as string;
          const sentences = (getState() as RootState).sentences.entities;
          const sentenceIds = getSentenceIds(
            articleId,
            Object.values(sentences)
          );
          if (!!sentenceIds.length) {
            const paths = sentenceIds.map(
              (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
            );
            dispatch(audioBuffersActions.getAudioBuffersStart(paths));
            return;
          }
          const gotSentences = await services.api.sentences.fetchSentences(
            articleId
          );
          if (gotSentences.length) {
            const sentenceIds = getSentenceIds(articleId, gotSentences);
            dispatch(sentencesActions.upsertSentences(gotSentences));
            const paths = sentenceIds.map(
              (sentenceId) => ASSIGNMENTS_STORAGE_PATH + sentenceId
            );
            dispatch(audioBuffersActions.getAudioBuffersStart(paths));
          }
        })();
        break;
      }
      default:
    }
    return next(action as any);
  };

export default [sentencesMiddleware];
