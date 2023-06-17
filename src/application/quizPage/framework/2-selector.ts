import { buildWordPitchStrs } from 'application/utils/utils';
import { RootState } from 'main';
import { createSelector } from 'reselect';

export const selectQuizByQuizPageQuizId = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.quizPage.quizId,
  ],
  (quizzes, quizId) =>
    Object.values(quizzes).find((quiz) => quiz && quiz.id === String(quizId)) ||
    null
);

export const selectInputPitchStr = createSelector(
  [
    (state: RootState) => state.quizPage.inputPitchStrs,
    (state, questionId) => questionId,
  ],
  (inputPitchStrs, questionId) => {
    const inputPitchStr = inputPitchStrs[questionId] || '';
    const wordPitchStrs = buildWordPitchStrs(inputPitchStr);
    return { inputPitchStr, wordPitchStrs };
  }
);

export const selectQuizAudioBuffer = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.quizPage.quizId,
    (state: RootState) => state.audio.fetchedAudioBuffers,
  ],
  (quizzes, quizId, fetchedAudioBuffers) => {
    const quiz =
      Object.values(quizzes).find(
        (quiz) => quiz && quiz.id === String(quizId)
      ) || null;

    if (!quiz) return null;
    return fetchedAudioBuffers[quiz.downloadURL] || null;
  }
);

export const selectWordDisabled = createSelector(
  [
    (state: RootState) => state.quizQuestions,
    (state, { questionId, wordIndex }) => ({ questionId, wordIndex }),
  ],
  (quizQuestions, { questionId, wordIndex }) => {
    const question = quizQuestions[questionId];
    return question ? question.disableds.includes(wordIndex) : true;
  }
);
