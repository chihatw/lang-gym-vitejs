import { createSelector } from '@reduxjs/toolkit';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audio/core/1-constants';
import { RootState } from 'main';

export const selectArticle = createSelector(
  [
    (state: RootState) => state.articles.entities,
    (state: RootState) => state.ariclePage.articleId,
  ],
  (articles, articleId) => articles[articleId]
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
    (state: RootState) => state.sentences,
    (state: RootState) => state.ariclePage.recordSentenceId,
  ],
  (sentences, recordSentenceId) => sentences[recordSentenceId]
);

export const selectAssignmentAudioBuffer = createSelector(
  [
    (state: RootState) => state.audio.fetchedAudioBuffers,
    (state, sentenceId) => sentenceId,
  ],
  (fetchedAudioBuffers, sentenceId) => {
    const path = ASSIGNMENTS_STORAGE_PATH + sentenceId;
    return fetchedAudioBuffers[path];
  }
);
