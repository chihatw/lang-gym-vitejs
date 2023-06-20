import { createSelector } from '@reduxjs/toolkit';

import {
  ARTILCE_STORAGE_PATH,
  ASSIGNMENTS_STORAGE_PATH,
} from 'application/audioBuffers/infrastructure/api';
import { getSentenceIds } from 'application/sentences/core/2-services';
import { RootState } from 'main';

export const selectArticle = createSelector(
  [
    (state: RootState) => state.articles.entities,
    (state: RootState) => state.ariclePage.articleId,
  ],
  (articles, articleId) => articles[articleId]
);

export const selectSentenceIds = createSelector(
  [
    (state: RootState) => state.sentences.entities,
    (state: RootState) => state.ariclePage.articleId,
  ],
  (sentences, articleId) => {
    return getSentenceIds(articleId, Object.values(sentences));
  }
);

export const selectCreateAt = createSelector(
  [
    (state: RootState) => state.articles.entities,
    (state: RootState) => state.ariclePage.articleId,
  ],
  (articles, articleId) => {
    let year = 0;
    let month = 0;
    let day = 0;
    const article = articles[articleId];
    if (!!article) {
      const date = new Date(article!.createdAt);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
    }

    return { year, month, day };
  }
);

export const selectRecordedSentence = createSelector(
  [
    (state: RootState) => state.sentences.entities,
    (state: RootState) => state.ariclePage.recordSentenceId,
  ],
  (sentences, recordSentenceId) => sentences[recordSentenceId]
);

export const selectAssignmentAudioBuffer = createSelector(
  [
    (state: RootState) => state.audioBuffers.entities,
    (state, sentenceId) => sentenceId,
  ],
  (audioBuffers, sentenceId) => {
    const path = ASSIGNMENTS_STORAGE_PATH + sentenceId;
    return audioBuffers[path]?.audioBuffer;
  }
);

export const selectAudioBuffer = createSelector(
  [
    (state: RootState) => state.audioBuffers.entities,
    (state: RootState) => state.ariclePage.articleId,
  ],
  (audioBuffers, articleId) => {
    if (!articleId) return;

    const path = ARTILCE_STORAGE_PATH + articleId;
    const target = audioBuffers[path];
    if (!target) return;

    return target.audioBuffer;
  }
);

export const selectArticleBufferStartAndEnd = createSelector(
  [
    (state: RootState) => state.sentences.entities,
    (state: RootState) => state.ariclePage.articleId,
  ],
  (sentences, articleId) => {
    const sentenceIds = getSentenceIds(articleId, Object.values(sentences));
    try {
      return {
        start: sentences[sentenceIds[0]]!.start,
        end: sentences[sentenceIds.slice(-1)[0]]!.end,
      };
    } catch (e) {
      return { start: 0, end: 0 };
    }
  }
);
