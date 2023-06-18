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
    return inputPitchStrs[questionId] || '';
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
    const question = quizQuestions.entities[questionId];
    return question ? question.disableds.includes(wordIndex) : true;
  }
);

export const selectInputSpecialMoraArray = createSelector(
  [
    (state: RootState) => state.quizPage.inputSpecialMoraArrays,
    (state, questionId) => questionId,
  ],
  (inputSpecialMoraArrays, questionId) => inputSpecialMoraArrays[questionId]
);

export const selectSyllable = createSelector(
  [
    (state: RootState) => state.quizQuestions.entities,
    (
      state,
      {
        questionId,
        wordIndex,
        syllableIndex,
      }: {
        questionId: string;
        wordIndex: number;
        syllableIndex: number;
      }
    ) => ({
      questionId,
      wordIndex,
      syllableIndex,
    }),
  ],

  (quizQuestions, { questionId, wordIndex, syllableIndex }) => {
    const question = quizQuestions[questionId];
    if (!question) return null;
    return Object.values(question.syllables)[wordIndex][syllableIndex];
  }
);

export const selectAnsweredSpecialMoraArray = createSelector(
  [
    (state: RootState) => state.quizzes,
    (state: RootState) => state.scorePage.quizId,
    (state: RootState) => state.scorePage.scoreCreatedAt,
    (state: RootState) => state.quizScores.entities,
    (state, index) => index,
  ],
  (quizzes, quizId, scoreCreatedAt, quizScores, index) => {
    const quiz = quizzes[quizId];
    if (!quiz) return [];

    const score = quiz.scoreIds
      .map((scoreId) => quizScores[scoreId])
      .find((score) => score && score.createdAt === Number(scoreCreatedAt));
    if (!score) return [];

    return score.rhythmAnswers[index]
      .split('\n')
      .map((word) => word.split(','));
  }
);

export const selectMonitorSpecialMoraArray = createSelector(
  [
    (state: RootState) => state.quizPage.monitorSpecialMoraArrays,
    (state, questionId) => questionId,
  ],
  (monitorSpecialMoraArrays, questionId) => monitorSpecialMoraArrays[questionId]
);
