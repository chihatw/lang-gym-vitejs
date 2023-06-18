import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'main';

export const selectQuiz = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.scorePage.quizId,
  ],
  (quizzes, quizId) => quizzes[quizId]
);

export const selectScore = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.quizScores,
    (state: RootState) => state.scorePage.quizId,
    (state: RootState) => state.scorePage.scoreCreatedAt,
  ],
  (quizzes, quizScores, quizId, scoreCreatedAt) => {
    const quiz = quizzes[quizId];
    if (!quiz) return null;
    return quiz.scoreIds
      .map((scoreId) => quizScores[scoreId])
      .find((score) => score.createdAt === Number(scoreCreatedAt));
  }
);

export const selectQuizAudioBuffer = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.scorePage.quizId,
    (state: RootState) => state.audio.fetchedAudioBuffers,
  ],
  (quizzes, quizId, fetchedAudioBuffers) => {
    const quiz = quizzes[quizId];
    if (!quiz) return;

    return fetchedAudioBuffers[quiz.downloadURL];
  }
);

export const selectAnsweredSpecialMoraArray = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.quizScores,
    (state: RootState) => state.scorePage.quizId,
    (state: RootState) => state.scorePage.scoreCreatedAt,
    (state, index) => index,
  ],
  (quizzes, quizScores, quizId, scoreCreatedAt, index) => {
    const quiz = quizzes[quizId];
    if (!quiz) return [];

    const score = quiz.scoreIds
      .map((scoreId) => quizScores[scoreId])
      .find((score) => score.createdAt === Number(scoreCreatedAt));
    if (!score) return [];

    return score.rhythmAnswers[index]
      .split('\n')
      .map((word) => word.split(',').map((specialMora) => specialMora));
  }
);
