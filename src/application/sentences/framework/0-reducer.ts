import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../core/1-constants';
import { ISentence } from '../core/0-interface';

const sentencesSlice = createSlice({
  name: 'sentences',
  initialState,
  reducers: {
    getSentencesStart: (state, { payload }: { payload: string }) => state,
    mergeSentences: (
      state,
      { payload }: { payload: { [id: string]: ISentence } }
    ) => ({ ...state, ...payload }),
  },
});

export const sentencesActions = sentencesSlice.actions;

export default sentencesSlice.reducer;
