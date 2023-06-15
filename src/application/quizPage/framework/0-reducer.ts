import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { ISyllable } from 'application/quizQuestions/core/0-interface';
import { changePitchesArray, getKanaSpecialMora } from '../core/2-services';

const quizPageSlice = createSlice({
  name: 'quizPage',
  initialState: initialState,
  reducers: {
    initiate: (state, { payload }: { payload: string }) => state,
    setQuizId: (state, { payload }: { payload: string }) => {
      state.quizId = payload;
    },
    setQuestionProps: (
      state,
      {
        payload,
      }: {
        payload: {
          inputPitchStrs: { [questionId: string]: string };
          syllablesArrays: { [questionId: string]: ISyllable[][] };
          inputSpecialMoraArrays: { [questionId: string]: string[][] };
          monitorSpecialMoraArrays: { [questionId: string]: string[][] };
        };
      }
    ) => {
      state.inputPitchStrs = payload.inputPitchStrs;
      state.syllablesArrays = payload.syllablesArrays;
      state.inputSpecialMoraArrays = payload.inputSpecialMoraArrays;
      state.monitorSpecialMoraArrays = payload.monitorSpecialMoraArrays;
    },
    setInputPitchStr: (
      state,
      {
        payload: { questionId, wordIndex, moraIndex },
      }: {
        payload: {
          questionId: string;
          wordIndex: number;
          moraIndex: number;
        };
      }
    ) => {
      const targetInputPitchStr = state.inputPitchStrs[questionId];

      const updatedPitchStr: string = changePitchesArray(
        targetInputPitchStr,
        wordIndex,
        moraIndex
      );

      state.inputPitchStrs = {
        ...state.inputPitchStrs,
        [questionId]: updatedPitchStr,
      };
    },
    setSyllableSpecialMora: (
      state,
      {
        payload: {
          questionId,
          wordIndex,
          syllableIndex,
          specialMora,
          syllable,
        },
      }: {
        payload: {
          questionId: string;
          wordIndex: number;
          syllableIndex: number;
          specialMora: string;
          syllable: ISyllable;
        };
      }
    ) => {
      const targetInputSpecialMorraArray = [
        ...state.inputSpecialMoraArrays[questionId],
      ];

      const targetMonitorSpecialMoraArray = [
        ...state.monitorSpecialMoraArrays[questionId],
      ];

      targetInputSpecialMorraArray[wordIndex][syllableIndex] = specialMora;

      const monitorString = getKanaSpecialMora({
        mora: syllable.kana,
        fixedVowel: syllable.longVowel,
        specialMora,
      });
      targetMonitorSpecialMoraArray[wordIndex][syllableIndex] = monitorString;

      state.inputSpecialMoraArrays = {
        ...state.inputSpecialMoraArrays,
        [questionId]: targetInputSpecialMorraArray,
      };
      state.monitorSpecialMoraArrays = {
        ...state.monitorSpecialMoraArrays,
        [questionId]: targetMonitorSpecialMoraArray,
      };
    },
    clearSyllableSpecialMora: (
      state,
      {
        payload: { questionId, wordIndex, syllableIndex },
      }: {
        payload: {
          questionId: string;
          wordIndex: number;
          syllableIndex: number;
        };
      }
    ) => {
      const targetInputSpecialMorraArray = [
        ...state.inputSpecialMoraArrays[questionId],
      ];

      const targetMonitorSpecialMoraArray = [
        ...state.monitorSpecialMoraArrays[questionId],
      ];

      targetInputSpecialMorraArray[wordIndex][syllableIndex] = '';
      targetMonitorSpecialMoraArray[wordIndex][syllableIndex] = '';

      state.inputSpecialMoraArrays = {
        ...state.inputSpecialMoraArrays,
        [questionId]: targetInputSpecialMorraArray,
      };
      state.monitorSpecialMoraArrays = {
        ...state.monitorSpecialMoraArrays,
        [questionId]: targetMonitorSpecialMoraArray,
      };
    },
    updateQuizScoreStart: (state, { payload }: { payload: number }) => state,
  },
});

export const quizPageActions = quizPageSlice.actions;

export default quizPageSlice.reducer;
